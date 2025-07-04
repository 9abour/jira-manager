import { useEffect } from 'react';
import {
  setIssuesViewType,
  setLoading as setLoadingFilters,
} from 'infrastructure/rtk/slices/filtersReducer';
import { useDispatch } from 'react-redux';

export function useIssuesViewType() {
  const dispatch = useDispatch();

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
