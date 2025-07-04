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

export interface JiraCredentials {
  email: string;
  apiToken: string;
  domain: string;
}

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

export interface JiraCredentials {
  email: string;
  apiToken: string;
  domain: string;
}

export interface JiraBug {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    summary: string;
    issuetype: {
      self: string;
      id: string;
      description: string;
      iconUrl: string;
      name: string;
      subtask: boolean;
      avatarId: number;
      entityId: string;
      hierarchyLevel: number;
    };
    created: string;
    assignee: {
      self: string;
      accountId: string;
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
      accountType: string;
    };
    updated: string;
    status: {
      self: string;
      description: string;
      iconUrl: string;
      name: string;
      id: string;
      statusCategory: {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
  };
}

export interface JiraTask {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    summary: string;
    issuetype: {
      self: string;
      id: string;
      description: string;
      iconUrl: string;
      name: string;
      subtask: boolean;
      avatarId: number;
      entityId: string;
      hierarchyLevel: number;
    };
    created: string;
    assignee: {
      self: string;
      accountId: string;
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
      accountType: string;
    };
    updated: string;
    status: {
      self: string;
      description: string;
      iconUrl: string;
      name: string;
      id: string;
      statusCategory: {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
  };
}

export interface JiraStory {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    summary: string;
    issuetype: {
      self: string;
      id: string;
      description: string;
      iconUrl: string;
      name: string;
      subtask: boolean;
      avatarId: number;
      entityId: string;
      hierarchyLevel: number;
    };
    created: string;
    assignee: {
      self: string;
      accountId: string;
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
      accountType: string;
    };
    updated: string;
    status: {
      self: string;
      description: string;
      iconUrl: string;
      name: string;
      id: string;
      statusCategory: {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
  };
}

export interface JiraIssue extends JiraBug, JiraTask, JiraStory {}

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

export interface JiraPaginatedIssuesResponse {
  issues: JiraIssue[];
  total: number;
  startAt: number;
  maxResults: number;
}
