import { useLang } from '@hooks/useLang';
import IssuesFilters from 'features/home/IssuesFilters';

export default function AssignedIssuesHeader() {
  const { t } = useLang();
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-darkTitle">
        {t.pages.home.assignedIssues}
      </h1>
      <IssuesFilters />
    </div>
  );
}
