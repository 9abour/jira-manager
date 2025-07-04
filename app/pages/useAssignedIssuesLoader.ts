import { useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  setLoading,
  setIssuesByStats,
} from 'infrastructure/rtk/slices/issuesByStatusReducer';
import {
  setLoading as setIssuesByTypeLoading,
  setIssuesByType,
} from 'infrastructure/rtk/slices/issuesByTypeReducer';
import {
  setIssuesViewType,
  setLoading as setLoadingFilters,
} from 'infrastructure/rtk/slices/filtersReducer';
import type { JiraIssue } from 'core/types/jira.types';

interface UseAssignedIssuesLoaderProps {
  fetchIssues: any;
  done: JiraIssue[];
  inProgress: JiraIssue[];
  toDo: JiraIssue[];
  issues: JiraIssue[];
  issuesViewType: string;
  dispatch: any;
  page: number;
  maxResults: number;
  donePagination: {
    total: number;
    startAt: number;
    maxResults: number;
    page: number;
  };
  inProgressPagination: {
    total: number;
    startAt: number;
    maxResults: number;
    page: number;
  };
  toDoPagination: {
    total: number;
    startAt: number;
    maxResults: number;
    page: number;
  };
}

export default function useAssignedIssuesLoader({
  fetchIssues,
  done,
  inProgress,
  toDo,
  issuesViewType,
  dispatch,
  page,
  maxResults,
  donePagination,
  inProgressPagination,
  toDoPagination,
}: UseAssignedIssuesLoaderProps) {
  // Load issues for timeline view
  useEffect(() => {
    (async () => {
      if (issuesViewType === 'timeline') {
        if (!done.length && !inProgress.length && !toDo.length) {
          dispatch(setLoading(true));
          try {
            const [newToDo, newInProgress, newDone] = await Promise.all([
              fetchIssues('todo').then((res: any) => res.issues),
              fetchIssues('inprogress').then((res: any) => res.issues),
              fetchIssues('done').then((res: any) => res.issues),
            ]);
            dispatch(
              setIssuesByStats({
                toDo: newToDo,
                inProgress: newInProgress,
                done: newDone,
              })
            );
            dispatch(setLoading(false));
          } catch (error: any) {
            console.log({ error });
            toast.error(
              error?.response?.statusText ||
                error?.response?.data ||
                error?.message ||
                'Error loading issues'
            );
            dispatch(setLoading(false));
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuesViewType]);

  // Load issues for table view
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
          console.log({ error });
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

  // Set issuesViewType from localStorage on mount
  useEffect(() => {
    const storedIssuesViewType = localStorage.getItem('issuesViewType');
    if (
      storedIssuesViewType === 'timeline' ||
      storedIssuesViewType === 'table'
    ) {
      dispatch(setIssuesViewType(storedIssuesViewType));
      dispatch(setLoadingFilters(false));
    } else {
      dispatch(setLoadingFilters(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
