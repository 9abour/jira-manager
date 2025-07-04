import { useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  setLoading as setIssuesByTypeLoading,
  setIssuesByType,
} from 'infrastructure/rtk/slices/issuesByTypeReducer';
import { useDispatch, useSelector } from 'react-redux';
import useAssignedJiraIssues from '@hooks/useAssignedJiraIssues';
import type { RootState } from 'infrastructure/rtk/store/store';

export function useTableIssuesLoader() {
  const dispatch = useDispatch();
  const { fetchIssues } = useAssignedJiraIssues(['Task', 'Story', 'Bug']);

  const { issuesViewType } = useSelector((state: RootState) => state.filters);

  const { page, maxResults } = useSelector(
    (state: RootState) => state.issuesByType
  );

  useEffect(() => {
    (async () => {
      if (issuesViewType === 'table') {
        dispatch(setIssuesByTypeLoading(true));
        try {
          const res = await fetchIssues('all', maxResults, page * maxResults);
          dispatch(
            setIssuesByType({
              issues: res.issues,
              total: res.total,
              startAt: res.startAt,
              maxResults: res.maxResults,
            })
          );
          dispatch(setIssuesByTypeLoading(false));
        } catch (error: any) {
          toast.error(
            error?.response?.statusText ||
              error?.response?.data ||
              error?.message ||
              'Error loading issues'
          );
          dispatch(setIssuesByTypeLoading(false));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuesViewType, page]);
}
