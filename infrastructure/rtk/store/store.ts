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

interface StoreState {
  issuesByStats: IssuesByStatusReducerStateTypes;
  issuesByType: IssuesByTypeReducerStateTypes;
  // logWork: any;
  filters: FiltersReducerStateTypes;
}

export const ReduxStore = configureStore<StoreState>({
  reducer: {
    issuesByStats: issuesByStatsReducer,
    issuesByType: issuesByTypeReducer,
    filters: issuesFiltersReducer,
    // logWork: logWorkReducer,
  },
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
