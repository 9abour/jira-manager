import Logo from '@ui/common/Logo';
import UserAvatar from '@ui/theme/layouts/UserAvatar';
import type { FunctionComponent } from 'react';

interface NavbarProps {}

const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <nav className="w-full h-[71px] bg-white border border-gray-200 px-4">
      <div className="w-full flex items-center justify-between h-full">
        <Logo />

        <UserAvatar />
      </div>
    </nav>
  );
};

export default Navbar;
