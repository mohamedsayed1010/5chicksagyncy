import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SECTION_SCHEMAS, sectionToValues, valuesToSection } from '../sectionSchemas.js';
import { FieldRenderer, schemaErrors } from '../FieldRenderer.jsx';
import { BiRowField, SaveBar } from '../editorKit.jsx';
import { errorMessage, useCmsMutation, useInvalidate, useList } from '../data.js';
import { useApi } from '../auth.jsx';
import { MediaField } from '../MediaPicker.jsx';
import { Badge, Button, Card, EmptyState, ErrorState, Loading, PageHeader, SortableList, Toggle, useFeedback, useUnsavedChanges } from '../ui.jsx';

const PAGE_PATHS = { home: '/', services: '/services', portfolio: '/portfolio', contact: '/contact' };

export function PagesList() {
  const pages = useList('pages', { order: 'slug' });
  const sections = useList('page_sections');
  return (
    <>
      <PageHeader title="Pages" crumbs={[['Pages']]} />
      {pages.isLoading ? (
        <Loading />
      ) : pages.error ? (
        <ErrorState error={pages.error} onRetry={pages.refetch} />
      ) : (
        <div className="a-cards">
          {pages.data.map((page) => {
            const count = (sections.data || []).filter((s) => s.page_slug === page.slug).length;
            return (
              <Link key={page.id} className="a-card a-card--link" to={`/admin/pages/${page.slug}`}>
                <h2>{page.title_en}</h2>
                <p className="a-muted">{PAGE_PATHS[page.slug] || '/' + page.slug} · {count} editable section{count === 1 ? '' : 's'}</p>
                <Badge tone={page.published ? 'success' : 'warning'}>{page.published ? 'Published' : 'Hidden'}</Badge>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export function PageEditor() {
  const { slug } = useParams();
  const api = useApi();
  const invalidate = useInvalidate();
  const { toast } = useFeedback();
  const pages = useList('pages', { filter: { slug }, order: null });
  const sections = useList('page_sections', { filter: { page_slug: slug } });
  const page = pages.data?.[0];
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [baseline, setBaseline] = useState(null);
  useEffect(() => {
    if (page) {
      setDraft(page);
      setBaseline(JSON.stringify(page));
    }
  }, [page]);
  const dirty = Boolean(baseline && draft) && JSON.stringify(draft) !== baseline;
  useUnsavedChanges(dirty && !saving);

  const onError = (error) => toast(errorMessage(error), 'error');
  const reorder = useCmsMutation((a, ids) => a.db.reorder('page_sections', ids), { onError, onSuccess: () => toast('Section order saved') });
  const toggle = useCmsMutation((a, s) => a.db.update('page_sections', s.id, { enabled: !s.enabled }), {
    onError,
    onSuccess: (s) => toast(s.enabled ? 'Section shown' : 'Section hidden')
  });

  if (pages.isLoading || sections.isLoading) return <Loading />;
  if (pages.error || sections.error) return <ErrorState error={pages.error || sections.error} />;
  if (!page || !draft) return <EmptyState title="Page not found" action={<Link className="a-btn" to="/admin/pages">Back to pages</Link>} />;

  const save = async () => {
    setSaving(true);
    try {
      const { id, created_at, updated_at, ...fields } = draft;
      await api.db.update('pages', id, fields);
      setBaseline(JSON.stringify(draft));
      invalidate();
      toast('Page saved');
    } catch (error) {
      onError(error);
    } finally {
      setSaving(false);
    }
  };
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <div className="a-editor">
      <PageHeader
        title={page.title_en}
        crumbs={[['Pages', '/admin/pages'], [page.title_en]]}
        actions={<a className="a-btn a-btn--ghost" href={PAGE_PATHS[slug] || '/'} target="_blank" rel="noopener noreferrer">View page ↗</a>}
      />
      <div className="a-editor__grid">
        <div className="a-editor__main">
          <Card title="Sections" description={slug === 'home' ? 'Drag to change the order of the homepage sections. The header and footer always stay at the top and bottom.' : 'Content blocks used by this page.'}>
            {sections.data.length === 0 ? (
              <p className="a-muted">This page reuses the homepage sections.</p>
            ) : (
              <SortableList
                label="Sections"
                items={sections.data}
                onReorder={(next) => reorder.mutate(next.map((s) => s.id))}
                renderItem={(section) => (
                  <div className="a-row-item">
                    <div className="a-row-item__text">
                      <Link className="a-row-item__title" to={`/admin/pages/${slug}/sections/${section.key}`}>{SECTION_SCHEMAS[section.key]?.label || section.key}</Link>
                      <span className="a-muted">{SECTION_SCHEMAS[section.key]?.note}</span>
                    </div>
                    <Badge tone={section.enabled ? 'success' : 'warning'}>{section.enabled ? 'Visible' : 'Hidden'}</Badge>
                    <div className="a-row-item__actions">
                      {!['header', 'footer', 'service-template'].includes(section.key) && (
                        <Button size="sm" onClick={() => toggle.mutate(section)}>{section.enabled ? 'Hide' : 'Show'}</Button>
                      )}
                      <Link className="a-btn a-btn--sm" to={`/admin/pages/${slug}/sections/${section.key}`}>Edit</Link>
                    </div>
                  </div>
                )}
              />
            )}
          </Card>
          <Card title="SEO" description="Search and social sharing for this page.">
            <BiRowField label="Page name" row={draft} field="title" onChange={update} />
            <BiRowField label="SEO title" row={draft} field="seo_title" onChange={update} />
            <BiRowField label="Meta description" row={draft} field="seo_description" multiline onChange={update} />
            <MediaField label="Social sharing image (Open Graph)" hint="Leave empty to use the default image from SEO settings." value={draft.og_image_url} onChange={(og_image_url) => update({ og_image_url })} />
          </Card>
        </div>
        <aside className="a-editor__side">
          <Card title="Visibility">
            <Toggle label="Published" checked={draft.published} onChange={(published) => update({ published })} hint={slug === 'home' ? 'The homepage should always stay published.' : undefined} />
          </Card>
        </aside>
      </div>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={() => setDraft(page)} />
    </div>
  );
}

export function SectionEditorPage() {
  const { slug, key } = useParams();
  const api = useApi();
  const invalidate = useInvalidate();
  const { toast } = useFeedback();
  const sections = useList('page_sections', { filter: { page_slug: slug } });
  const section = sections.data?.find((s) => s.key === key);
  const schema = SECTION_SCHEMAS[key];
  const initial = useMemo(() => (section && schema ? sectionToValues(section, schema) : null), [section, schema]);
  const [values, setValues] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (initial) {
      setValues(initial);
      setEnabled(section.enabled);
    }
  }, [initial, section]);
  const strip = (v) => JSON.stringify(v, (k, val) => (k === '_key' ? undefined : val));
  const dirty = Boolean(initial && values) && (strip(values) !== strip(initial) || enabled !== section.enabled);
  const errors = useMemo(() => (values && schema ? schemaErrors(schema, values) : {}), [values, schema]);
  useUnsavedChanges(dirty && !saving);

  if (sections.isLoading) return <Loading />;
  if (sections.error) return <ErrorState error={sections.error} />;
  if (!section || !schema || !values) return <EmptyState title="Section not found" action={<Link className="a-btn" to={`/admin/pages/${slug}`}>Back</Link>} />;

  const save = async () => {
    setSaving(true);
    try {
      await api.db.update('page_sections', section.id, { ...valuesToSection(values, schema, section), enabled });
      invalidate();
      await sections.refetch();
      toast(`${schema.label} saved`);
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="a-editor">
      <PageHeader title={schema.label} crumbs={[['Pages', '/admin/pages'], [slug, `/admin/pages/${slug}`], [schema.label]]}>
        {schema.note && <p className="a-muted">{schema.note}</p>}
      </PageHeader>
      <div className="a-editor__grid">
        <div className="a-editor__main">
          <Card>
            {schema.fields.map((field) => (
              <FieldRenderer key={field.key} field={field} value={values[field.key]} onChange={(v) => setValues((current) => ({ ...current, [field.key]: v }))} />
            ))}
          </Card>
        </div>
        <aside className="a-editor__side">
          <Card title="Visibility">
            {['header', 'footer', 'service-template'].includes(key) ? (
              <p className="a-muted">This section is always shown.</p>
            ) : (
              <Toggle label="Show this section" checked={enabled} onChange={setEnabled} />
            )}
          </Card>
          {Object.keys(errors).length > 0 && (
            <Card title="Check these fields">
              <ul className="a-list">{Object.entries(errors).map(([k, m]) => <li key={k} className="a-error">{m}</li>)}</ul>
            </Card>
          )}
        </aside>
      </div>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={() => { setValues(initial); setEnabled(section.enabled); }} errors={errors} />
    </div>
  );
}
