import IssuesTimelineView from 'features/home/IssuesTimelineView';
import IssuesTableView from 'features/home/IssuesTableView';
import { useLang } from '@hooks/useLang';
import { useSelector } from 'react-redux';
import type { RootState } from 'infrastructure/rtk/store/store';

export default function AssignedIssuesContent() {
  const { t } = useLang();

  const { issuesViewType, isLoading: isLoadingFilters } = useSelector(
    (state: RootState) => state.filters
  );

  return (
    <>
      {isLoadingFilters ? (
        <div className="text-center py-8 text-gray-500 font-medium">
          {t.common.loading}
        </div>
      ) : issuesViewType === 'timeline' ? (
        <IssuesTimelineView />
      ) : (
        <IssuesTableView />
      )}
    </>
  );
}
