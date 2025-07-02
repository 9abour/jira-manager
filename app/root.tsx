import '../ui/theme/styles/fonts.css';

import { Outlet } from 'react-router';

import stylesheet from './app.css?url';
import { LanguageContext } from '../core/contexts/languageContext';
import { Toaster } from 'react-hot-toast';
import { serveLayoutSSR } from 'infrastructure/routing/SSRs/serveLayoutSSR';
import { AppLayout } from 'ui/theme/layouts/AppLayout';
import { ErrorBoundaryFunc } from 'ui/errors/ErrorBoundary';
import { useLang } from '@hooks/useLang';

export const links = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'icon', href: '/jira-logo.webp' },
];

export const loader = serveLayoutSSR;
export const ErrorBoundary = ErrorBoundaryFunc;

/**
 * Root application component that wraps all routes with necessary providers
 * and layouts. Handles language context, error boundaries, and global styling.
 *
 * @component
 * @returns {JSX.Element} The root application layout with context providers
 */
export default function App() {
  const d = useLang();

  return (
    <LanguageContext.Provider value={d}>
      <AppLayout>
        <Outlet />
        <Toaster position="bottom-right" />
      </AppLayout>
    </LanguageContext.Provider>
  );
}
