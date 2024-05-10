import React from 'react';
import Avatar from '../Reusables/Avatar';
import StyledText from '../Elements/StyledText';
import { ChevronRight } from 'lucide-react';
import { capitalizeFirstLetter } from '../../utils/string';
import { Link } from 'react-router-dom';

interface IProfileWithNameProps {
  name: string | React.ReactNode;
  avatar?: string | null;
  subtitle: string | React.ReactNode;
  showChevron?: boolean;
  avatarSize?: number;
  username?: string;
}

const ProfileWithName = ({
  avatar,
  name,
  subtitle,
  showChevron = false,
  avatarSize = 48,
  username,
  ...rest
}: IProfileWithNameProps) => {
  return (
    <Link
      to={`/profile/${username}`}
      className="flex flex-row w-full items-center justify-between cursor-pointer"
      {...rest}
    >
      <div className="flex flex-row items-center space-x-2">
        <Avatar src={avatar} size={avatarSize} />
        <div className="flex flex-col ml-2">
          <StyledText className="text-sm font-semibold text-neutral-800">
            {name}
          </StyledText>
          <StyledText className="text-xs text-neutral-500">
            {typeof subtitle === 'string'
              ? capitalizeFirstLetter(subtitle)
              : subtitle}
          </StyledText>
        </div>
      </div>
      {showChevron && <ChevronRight size={20} />}
    </Link>
  );
};

export default ProfileWithName;
