import { LogOutIcon, Trash2, UserRound } from 'lucide-react';
import Dropdown from '../Reusables/Dropdown';
import Avatar from '../Reusables/Avatar';
import useUsersQuery from '../../hooks/react-query/useUsersQuery';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../services/stores/useAuthStore';
import AlterModal from '../Modal/AlertModal';

export const NavbarAvatar = () => {
  const {
    getMe: { data },
    deleteMe,
  } = useUsersQuery();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const { logout } = useAuthStore();

  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState<boolean>(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState<boolean>(false);

  return (
    <>
      <AlterModal
        isOpen={isLogOutModalOpen}
        title="Logout"
        subtitle="Are you sure you want to logout?"
        onConfirm={() => {
          logout();
          setIsLogOutModalOpen(false);
        }}
        onCancel={() => setIsLogOutModalOpen(false)}
        type="warn"
      />

      <AlterModal
        isOpen={isDeleteAccountModalOpen}
        title="Delete Account"
        subtitle="Deleting your account will remove all your data from our servers. The action is irreversible. Are you sure you want to delete your account?"
        onConfirm={() => {
          deleteMe.mutate();
          setIsDeleteAccountModalOpen(false);
        }}
        onCancel={() => setIsDeleteAccountModalOpen(false)}
        type="danger"
      />

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
            label: 'Log Out',
            onClick: () => setIsLogOutModalOpen(true),
            icon: <LogOutIcon size={20} />,
            bordered: true,
          },
          {
            label: 'Delete Account',
            onClick: () => setIsDeleteAccountModalOpen(true),
            icon: <Trash2 size={20} />,
            bordered: true,
          },
        ]}
      />
    </>
  );
};
