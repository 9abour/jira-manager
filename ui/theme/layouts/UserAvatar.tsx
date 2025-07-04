import type { JiraUser } from 'core/types/jira.types';
import { ChevronDown } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useCookies } from 'react-cookie';

interface UserAvatarProps {}

const UserAvatar: FunctionComponent<UserAvatarProps> = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'jiraCredentials',
    'jiraUserInfo',
  ]);

  const userInfo: JiraUser = cookies.jiraUserInfo;

  if (!userInfo) return;

  return (
    <button className="flex items-center">
      <div className="relative">
        <img
          src={userInfo.avatarUrls['24x24']}
          className="w-[25px] h-[25px] mx-2"
        />

        <div className="absolute bottom-0 right-[6px] w-2 h-2 bg-[#30d748] rounded-full" />
      </div>

      <span className="font-bold text-[#2a2827] text-[14px]">
        {userInfo.displayName}
      </span>

      <div className="text-gray-600 ml-1">
        <ChevronDown strokeWidth={3} size={15} />
      </div>
    </button>
  );
};

export default UserAvatar;
