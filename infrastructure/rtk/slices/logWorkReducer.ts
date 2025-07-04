import { createSlice } from '@reduxjs/toolkit';
import type { JiraIssue } from 'core/types/jira.types';

export interface LogWorkReducerStateTypes {
  isModalOpen: boolean;
  issueToLogWork?: JiraIssue | null;
}

const initialState: LogWorkReducerStateTypes = {
  isModalOpen: false,
  issueToLogWork: null,
};

const logWorkReducer = createSlice({
  name: 'logWork',
  initialState,
  reducers: {
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setIssueToLogWork: (state, action) => {
      state.issueToLogWork = action.payload;
    },
  },
});

export default logWorkReducer.reducer;
export const { setIsModalOpen, setIssueToLogWork } = logWorkReducer.actions;
