import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PortfolioPreview, { ar } from './pages/PortfolioPreview.jsx';
import './styles/portfolio-preview.css';

document.documentElement.lang = ar ? 'ar' : 'en';
document.documentElement.dir = ar ? 'rtl' : 'ltr';
document.title = ar ? 'بورتفوليو 5CHICKS' : '5CHICKS Portfolio Preview';
if (ar)
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      'معاينة بالصور لملف بورتفوليو شركة 5CHICKS: الخدمات والهوية التجارية والفنون البصرية والإنتاج الإعلامي.'
    );

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioPreview />
  </StrictMode>
);
