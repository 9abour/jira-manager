import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import type {
  JiraCredentials,
  JiraPaginatedIssuesResponse,
} from 'core/types/jira.types';
import { getAssignedIssues as apiGetAssignedIssues } from 'core/utils/jiraApi';

const useAssignedJiraIssues = (types: string[]) => {
  const [cookies] = useCookies(['jiraCredentials', 'jiraUserInfo']);

  const getCredentials = useCallback((): JiraCredentials => {
    const credentials = cookies.jiraCredentials;
    if (!credentials) {
      throw new Error('JIRA credentials not found in cookies');
    }
    return credentials;
  }, [cookies]);

  const fetchIssues = useCallback(
    (
      statusFilter: 'all' | 'todo' | 'inprogress' | 'done' = 'all',
      maxResults: number = 10,
      startAt: number = 0
    ): Promise<JiraPaginatedIssuesResponse> => {
      const credentials = getCredentials();
      return apiGetAssignedIssues(credentials, {
        issueTypes: types,
        statusFilter,
        maxResults,
        startAt,
      });
    },
    [getCredentials, types]
  );
  return {
    fetchIssues,
  };
};

export type UseAssignedJiraIssuesReturn = ReturnType<
  typeof useAssignedJiraIssues
>;
export default useAssignedJiraIssues;
