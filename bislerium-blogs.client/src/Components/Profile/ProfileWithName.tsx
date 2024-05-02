import React from 'react';
import { UserRole } from '../../enums/UserRole';
import Avatar from '../Reusables/Avatar';
import StyledText from '../Elements/StyledText';
import { ChevronRight } from 'lucide-react';
import { capitalizeFirstLetter } from '../../utils/string';

interface IProfileWithNameProps extends React.HTMLProps<HTMLDivElement> {
  name?: string;
  avatar?: string | null;
  role?: UserRole;
}

const ProfileWithName = ({
  avatar,
  name,
  role,
  ...rest
}: IProfileWithNameProps) => {
  return (
    <div
      className="flex flex-row w-full items-center justify-between cursor-pointer"
      {...rest}
    >
      <div className="flex flex-row items-center space-x-2">
        <Avatar src={avatar} size={10} />
        <div className="flex flex-col ml-2">
          <StyledText className="text-sm font-semibold text-neutral-800">
            {name}
          </StyledText>
          <StyledText className="text-xs text-neutral-500">
            {capitalizeFirstLetter(role) || 'User'}
          </StyledText>
        </div>
      </div>

      <ChevronRight size={20} />
    </div>
  );
};

export default ProfileWithName;
