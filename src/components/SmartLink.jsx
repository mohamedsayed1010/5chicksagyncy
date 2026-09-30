import { Link, useLocation } from 'react-router-dom';

// One link component for CMS-provided URLs:
// - "#section": a plain in-page anchor on the homepage (same behaviour as before), and a router
//   link to "/#section" on every other page
// - "/path": client-side navigation
// - anything else (https:, tel:, mailto:, files): a normal link
export default function SmartLink({ href = '', children, ...props }) {
  const { pathname } = useLocation();
  if (href.startsWith('#')) {
    if (pathname === '/') return <a href={href} {...props}>{children}</a>;
    return <Link to={'/' + href} {...props}>{children}</Link>;
  }
  if (href.startsWith('/') && !/\.[a-z0-9]+($|\?)/i.test(href))
    return <Link to={href} {...props}>{children}</Link>;
  return <a href={href} {...props}>{children}</a>;
}
