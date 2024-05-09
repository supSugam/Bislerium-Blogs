import { Edit3, Link, MoreHorizontal, ReplyIcon, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import Dropdown, { DropdownItem } from '../Reusables/Dropdown';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { IUser } from '../../Interfaces/Models/IUser';
import { useNavigate } from 'react-router-dom';
import AlterModal from '../Modal/AlertModal';
import useBlogsQuery from '../../hooks/react-query/useBlogsQuery';
import toast from 'react-hot-toast';

interface IBlogOptionsProps {
  id: string;
  author: IUser;
}
const BlogOptions = ({ author, id }: IBlogOptionsProps) => {
  const [deleteBlogModalOpen, setDeleteBlogModalOpen] =
    useState<boolean>(false);
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  const options: DropdownItem[] = useMemo(() => {
    const items: DropdownItem[] = [];
    if (currentUser && currentUser.userId === author.userId) {
      items.push({
        label: 'Update',
        icon: <Edit3 size={20} />,
        onClick: () => {
          navigate(`/blog/update/${id}`);
        },
      });
      items.push({
        label: 'Delete',
        icon: <Trash size={20} />,
        onClick: () => {
          setDeleteBlogModalOpen(true);
        },
      });
    }
    items.push({
      label: 'Copy Link',
      onClick: () => {
        navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
        toast('Link Copied to Clipboard', {
          icon: '📋',
        });
      },
      icon: <Link size={20} />,
    });

    items.push({
      label: 'Comment',
      onClick: () => {
        navigate(`/blog/${id}?comments=true`);
      },
      icon: <ReplyIcon size={20} />,
    });
    return items;
  }, [author, currentUser, id, navigate]);

  const { deleteBlog } = useBlogsQuery({ id });

  return (
    <>
      <AlterModal
        isOpen={deleteBlogModalOpen}
        onCancel={() => setDeleteBlogModalOpen(false)}
        title="Delete Blog"
        subtitle="Are you sure you want to delete this blog?"
        onConfirm={async () => {
          setDeleteBlogModalOpen(false);
          await deleteBlog.mutateAsync(id, {
            onSuccess: () => {
              navigate('/');
            },
          });
        }}
        type="danger"
        cancelText="Cancel"
        confirmText="Delete"
      />

      <Dropdown
        targetComponent={
          <button
            className={cn(
              'flex items-center justify-center p-2 rounded-md border border-neutral-300 bg-white'
            )}
          >
            <MoreHorizontal size={20} />
          </button>
        }
        items={options}
        closeOnClick
      />
    </>
  );
};

export default BlogOptions;
