import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../auth.jsx';
import { useList } from '../data.js';
import { Badge, Card, ErrorState, Loading, PageHeader } from '../ui.jsx';

function useCounts() {
  const api = useApi();
  return useQuery({
    queryKey: ['admin', 'counts'],
    queryFn: async () => {
      const [servicesAll, servicesLive, projectsAll, projectsLive, slides, slidesLive, clients, media] = await Promise.all([
        api.db.count('services'),
        api.db.count('services', { published: true }),
        api.db.count('projects'),
        api.db.count('projects', { published: true }),
        api.db.count('slides'),
        api.db.count('slides', { enabled: true }),
        api.db.count('clients', { enabled: true }),
        api.db.count('media')
      ]);
      return {
        services: [servicesLive, servicesAll - servicesLive],
        projects: [projectsLive, projectsAll - projectsLive],
        slides: [slidesLive, slides - slidesLive],
        clients,
        media
      };
    }
  });
}

const timeAgo = (date) => {
  const minutes = Math.round((Date.now() - new Date(date)) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`;
  return new Date(date).toLocaleDateString();
};

export default function DashboardPage() {
  const counts = useCounts();
  const activity = useList('activity_log', { order: 'created_at', ascending: false, limit: 12 });
  const stat = (label, [live, draft], to) => (
    <Link className="a-stat" to={to}>
      <span className="a-stat__label">{label}</span>
      <span className="a-stat__value">{live}</span>
      <span className="a-stat__meta">published · {draft} draft</span>
    </Link>
  );
  return (
    <>
      <PageHeader title="Dashboard" />
      {counts.isLoading ? (
        <Loading />
      ) : counts.error ? (
        <ErrorState error={counts.error} onRetry={counts.refetch} />
      ) : (
        <div className="a-stats">
          {stat('Services', counts.data.services, '/admin/services')}
          {stat('Projects', counts.data.projects, '/admin/projects')}
          {stat('Slides', counts.data.slides, '/admin/sliders')}
          <Link className="a-stat" to="/admin/clients">
            <span className="a-stat__label">Clients</span>
            <span className="a-stat__value">{counts.data.clients}</span>
            <span className="a-stat__meta">visible logos</span>
          </Link>
          <Link className="a-stat" to="/admin/media">
            <span className="a-stat__label">Media</span>
            <span className="a-stat__value">{counts.data.media}</span>
            <span className="a-stat__meta">files in the library</span>
          </Link>
        </div>
      )}
      <div className="a-grid-2">
        <Card title="Quick actions">
          <div className="a-quick">
            <Link className="a-btn a-btn--primary" to="/admin/services/new">+ New service</Link>
            <Link className="a-btn" to="/admin/projects/new">+ New project</Link>
            <Link className="a-btn" to="/admin/media">Upload media</Link>
            <Link className="a-btn" to="/admin/pages/home">Edit homepage</Link>
            <Link className="a-btn" to="/admin/settings">WhatsApp & contact</Link>
          </div>
        </Card>
        <Card title="Recent changes">
          {activity.isLoading ? (
            <Loading />
          ) : activity.error ? (
            <ErrorState error={activity.error} />
          ) : activity.data.length === 0 ? (
            <p className="a-muted">No changes yet.</p>
          ) : (
            <ul className="a-activity">
              {activity.data.map((entry) => (
                <li key={entry.id}>
                  <Badge tone={entry.action === 'delete' ? 'danger' : entry.action === 'insert' ? 'success' : 'neutral'}>{entry.action}</Badge>
                  <span>
                    <strong>{entry.table_name.replace(/_/g, ' ')}</strong> {entry.summary}
                  </span>
                  <time dateTime={entry.created_at}>{timeAgo(entry.created_at)}</time>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
