import { UserRound } from 'lucide-react';
import Dropdown from '../Reusables/Dropdown';
import Avatar from '../Reusables/Avatar';
import useUsersQuery from '../../hooks/react-query/useUsersQuery';
import { useEffect } from 'react';

export const NavbarAvatar = () => {
  const {
    getMe: { data },
  } = useUsersQuery();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Dropdown
      targetComponent={<Avatar />}
      items={[
        {
          label: 'Profile',
          onClick: () => console.log('Profile'),
          icon: <UserRound size={20} />,
          bordered: true,
        },
        {
          label: 'Settings',
          onClick: () => console.log('Settings'),
          icon: <UserRound size={20} />,
          bordered: true,
        },
        {
          label: 'Logout',
          onClick: () => console.log('Logout'),
          icon: <UserRound size={20} />,
          bordered: true,
        },
      ]}
    />
  );
};
