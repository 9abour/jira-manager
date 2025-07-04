import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import type { JiraCredentials } from 'core/types/jira.types';

const useJiraCredentials = () => {
  const [cookies] = useCookies(['jiraCredentials', 'jiraUserInfo']);

  const getCredentials = useCallback((): JiraCredentials => {
    const credentials = cookies.jiraCredentials;
    if (!credentials) {
      throw new Error('JIRA credentials not found in cookies');
    }
    return credentials;
  }, [cookies]);

  // Optionally, provide the credentials object directly (may be undefined)
  const credentials: JiraCredentials | undefined = cookies.jiraCredentials;

  return { getCredentials, credentials };
};

export default useJiraCredentials;
