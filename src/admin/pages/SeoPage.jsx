import { Link } from 'react-router-dom';
import { MediaField } from '../MediaPicker.jsx';
import { BiRowField, SaveBar } from '../editorKit.jsx';
import { useList } from '../data.js';
import { useSettingsEditor } from './SettingsPage.jsx';
import { SITE_URL } from '../../cms/config.js';
import { Badge, Card, ErrorState, Loading, PageHeader } from '../ui.jsx';

export default function SeoPage() {
  const { settings, draft, update, dirty, saving, save, reset } = useSettingsEditor();
  const pages = useList('pages', { order: 'slug' });
  const services = useList('services');
  const projects = useList('projects');
  if (settings.isLoading || !draft) return <Loading />;
  if (settings.error) return <ErrorState error={settings.error} onRetry={settings.refetch} />;
  const missing = (row) => !row.seo_title_en || !row.seo_description_en;

  return (
    <div className="a-editor">
      <PageHeader title="SEO" crumbs={[['SEO']]} />
      <div className="a-editor__grid">
        <div className="a-editor__main">
          <Card title="Defaults" description="Used when a page has no SEO title or description of its own.">
            <BiRowField label="Default title" row={draft} field="default_seo_title" onChange={update} />
            <BiRowField label="Default description" row={draft} field="default_seo_description" multiline onChange={update} />
            <MediaField label="Default social sharing image" hint="1200×630 or similar landscape image. JPG/PNG are safest for social networks." value={draft.og_image_url} onChange={(og_image_url) => update({ og_image_url })} />
            <BiRowField label="Social image description" row={draft} field="og_image_alt" onChange={update} />
          </Card>
          <Card title="Pages, services and projects" description="Each has its own title, description, canonical URL, hreflang and social tags.">
            <table className="a-table">
              <thead>
                <tr><th scope="col">Page</th><th scope="col">URL</th><th scope="col">SEO</th><th scope="col"><span className="a-sr">Edit</span></th></tr>
              </thead>
              <tbody>
                {(pages.data || []).map((p) => (
                  <tr key={p.id}>
                    <td>{p.title_en}</td>
                    <td>{p.slug === 'home' ? '/' : `/${p.slug}`}</td>
                    <td><Badge tone={missing(p) ? 'warning' : 'success'}>{missing(p) ? 'Uses defaults' : 'Custom'}</Badge></td>
                    <td><Link to={`/admin/pages/${p.slug}`}>Edit</Link></td>
                  </tr>
                ))}
                {(services.data || []).map((s) => (
                  <tr key={s.id}>
                    <td>{s.name_en} {!s.published && <Badge tone="warning">Draft</Badge>}</td>
                    <td>/services/{s.slug}</td>
                    <td><Badge tone={missing(s) ? 'warning' : 'success'}>{missing(s) ? 'Uses name/description' : 'Custom'}</Badge></td>
                    <td><Link to={`/admin/services/${s.id}`}>Edit</Link></td>
                  </tr>
                ))}
                {(projects.data || []).map((p) => (
                  <tr key={p.id}>
                    <td>{p.title_en} {!p.published && <Badge tone="warning">Draft</Badge>}</td>
                    <td>/portfolio/{p.slug}</td>
                    <td><Badge tone={missing(p) ? 'warning' : 'success'}>{missing(p) ? 'Uses title/description' : 'Custom'}</Badge></td>
                    <td><Link to={`/admin/projects/${p.id}`}>Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card title="Sitemap and indexing">
            <p>
              The sitemap (<a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">{SITE_URL}/sitemap.xml</a>) and the static HTML
              used by search engines are generated from <strong>published</strong> content when the site is built. After publishing
              new services or projects, trigger a new deployment so they are included; they are visible to visitors immediately.
            </p>
          </Card>
        </div>
      </div>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />
    </div>
  );
}
