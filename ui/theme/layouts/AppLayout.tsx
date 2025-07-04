import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';

import { Theme } from '@radix-ui/themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'core/utils/queryClient';
import useAppLayout from 'ui/theme/layouts/hooks/useAppLayout';
import { CookiesProvider } from 'react-cookie';
import Navbar from '@ui/theme/layouts/Navbar';
import { Provider as ReduxProvider } from 'react-redux';
import { ReduxStore } from 'infrastructure/rtk/store/store';
import { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  lang?: string;
}

/**
 * Main layout component that renders the HTML shell and global providers.
 * Handles theme management and language direction.
 *
 * @component
 * @param {AppLayoutProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The application shell with theme and query providers
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { resolvedTheme, resolvedLang, dir } = useAppLayout();

  return (
    <html lang={resolvedLang} dir={dir}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <CookiesProvider>
          <Theme appearance={resolvedTheme}>
            <QueryClientProvider client={queryClient}>
              <ReduxProvider store={ReduxStore}>
                <Navbar />
                {children}
              </ReduxProvider>
            </QueryClientProvider>
          </Theme>
          <ScrollRestoration />
          <Scripts />
        </CookiesProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
