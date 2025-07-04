import axios from 'axios';
import type {
  JiraCredentials,
  JiraIssue,
  WorklogRequest,
  WorklogResponse,
  JiraPaginatedIssuesResponse,
} from 'core/types/jira.types';

// Accept credentials as a parameter for pure functions
export function getApiInstance(credentials: JiraCredentials) {
  const { email, apiToken, domain } = credentials;
  return axios.create({
    baseURL: domain,
    auth: {
      username: email,
      password: apiToken,
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export function handleError(error: any): void {
  if (axios.isAxiosError(error)) {
    console.error('JIRA API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
  } else {
    console.error('Unexpected error:', error);
  }
}

export function formatWorklogPayload(worklog: WorklogRequest): any {
  return {
    timeSpent: worklog.timeSpent,
    started: worklog.started || new Date().toISOString(),
    comment: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              text: worklog.comment || 'Time logged via JIRA API',
              type: 'text',
            },
          ],
        },
      ],
    },
  };
}

export async function logWork(
  credentials: JiraCredentials,
  issueKey: string,
  worklog: WorklogRequest
): Promise<WorklogResponse> {
  try {
    const api = getApiInstance(credentials);
    const response = await api.post(
      `/rest/api/3/issue/${issueKey}/worklog`,
      formatWorklogPayload(worklog)
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getAssignedIssues(
  credentials: JiraCredentials,
  options: {
    issueTypes?: string[];
    statusFilter?: 'all' | 'todo' | 'inprogress' | 'done';
    maxResults?: number;
    startAt?: number;
    sortBy?: 'created' | 'updated';
  } = {}
): Promise<JiraPaginatedIssuesResponse> {
  try {
    const {
      issueTypes = ['Bug', 'Story', 'Task'],
      statusFilter = 'all',
      maxResults = 50,
      startAt = 0,
      sortBy = 'updated',
    } = options;

    const api = getApiInstance(credentials);

    // Base JQL for assigned issues of specified types
    let jql = `assignee = currentUser() AND issuetype in (${issueTypes
      .map((t) => `"${t}"`)
      .join(',')})`;

    // Add status filter based on selection
    switch (statusFilter) {
      case 'todo':
        jql += ` AND statusCategory = "To Do"`;
        break;
      case 'inprogress':
        jql += ` AND statusCategory = "In Progress"`;
        break;
      case 'done':
        jql += ` AND statusCategory = "Done"`;
        break;
      // 'all' case doesn't need additional filtering
    }

    // Add sorting by created or updated date
    jql += ` ORDER BY ${sortBy} DESC`;

    const fields =
      'summary,issuetype,status,assignee,created,updated,timetracking,priority,project';

    const response = await api.get('/rest/api/3/search', {
      params: {
        jql,
        fields,
        maxResults,
        startAt,
      },
    });

    return {
      issues: response.data.issues,
      total: response.data.total,
      startAt: response.data.startAt,
      maxResults: response.data.maxResults,
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getIssueByKey(
  credentials: JiraCredentials,
  issueKey: string
): Promise<JiraIssue> {
  try {
    const api = getApiInstance(credentials);
    const fields =
      'summary,issuetype,status,assignee,created,updated,timetracking,priority,project';

    const response = await api.get(`/rest/api/3/issue/${issueKey}`, {
      params: {
        fields,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
