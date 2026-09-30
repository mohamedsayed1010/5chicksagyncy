import { useId, useMemo, useRef, useState } from 'react';
import { useApi } from './auth.jsx';
import { useInvalidate, useList, errorMessage } from './data.js';
import { formatBytes, uploadMedia } from './media.js';
import { Button, EmptyState, ErrorState, Field, Loading, MediaThumb, Modal, TextInput, useFeedback } from './ui.jsx';

// Browse / search / filter the library, upload new files, and pick one.
export function MediaPicker({ accept = 'any', onSelect, onClose }) {
  const api = useApi();
  const invalidate = useInvalidate();
  const { toast } = useFeedback();
  const media = useList('media', { order: 'created_at', ascending: false });
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState(accept === 'any' ? 'all' : accept);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const items = useMemo(
    () =>
      (media.data || []).filter(
        (m) => (kind === 'all' || m.kind === kind) && (!query || m.filename.toLowerCase().includes(query.toLowerCase()))
      ),
    [media.data, kind, query]
  );

  const upload = async (files) => {
    setBusy(true);
    try {
      let last;
      for (const file of files) last = await uploadMedia(api, file);
      invalidate();
      toast(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
      if (files.length === 1 && last) onSelect(last);
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      wide
      title="Media library"
      onClose={onClose}
      footer={<Button onClick={onClose}>Cancel</Button>}
    >
      <div className="a-media-toolbar">
        <TextInput label="Search" value={query} onChange={setQuery} placeholder="File name" />
        {accept === 'any' && (
          <Field label="Type" id="media-type">
            <select id="media-type" className="a-input" value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="all">All</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </Field>
        )}
        <div className="a-media-toolbar__upload">
          <input
            ref={fileRef}
            type="file"
            hidden
            multiple
            accept={accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*,application/pdf'}
            onChange={(e) => {
              if (e.target.files.length) upload([...e.target.files]);
              e.target.value = '';
            }}
          />
          <Button variant="primary" busy={busy} onClick={() => fileRef.current.click()}>Upload</Button>
        </div>
      </div>
      {media.isLoading ? (
        <Loading />
      ) : media.error ? (
        <ErrorState error={media.error} onRetry={media.refetch} />
      ) : items.length === 0 ? (
        <EmptyState title="No files found" text="Upload a file or change the search." />
      ) : (
        <ul className="a-media-grid">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="a-media-tile" onClick={() => onSelect(item)} aria-label={`Use ${item.filename}`}>
                <MediaThumb url={item.url} kind={item.kind} />
                <span className="a-media-tile__name">{item.filename}</span>
                <span className="a-media-tile__meta">
                  {item.width ? `${item.width}×${item.height} · ` : ''}
                  {formatBytes(item.size_bytes)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

// A form field holding a media URL: preview + choose from library/upload + clear + manual URL.
export function MediaField({ label, value, onChange, accept = 'image', hint }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <Field label={label} hint={hint} id={id}>
      <div className="a-media-field">
        <MediaThumb url={value} kind={accept} />
        <div className="a-media-field__controls">
          <input id={id} className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="Choose a file or paste a URL" />
          <div className="a-row">
            <Button onClick={() => setOpen(true)}>Choose…</Button>
            {value && <Button variant="ghost" onClick={() => onChange('')}>Clear</Button>}
          </div>
        </div>
      </div>
      {open && (
        <MediaPicker
          accept={accept}
          onClose={() => setOpen(false)}
          onSelect={(item) => {
            onChange(item.url);
            setOpen(false);
          }}
        />
      )}
    </Field>
  );
}
