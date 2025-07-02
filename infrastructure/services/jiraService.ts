import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
  JiraConfig,
  JiraIssue,
  WorklogRequest,
  WorklogResponse,
} from 'core/types/jira.types';

export class JiraService {
  private axiosInstance: AxiosInstance;

  constructor(private config: JiraConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      auth: {
        username: config.email,
        password: config.apiToken,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Log time to a JIRA issue
   * @param issueKey The JIRA issue key (e.g., PROJ-123)
   * @param worklog The worklog data to submit
   */
  async logWork(
    issueKey: string,
    worklog: WorklogRequest
  ): Promise<WorklogResponse> {
    try {
      const response = await this.axiosInstance.post(
        `/rest/api/3/issue/${issueKey}/worklog`,
        this.formatWorklogPayload(worklog)
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get issues assigned to current user filtered by type
   * @param issueTypes Array of issue types to include (e.g., ['Bug', 'Story', 'Task'])
   */
  async getAssignedIssues(
    issueTypes: string[] = ['Bug', 'Story', 'Task']
  ): Promise<JiraIssue[]> {
    try {
      const jql = `assignee = currentUser() AND issuetype in (${issueTypes
        .map((t) => `"${t}"`)
        .join(',')})`;
      const fields = 'summary,issuetype,status,assignee,created,updated';

      const response = await this.axiosInstance.get('/rest/api/3/search', {
        params: {
          jql,
          fields,
          maxResults: 100,
        },
      });

      return response.data.issues;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private formatWorklogPayload(worklog: WorklogRequest): any {
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

  private handleError(error: any): void {
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
}
