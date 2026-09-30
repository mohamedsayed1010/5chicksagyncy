import { useMemo, useRef, useState } from 'react';
import { useApi } from '../auth.jsx';
import { errorMessage, useInvalidate, useList } from '../data.js';
import { deleteMedia, findUsage, formatBytes, replaceMedia, uploadMedia } from '../media.js';
import { assetUrl } from '../../cms/resolve.js';
import { Badge, Button, Card, EmptyState, ErrorState, Field, Loading, MediaThumb, PageHeader, TextInput, Toggle, useFeedback } from '../ui.jsx';

export default function MediaLibraryPage() {
  const api = useApi();
  const invalidate = useInvalidate();
  const { toast, confirm } = useFeedback();
  const media = useList('media', { order: 'created_at', ascending: false });
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [convert, setConvert] = useState(true);
  const uploadRef = useRef(null);
  const replaceRef = useRef(null);

  const items = useMemo(
    () => (media.data || []).filter((m) => (kind === 'all' || m.kind === kind) && (!query || m.filename.toLowerCase().includes(query.toLowerCase()))),
    [media.data, kind, query]
  );
  const selected = (media.data || []).find((m) => m.id === selectedId);

  const run = async (label, fn) => {
    setBusy(true);
    try {
      await fn();
      invalidate();
      toast(label);
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (item) => {
    const usage = await findUsage(api, item.url).catch(() => []);
    const ok = await confirm({
      title: `Delete ${item.filename}?`,
      message: usage.length
        ? 'This file is still used on the website. Pages that use it will show a broken image or video.'
        : item.source === 'static'
          ? 'This removes it from the library only; the file itself ships with the website.'
          : 'The file is removed from storage permanently.',
      details: usage,
      confirmLabel: 'Delete',
      danger: true
    });
    if (ok) run('File deleted', async () => {
      await deleteMedia(api, item);
      setSelectedId(null);
    });
  };

  return (
    <>
      <PageHeader
        title="Media library"
        crumbs={[['Media']]}
        actions={
          <>
            <input
              ref={uploadRef}
              type="file"
              hidden
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={(e) => {
                const files = [...e.target.files];
                e.target.value = '';
                if (files.length) run(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`, async () => {
                  for (const file of files) await uploadMedia(api, file, { convertImages: convert });
                });
              }}
            />
            <Button variant="primary" busy={busy} onClick={() => uploadRef.current.click()}>Upload files</Button>
          </>
        }
      />
      <div className="a-media-toolbar">
        <TextInput label="Search" value={query} onChange={setQuery} placeholder="File name" />
        <Field label="Type" id="library-type">
          <select id="library-type" className="a-input" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">All files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </Field>
        <Toggle label="Convert JPG/PNG uploads to WebP" checked={convert} onChange={setConvert} />
      </div>
      <div className="a-media-layout">
        <div>
          {media.isLoading ? (
            <Loading />
          ) : media.error ? (
            <ErrorState error={media.error} onRetry={media.refetch} />
          ) : items.length === 0 ? (
            <EmptyState title="No files" text={query || kind !== 'all' ? 'Nothing matches the search.' : 'Upload images, videos or PDFs.'} />
          ) : (
            <ul className="a-media-grid">
              {items.map((item) => (
                <li key={item.id}>
                  <button type="button" className={`a-media-tile${item.id === selectedId ? ' is-selected' : ''}`} onClick={() => setSelectedId(item.id)} aria-pressed={item.id === selectedId}>
                    <MediaThumb url={item.url} kind={item.kind} />
                    <span className="a-media-tile__name">{item.filename}</span>
                    <span className="a-media-tile__meta">{item.kind} · {formatBytes(item.size_bytes)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="a-media-details" aria-live="polite">
          {selected ? (
            <Card title={selected.filename}>
              <div className="a-media-preview">
                {selected.kind === 'video' ? (
                  <video src={assetUrl(selected.url)} controls preload="metadata" />
                ) : selected.kind === 'image' ? (
                  <img src={assetUrl(selected.url)} alt="" />
                ) : (
                  <a href={assetUrl(selected.url)} target="_blank" rel="noopener noreferrer">Open document ↗</a>
                )}
              </div>
              <dl className="a-meta">
                <dt>Type</dt><dd>{selected.mime_type || selected.kind}</dd>
                <dt>Dimensions</dt><dd>{selected.width ? `${selected.width} × ${selected.height}px` : '—'}</dd>
                {selected.duration_seconds && (<><dt>Duration</dt><dd>{selected.duration_seconds}s</dd></>)}
                <dt>Size</dt><dd>{formatBytes(selected.size_bytes)}</dd>
                <dt>Source</dt><dd>{selected.source === 'static' ? <Badge>Website file</Badge> : <Badge tone="success">Storage</Badge>}</dd>
                <dt>URL</dt><dd className="a-break">{selected.url}</dd>
              </dl>
              <div className="a-row">
                <Button onClick={() => navigator.clipboard?.writeText(selected.url).then(() => toast('URL copied'))}>Copy URL</Button>
                {selected.source === 'media' && (
                  <>
                    <input
                      ref={replaceRef}
                      type="file"
                      hidden
                      accept={selected.kind === 'image' ? 'image/*' : selected.kind === 'video' ? 'video/*' : 'application/pdf'}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        e.target.value = '';
                        if (file) run('File replaced (every page using it now shows the new file)', () => replaceMedia(api, selected, file));
                      }}
                    />
                    <Button busy={busy} onClick={() => replaceRef.current.click()}>Replace…</Button>
                  </>
                )}
                <Button variant="danger" onClick={() => onDelete(selected)}>Delete</Button>
              </div>
            </Card>
          ) : (
            <p className="a-muted">Select a file to see its details.</p>
          )}
        </aside>
      </div>
    </>
  );
}
