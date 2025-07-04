import serveHomeMeta from '~/meta/serveHomeMeta';
import serveHomeSSR from 'infrastructure/routing/SSRs/serveHomeSSR';
import AssignedIssuesHeader from './AssignedIssuesHeader';
import AssignedIssuesContent from './AssignedIssuesContent';
import { useIssuesViewType } from '~/pages/hooks/useIssuesViewType';

export const loader = serveHomeSSR;
export const meta = serveHomeMeta;

export default function Page({ loaderData }: { loaderData: {} }) {
  useIssuesViewType();

  return (
    <div className="flex flex-col gap-4">
      <div className="container bg-white !p-8 rounded-lg mt-4">
        <AssignedIssuesHeader />
      </div>
      <div className="container bg-white !p-8  ">
        <AssignedIssuesContent />
      </div>
    </div>
  );
}
