import { useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  setLoading,
  setIssuesByStats,
} from 'infrastructure/rtk/slices/issuesByStatusReducer';
import type { JiraIssue } from 'core/types/jira.types';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'infrastructure/rtk/store/store';

interface Props {
  fetchIssues: any;
  done: JiraIssue[];
  inProgress: JiraIssue[];
  toDo: JiraIssue[];
}

export function useTimelineIssuesLoader({
  fetchIssues,
  done,
  inProgress,
  toDo,
}: Props) {
  const dispatch = useDispatch();

  const { issuesViewType } = useSelector((state: RootState) => state.filters);

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
}
