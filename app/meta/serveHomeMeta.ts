import { useLang } from '@hooks/useLang';

export default function serveHomeMeta() {
  const { t } = useLang();
  return [{ title: t.meta.home }];
}
