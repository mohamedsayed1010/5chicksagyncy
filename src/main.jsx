// Base styles first: page stylesheets imported by the routes must come later in the cascade.
import './styles/styles.css';
import { StrictMode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import AppProviders, { createQueryClient } from './AppProviders.jsx';
import { routeElements } from './routes.jsx';

const router = createBrowserRouter(createRoutesFromElements(routeElements));
const queryClient = createQueryClient();

// Render synchronously so the full page exists before the browser restores the scroll position
// on reload/back navigation (as with the original static HTML). The prerendered HTML in #root is
// replaced by this render.
const root = createRoot(document.getElementById('root'));
flushSync(() => {
  root.render(
    <StrictMode>
      <AppProviders queryClient={queryClient}>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>
  );
});
