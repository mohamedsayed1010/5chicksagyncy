import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import CollectionList from '../CollectionList.jsx';
import { MediaField } from '../MediaPicker.jsx';
import { BiRowField, SaveBar, useRecordEditor } from '../editorKit.jsx';
import { errorMessage, tempId, useInvalidate, useList } from '../data.js';
import { uploadMedia } from '../media.js';
import { useApi } from '../auth.jsx';
import { slugify, validate } from '../validation.js';
import { BilingualField, Button, Card, ErrorState, Loading, MediaThumb, PageHeader, Repeater, Select, TextInput, Toggle, useFeedback } from '../ui.jsx';

export function ProjectsList() {
  return (
    <CollectionList
      table="projects"
      title="Projects"
      basePath="/admin/projects"
      newLabel="+ New project"
      nameField="title_en"
      thumbField="cover_url"
      describe={(p) => [p.client, p.category, `/portfolio/${p.slug}`].filter(Boolean).join(' · ')}
      publicPath={(p) => `/portfolio/${p.slug}`}
    />
  );
}

const blankProject = () => ({
  slug: '', published: false, title_en: '', title_ar: '', description_en: '', description_ar: '', client: '', category: '',
  cover_url: '', external_url: '', service_id: null, tags: [], seo_title_en: '', seo_title_ar: '', seo_description_en: '', seo_description_ar: '', og_image_url: ''
});

// Comma-separated tags; keeps the typed text so a trailing comma/space is not swallowed.
function TagsInput({ value, onChange }) {
  const [text, setText] = useState(value.join(', '));
  return (
    <TextInput
      label="Tags"
      value={text}
      hint="Comma separated"
      onChange={(v) => {
        setText(v);
        onChange(v.split(',').map((t) => t.trim()).filter(Boolean));
      }}
    />
  );
}

const kindFromUrl = (url) => (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url || '') ? 'video' : 'image');

export function ProjectEditor() {
  const { id } = useParams();
  const api = useApi();
  const invalidate = useInvalidate();
  const { toast } = useFeedback();
  const services = useList('services');
  const editor = useRecordEditor({ table: 'projects', id, child: { table: 'project_media', key: 'project_id' }, blank: blankProject, basePath: '/admin/projects', label: 'Project' });
  const { query, isNew, draft, setDraft, children: media, setChildren: setMedia, dirty, saving, save, reset, bi, setBi, set } = editor;
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const errors = useMemo(() => {
    if (!draft) return {};
    const e = validate(draft, { title_en: ['required'], title_ar: ['required'], slug: ['slug'], external_url: ['link'] });
    media.forEach((item, i) => {
      if (!item.url) e[`media-${i}`] = `Gallery item ${i + 1} has no file`;
    });
    return e;
  }, [draft, media]);
  if (query.isLoading || !draft) return <Loading />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;

  // Upload any number of images/videos straight into the gallery.
  const uploadToGallery = async (files) => {
    setUploading(true);
    try {
      const added = [];
      for (const file of files) {
        const item = await uploadMedia(api, file);
        added.push({ id: tempId(), kind: item.kind === 'video' ? 'video' : 'image', url: item.url, poster_url: '', alt_en: '', alt_ar: '', width: item.width, height: item.height });
      }
      setMedia((list) => [...list, ...added]);
      invalidate();
      toast(`${added.length} file${added.length > 1 ? 's' : ''} added — save the project to keep them`);
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="a-editor">
      <PageHeader
        title={isNew ? 'New project' : draft.title_en || 'Project'}
        crumbs={[['Projects', '/admin/projects'], [isNew ? 'New' : draft.title_en]]}
        actions={!isNew && draft.published && <a className="a-btn a-btn--ghost" href={`/portfolio/${draft.slug}`} target="_blank" rel="noopener noreferrer">View page ↗</a>}
      />
      <div className="a-editor__grid">
        <div className="a-editor__main">
          <Card title="Project">
            <BilingualField
              label="Title"
              required
              value={bi('title')}
              error={{ en: errors.title_en, ar: errors.title_ar }}
              onChange={(value) =>
                setDraft((d) => ({ ...d, title_en: value.en, title_ar: value.ar, slug: isNew && (!d.slug || d.slug === slugify(d.title_en)) ? slugify(value.en) : d.slug }))
              }
            />
            <BilingualField label="Description" multiline rows={6} hint="Separate paragraphs with a blank line." value={bi('description')} onChange={setBi('description')} />
          </Card>
          <Card
            title={`Gallery (${media.length})`}
            description="Any number of images and videos, shown in this order on the project page."
            actions={
              <>
                <input ref={fileRef} type="file" hidden multiple accept="image/*,video/*" onChange={(e) => { if (e.target.files.length) uploadToGallery([...e.target.files]); e.target.value = ''; }} />
                <Button variant="primary" busy={uploading} onClick={() => fileRef.current.click()}>Upload images/videos</Button>
              </>
            }
          >
            {Object.entries(errors).filter(([k]) => k.startsWith('media-')).map(([k, message]) => <p key={k} className="a-error" role="alert">{message}</p>)}
            <Repeater
              label="Gallery items"
              items={media}
              onChange={setMedia}
              addLabel="+ Add from library"
              empty="No images or videos yet."
              newItem={() => ({ id: tempId(), kind: 'image', url: '', poster_url: '', alt_en: '', alt_ar: '', width: null, height: null })}
              renderItem={(item, update) => (
                <div className="a-gallery-item">
                  <MediaThumb url={item.url} kind={item.kind} />
                  <div>
                    <MediaField label={item.kind === 'video' ? 'Video' : 'Image'} accept="any" value={item.url} onChange={(url) => update({ url, kind: kindFromUrl(url) })} />
                    {item.kind === 'video' && <MediaField label="Video poster" value={item.poster_url} onChange={(poster_url) => update({ poster_url })} />}
                    <BiRowField label="Alt text / caption" row={item} field="alt" onChange={update} />
                  </div>
                </div>
              )}
            />
          </Card>
          <Card title="SEO" description="Leave empty to use the title and description.">
            <BilingualField label="SEO title" value={bi('seo_title')} onChange={setBi('seo_title')} />
            <BilingualField label="Meta description" multiline value={bi('seo_description')} onChange={setBi('seo_description')} />
            <MediaField label="Social sharing image (Open Graph)" value={draft.og_image_url} onChange={set('og_image_url')} />
          </Card>
        </div>
        <aside className="a-editor__side">
          <Card title="Publishing">
            <Toggle label="Published" checked={draft.published} onChange={set('published')} hint="Unpublished projects are hidden from the website and the sitemap." />
            <TextInput label="URL slug" required value={draft.slug} onChange={(v) => set('slug')(slugify(v) || v)} error={errors.slug} hint={`/portfolio/${draft.slug || '…'}`} />
          </Card>
          <Card title="Details">
            <MediaField label="Cover image" value={draft.cover_url} onChange={set('cover_url')} />
            <TextInput label="Client" value={draft.client} onChange={set('client')} />
            <TextInput label="Category" value={draft.category} onChange={set('category')} />
            <Select
              label="Related service"
              value={draft.service_id || ''}
              onChange={(v) => set('service_id')(v || null)}
              options={[{ value: '', label: '— None —' }, ...(services.data || []).map((s) => ({ value: s.id, label: s.name_en }))]}
            />
            <TextInput label="External link" value={draft.external_url} onChange={set('external_url')} error={errors.external_url} hint="https://…" />
            <TagsInput value={draft.tags || []} onChange={set('tags')} />
          </Card>
        </aside>
      </div>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} errors={errors} />
    </div>
  );
}
