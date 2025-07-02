export interface JiraUser {
  self: string;
  accountId: string;
  accountType: string;
  emailAddress: string;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  displayName: string;
  active: boolean;
  timeZone: string;
  locale: string;
  groups: {
    size: number;
    items: any[];
  };
  applicationRoles: {
    size: number;
    items: any[];
  };
  expand: string;
}

interface JiraIssueType {
  name: string;
  iconUrl: string;
}

interface JiraIssueStatus {
  name: string;
}

interface JiraIssueFields {
  summary: string;
  issuetype: JiraIssueType;
  status: JiraIssueStatus;
  assignee?: JiraUser;
  created: string;
  updated: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: JiraIssueFields;
}

export interface WorklogRequest {
  timeSpent: string;
  comment?: string;
  started?: string;
}

export interface WorklogResponse {
  id: string;
  timeSpent: string;
  started: string;
  comment: string;
  author: JiraUser;
}

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}
