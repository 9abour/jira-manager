import issuesByTypeReducer, {
  type IssuesByTypeReducerStateTypes,
} from '../slices/issuesByTypeReducer';
import { configureStore } from '@reduxjs/toolkit';
import issuesByStatsReducer, {
  type IssuesByStatusReducerStateTypes,
} from 'infrastructure/rtk/slices/issuesByStatusReducer';
import issuesFiltersReducer, {
  type FiltersReducerStateTypes,
} from 'infrastructure/rtk/slices/filtersReducer';
import logWorkReducer, {
  type LogWorkReducerStateTypes,
} from 'infrastructure/rtk/slices/logWorkReducer';

interface StoreState {
  issuesByStats: IssuesByStatusReducerStateTypes;
  issuesByType: IssuesByTypeReducerStateTypes;
  filters: FiltersReducerStateTypes;
  logWork: LogWorkReducerStateTypes;
}

export const ReduxStore = configureStore<StoreState>({
  reducer: {
    issuesByStats: issuesByStatsReducer,
    issuesByType: issuesByTypeReducer,
    filters: issuesFiltersReducer,
    logWork: logWorkReducer,
  },
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
