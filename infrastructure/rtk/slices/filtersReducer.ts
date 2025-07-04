import { createSlice } from '@reduxjs/toolkit';
import type { JiraIssue } from 'core/types/jira.types';

export interface FiltersReducerStateTypes {
  issuesViewType: 'timeline' | 'table';
  searchValue: string;
  searchResults: JiraIssue[];
  timelineSearchResults: Record<string, JiraIssue[]>;
  isLoading: boolean;
}

const initialState: FiltersReducerStateTypes = {
  issuesViewType: 'timeline',
  searchValue: '',
  searchResults: [],
  timelineSearchResults: {
    done: [],
    inProgress: [],
    toDo: [],
  },
  isLoading: true,
};

const issuesFiltersReducer = createSlice({
  name: 'issuesFilters',
  initialState,
  reducers: {
    setIssuesViewType: (state, action) => {
      state.issuesViewType = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setTimelineSearchResults: (state, action) => {
      state.timelineSearchResults = action.payload;
    },
  },
});

export default issuesFiltersReducer.reducer;
export const {
  setIssuesViewType,
  setLoading,
  setSearchValue,
  setSearchResults,
  setTimelineSearchResults,
} = issuesFiltersReducer.actions;
