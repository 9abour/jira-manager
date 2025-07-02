import serveHomeMeta from '~/meta/serveHomeMeta';
import serveHomeSSR from 'infrastructure/routing/SSRs/serveHomeSSR';

export const loader = serveHomeSSR;
export const meta = serveHomeMeta;

export default function page({ loaderData }: { loaderData: {} }) {
  return (
    <main>
      <h2 className="bg-red-500">Hello, World</h2>
    </main>
  );
}
