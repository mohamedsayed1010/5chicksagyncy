import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import CollectionList from '../CollectionList.jsx';
import { MediaField } from '../MediaPicker.jsx';
import { BiRowField, SaveBar, useRecordEditor } from '../editorKit.jsx';
import { tempId, useList } from '../data.js';
import { slugify, validate } from '../validation.js';
import { BilingualField, Card, ColorInput, ErrorState, Loading, PageHeader, Repeater, TextInput, Toggle } from '../ui.jsx';
import { useContent } from '../../cms/CmsProvider.jsx';
import { whatsappUrl } from '../../cms/resolve.js';

export function ServicesList() {
  return (
    <CollectionList
      table="services"
      title="Services"
      basePath="/admin/services"
      newLabel="+ New service"
      thumbField="icon_url"
      describe={(s) => `/services/${s.slug}`}
      publicPath={(s) => `/services/${s.slug}`}
    />
  );
}

const ITEM_GROUPS = [
  ['deliverable', 'Deliverables', 'The list on the service card; the text appears under “What we offer” on the service page.', 'Deliverable', 'Details'],
  ['process', 'Process steps', 'Shown as a typical workflow on the service page.', 'Step', 'Description'],
  ['value', 'Why it matters', 'Practical value points for the service page.', 'Point', 'Explanation'],
  ['faq', 'FAQ', 'Questions and answers on the service page.', 'Question', 'Answer']
];

const blankService = () => ({
  slug: '', published: false, name_en: '', name_ar: '', tagline_en: '', tagline_ar: '', description_en: '', description_ar: '',
  overview_en: '', overview_ar: '', color: '#00ff87', icon_url: '', hero_image_url: '', work_link: '',
  whatsapp_message_en: '', whatsapp_message_ar: '', seo_title_en: '', seo_title_ar: '', seo_description_en: '', seo_description_ar: '', og_image_url: ''
});

export function ServiceEditor() {
  const { id } = useParams();
  const { settings } = useContent();
  const editor = useRecordEditor({ table: 'services', id, child: { table: 'service_items', key: 'service_id' }, blank: blankService, basePath: '/admin/services', label: 'Service' });
  const { query, isNew, draft, setDraft, children, setChildren, dirty, saving, save, reset, bi, setBi, set } = editor;
  const projects = useList('projects');

  const errors = useMemo(() => {
    if (!draft) return {};
    const e = validate(draft, { name_en: ['required'], name_ar: ['required'], slug: ['slug'], color: ['color'], work_link: ['link'] });
    return e;
  }, [draft]);

  if (query.isLoading || !draft) return <Loading />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;

  const group = (kind) => children.filter((item) => item.kind === kind);
  const setGroup = (kind) => (items) =>
    setChildren(ITEM_GROUPS.flatMap(([k]) => (k === kind ? items : children.filter((item) => item.kind === k))));
  const related = (projects.data || []).filter((p) => p.service_id === draft.id);
  const waPreview = whatsappUrl(settings.whatsapp_number, draft.whatsapp_message_en);

  return (
    <div className="a-editor">
      <PageHeader
        title={isNew ? 'New service' : draft.name_en || 'Service'}
        crumbs={[['Services', '/admin/services'], [isNew ? 'New' : draft.name_en]]}
        actions={!isNew && draft.published && <a className="a-btn a-btn--ghost" href={`/services/${draft.slug}`} target="_blank" rel="noopener noreferrer">View page ↗</a>}
      />
      <div className="a-editor__grid">
        <div className="a-editor__main">
          <Card title="Service">
            <BilingualField
              label="Name"
              required
              value={bi('name')}
              error={{ en: errors.name_en, ar: errors.name_ar }}
              onChange={(value) =>
                setDraft((d) => ({ ...d, name_en: value.en, name_ar: value.ar, slug: isNew && (!d.slug || d.slug === slugify(d.name_en)) ? slugify(value.en) : d.slug }))
              }
            />
            <BilingualField label="Tagline" value={bi('tagline')} onChange={setBi('tagline')} />
            <BilingualField label="Short description (card and page intro)" multiline value={bi('description')} onChange={setBi('description')} />
            <BilingualField label="Overview" multiline rows={7} hint="Separate paragraphs with a blank line." value={bi('overview')} onChange={setBi('overview')} />
          </Card>
          {ITEM_GROUPS.map(([kind, label, help, titleLabel, bodyLabel]) => (
            <Card key={kind} title={label} description={help}>
              <Repeater
                label={label}
                items={group(kind)}
                onChange={setGroup(kind)}
                newItem={() => ({ id: tempId(), kind, title_en: '', title_ar: '', body_en: '', body_ar: '' })}
                addLabel={`+ Add ${titleLabel.toLowerCase()}`}
                renderItem={(item, update) => (
                  <>
                    <BiRowField label={titleLabel} row={item} field="title" onChange={update} />
                    <BiRowField label={bodyLabel} row={item} field="body" multiline rows={2} onChange={update} />
                  </>
                )}
              />
            </Card>
          ))}
          <Card title="WhatsApp message" description="Prefilled when a visitor taps “Chat on WhatsApp” for this service.">
            <BilingualField label="Message" multiline value={bi('whatsapp_message')} onChange={setBi('whatsapp_message')} />
            {waPreview ? <p className="a-hint">Preview: <a href={waPreview} target="_blank" rel="noopener noreferrer">{waPreview.slice(0, 80)}…</a></p> : <p className="a-error">Set a valid WhatsApp number in Settings to enable WhatsApp links.</p>}
          </Card>
          <Card title="SEO" description="Leave empty to use the service name and description.">
            <BilingualField label="SEO title" value={bi('seo_title')} onChange={setBi('seo_title')} />
            <BilingualField label="Meta description" multiline value={bi('seo_description')} onChange={setBi('seo_description')} />
            <MediaField label="Social sharing image (Open Graph)" value={draft.og_image_url} onChange={set('og_image_url')} />
          </Card>
        </div>
        <aside className="a-editor__side">
          <Card title="Publishing">
            <Toggle label="Published" checked={draft.published} onChange={set('published')} hint="Unpublished services are hidden from the website and the sitemap." />
            <TextInput label="URL slug" required value={draft.slug} onChange={(v) => set('slug')(slugify(v) || v)} error={errors.slug} hint={`/services/${draft.slug || '…'}`} />
          </Card>
          <Card title="Design">
            <ColorInput label="Accent colour" value={draft.color} onChange={set('color')} error={errors.color} />
            <MediaField label="Icon" value={draft.icon_url} onChange={set('icon_url')} />
            <MediaField label="Hero image (optional)" hint="Replaces the icon in the service page hero." value={draft.hero_image_url} onChange={set('hero_image_url')} />
            <TextInput label="Related work link" value={draft.work_link} onChange={set('work_link')} error={errors.work_link} hint="e.g. #reels, #work or #portfolio" />
          </Card>
          <Card title="Related projects">
            {related.length ? (
              <ul className="a-list">{related.map((p) => <li key={p.id}><Link to={`/admin/projects/${p.id}`}>{p.title_en}</Link></li>)}</ul>
            ) : (
              <p className="a-muted">Link a project to this service from the project editor.</p>
            )}
          </Card>
        </aside>
      </div>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} errors={errors} />
    </div>
  );
}
