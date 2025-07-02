import {
  type RouteConfig,
  index,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  ...prefix(':lang', [
    index('pages/index.tsx'),
    route('connect/jira', 'pages/connect/jira.tsx'),
  ]),
] satisfies RouteConfig;
