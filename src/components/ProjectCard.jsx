import { Link } from 'react-router-dom';
import ArrowIcon from './ArrowIcon.jsx';
import { assetUrl, pick } from '../cms/resolve.js';
import { useLanguage } from '../i18n/language.jsx';

// Card linking to /portfolio/:slug; the cover falls back to the first image in the gallery.
export default function ProjectCard({ project }) {
  const { lang } = useLanguage();
  const cover = project.cover_url || project.media?.find((m) => m.kind === 'image')?.url || project.media?.find((m) => m.poster_url)?.poster_url;
  return (
    <Link className="project-card" to={`/portfolio/${project.slug}`}>
      <span className="project-card__media">
        {cover ? <img src={assetUrl(cover)} alt="" loading="lazy" /> : <span className="project-card__placeholder">5CHICKS</span>}
      </span>
      <span className="project-card__body">
        {project.category && <span className="project-card__category">{project.category}</span>}
        <span className="project-card__title">{pick(project, 'title', lang)}</span>
        {project.client && <span className="project-card__client">{project.client}</span>}
      </span>
      <ArrowIcon char="↗" />
    </Link>
  );
}
