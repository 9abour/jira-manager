import { createSlice } from '@reduxjs/toolkit';
import type { JiraIssue } from 'core/types/jira.types';

export interface IssuesByTypeReducerStateTypes {
  issues: JiraIssue[];
  total: number;
  startAt: number;
  maxResults: number;
  page: number;
  isLoading: boolean;
}

const initialState: IssuesByTypeReducerStateTypes = {
  issues: [],
  total: 0,
  startAt: 0,
  maxResults: 10,
  page: 1,
  isLoading: true,
};

const issuesByTypeReducer = createSlice({
  name: 'issuesByType',
  initialState,
  reducers: {
    setIssuesByType: (state, action) => {
      const { issues, total, startAt, maxResults } = action.payload;
      state.issues = issues;
      state.total = total;
      state.startAt = startAt;
      state.maxResults = maxResults;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    increasePage: (state) => {
      if (state.page === Math.floor(state.total / state.maxResults)) return;
      state.page += 1;
    },
    decreasePage: (state) => {
      if (state.page === 1) return;
      state.page -= 1;
    },
  },
});

export default issuesByTypeReducer.reducer;
export const {
  setIssuesByType,
  setLoading,
  setTotal,
  increasePage,
  decreasePage,
} = issuesByTypeReducer.actions;
