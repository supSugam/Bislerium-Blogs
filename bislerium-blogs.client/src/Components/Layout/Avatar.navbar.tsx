import { KeyIcon, LogOutIcon, Trash2, UserRound } from 'lucide-react';
import Dropdown from '../Reusables/Dropdown';
import Avatar from '../Reusables/Avatar';
import useUsersQuery from '../../hooks/react-query/useUsersQuery';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../services/stores/useAuthStore';
import AlterModal from '../Modal/AlertModal';
import ProfileWithName from '../Profile/ProfileWithName';
import { cn } from '../../utils/cn';
import { UserRole } from '../../enums/UserRole';

export const NavbarAvatar = () => {
  const {
    getMe: { data },
    deleteMe,
  } = useUsersQuery();
  const {
    logout,
    setCurrentUser,
    currentUser,
    setAuthModalActiveSection,
    openAuthModal,
  } = useAuthStore();

  useEffect(() => {
    setCurrentUser(data?.data?.result ?? null);
  }, [data, setCurrentUser]);

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
        closeOnClick
        className={cn({
          'cursor-pointer': currentUser,
          hidden: !currentUser,
        })}
        targetComponent={<Avatar src={currentUser?.avatarUrl} />}
        items={[
          {
            onClick: () => {
              setAuthModalActiveSection('update-profile');
              openAuthModal();
            },
            bordered: true,
            element: (
              <ProfileWithName
                name={currentUser?.fullName}
                avatar={currentUser?.avatarUrl ?? ''}
                subtitle={currentUser?.role}
                showChevron
              />
            ),
          },
          {
            onClick: () => {
              setAuthModalActiveSection('update-profile');
              openAuthModal();
            },
            icon: <UserRound size={20} />,
            bordered: true,
            label: 'Update Profile',
          },
          {
            label: 'Reset Password',
            onClick: () => {
              setAuthModalActiveSection('reset-password');
              openAuthModal();
            },
            icon: <KeyIcon size={20} />,
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

          ...(currentUser?.role === UserRole.ADMIN
            ? [
                {
                  label: 'Add New Admin',
                  onClick: () => {
                    setAuthModalActiveSection('signup');
                    openAuthModal();
                  },
                  bordered: true,
                },
              ]
            : []),
        ]}
      />
    </>
  );
};
