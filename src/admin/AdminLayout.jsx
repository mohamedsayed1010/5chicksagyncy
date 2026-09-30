import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BACKEND } from '../cms/config.js';
import { useAuth } from './auth.jsx';
import { Button } from './ui.jsx';

export const NAV = [
  ['dashboard', 'Dashboard', '◧'],
  ['pages', 'Pages', '▤'],
  ['services', 'Services', '✦'],
  ['projects', 'Projects', '▦'],
  ['sliders', 'Sliders', '▶'],
  ['media', 'Media', '▣'],
  ['clients', 'Clients', '◎'],
  ['settings', 'Settings', '⚙'],
  ['seo', 'SEO', '⌕']
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className={`a-shell${menuOpen ? ' is-menu-open' : ''}`}>
      <aside className="a-sidebar" aria-label="Dashboard">
        <Link className="a-brand" to="/admin/dashboard">
          <img src="/assets/identity/logo-dark.webp" alt="5CHICKS" width="120" height="31" />
          <span>CMS</span>
        </Link>
        <nav id="admin-nav">
          <ul>
            {NAV.map(([path, label, icon]) => (
              <li key={path}>
                <NavLink to={`/admin/${path}`} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                  <span aria-hidden="true">{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {BACKEND === 'mock' && (
          <p className="a-mock-note">Local mock backend — changes are not saved to a database.</p>
        )}
      </aside>
      <div className="a-main">
        <header className="a-topbar">
          <button
            type="button"
            className="a-icon-btn a-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="admin-nav"
            aria-label="Menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
          <a className="a-topbar__site" href="/" target="_blank" rel="noopener noreferrer">View website ↗</a>
          <span className="a-topbar__user" title={session?.user?.email}>{session?.user?.email}</span>
          <Button
            size="sm"
            onClick={async () => {
              await signOut();
              navigate('/admin/login', { replace: true });
            }}
          >
            Sign out
          </Button>
        </header>
        <main className="a-content" id="admin-main">
          <Outlet />
        </main>
      </div>
      <button type="button" className="a-scrim" aria-label="Close menu" tabIndex={-1} onClick={() => setMenuOpen(false)} />
    </div>
  );
}
