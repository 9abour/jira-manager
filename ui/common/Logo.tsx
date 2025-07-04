import Link from '@ui/common/Link';
import type { FunctionComponent } from 'react';

const Logo: FunctionComponent = () => {
  return (
    <Link to="/">
      <img src="/jira-logo.webp" className="w-[50px] h-[50px]" />
    </Link>
  );
};

export default Logo;
