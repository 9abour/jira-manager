import { createSlice } from '@reduxjs/toolkit';
import type { JiraIssue } from 'core/types/jira.types';

export interface IssuesByStatusReducerStateTypes {
  toDo: JiraIssue[];
  inProgress: JiraIssue[];
  done: JiraIssue[];
  toDoPagination: {
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
  donePagination: {
    total: number;
    startAt: number;
    maxResults: number;
    page: number;
  };
  isLoading: boolean;
}

const initialState: IssuesByStatusReducerStateTypes = {
  toDo: [],
  inProgress: [],
  done: [],
  toDoPagination: {
    total: 0,
    startAt: 0,
    maxResults: 10,
    page: 1,
  },
  inProgressPagination: {
    total: 0,
    startAt: 0,
    maxResults: 10,
    page: 1,
  },
  donePagination: {
    total: 0,
    startAt: 0,
    maxResults: 10,
    page: 1,
  },
  isLoading: true,
};

const issuesByStatusReducer = createSlice({
  name: 'issuesByStats',
  initialState,
  reducers: {
    setIssuesByStats: (state, action) => {
      const { toDo, inProgress, done } = action.payload;
      state.toDo = toDo;
      state.inProgress = inProgress;
      state.done = done;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTotal: (state, action) => {
      const { type, total } = action.payload;
      switch (type) {
        case 'toDo':
          state.toDoPagination.total = total;
          break;
        case 'inProgress':
          state.inProgressPagination.total = total;
          break;
        case 'done':
          state.donePagination.total = total;
          break;
        default:
          break;
      }
    },
    increasePage: (state, action) => {
      const { type } = action.payload;

      switch (type) {
        case 'toDo':
          state.toDoPagination.page += 1;
          break;
        case 'inProgress':
          state.inProgressPagination.page += 1;
          break;
        case 'done':
          state.donePagination.page += 1;
          break;
        default:
          break;
      }
    },
  },
});

export default issuesByStatusReducer.reducer;
export const { setIssuesByStats, setLoading, increasePage, setTotal } =
  issuesByStatusReducer.actions;
