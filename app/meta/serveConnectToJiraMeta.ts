import { useLang } from "@hooks/useLang";

export const serveConnectToJiraMeta = () => {
  const { t } = useLang();

  return [{ title: t.meta.connectToJira }];
}