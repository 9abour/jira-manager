import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import type {
  JiraCredentials,
  WorklogRequest,
  WorklogResponse,
} from 'core/types/jira.types';
import { logWork as apiLogWork } from 'core/utils/jiraApi';

const useLogWork = () => {
  const [cookies] = useCookies(['jiraCredentials', 'jiraUserInfo']);

  const getCredentials = useCallback((): JiraCredentials => {
    const credentials = cookies.jiraCredentials;
    if (!credentials) {
      throw new Error('JIRA credentials not found in cookies');
    }
    return credentials;
  }, [cookies]);

  const logWork = useCallback(
    async (
      issueKey: string,
      worklog: WorklogRequest
    ): Promise<WorklogResponse> => {
      const credentials = getCredentials();
      return apiLogWork(credentials, issueKey, worklog);
    },
    [getCredentials]
  );

  return {
    logWork,
  };
};

export default useLogWork;
