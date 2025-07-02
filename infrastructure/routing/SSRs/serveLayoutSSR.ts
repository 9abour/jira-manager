import type { Route } from '.react-router/types/app/+types/root';
import { DEFAULT_LANG } from 'infrastructure/i18n/supported';
import { data, redirect } from 'react-router';
import {
  themeCookieMaxAge,
  type ThemeSlice,
} from 'infrastructure/store/themeSlice';
import { getCookie } from 'core/utils/server/cookies';
import { extractLang } from 'core/utils/server/extractLang';

/**
 * Server-side loader function for root layout that handles:
 * - Language detection and redirection
 * - Theme cookie management
 * - Initial data provisioning for client-side hydration
 *
 * @param {Route.LoaderArgs} args - Loader arguments from React Router
 * @throws {Response} Will redirect to default language if needed
 * @returns {Promise<Response>} Response with layout data and cookies
 */
export const serveLayoutSSR = async ({ request }: Route.LoaderArgs) => {
  // Language extraction with proper error handling
  const { lang, t, redirect: redirectToDefaultLang } = extractLang(request);

  if (redirectToDefaultLang) {
    return redirect(`/${DEFAULT_LANG}`);
  }

  // Theme cookie extraction with fallback
  const theme = getCookie(request, 'theme') || 'light';

  return data(
    {
      theme: theme as ThemeSlice['mode'],
      lang,
      t,
    },
    {
      headers: {
        'Set-Cookie': `theme=${theme}; Max-age=${themeCookieMaxAge}; path=/`,
      },
    }
  );
};
