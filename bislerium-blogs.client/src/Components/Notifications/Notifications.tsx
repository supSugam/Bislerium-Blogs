import { forwardRef, useEffect, useState } from 'react';
import useNotificationsQuery from '../../hooks/react-query/useNotificationsQuery';
import NotificationIcon from '../../lib/SVGs/NotificationIcon';
import { cn } from '../../utils/cn';
import { INotification } from '../../Interfaces/Models/INotification';
import { htmlToText, whenDidItHappen } from '../../utils/string';
import { AVATAR_PLACEHOLDER, COLORS } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Dot, ListChecks } from 'lucide-react';
import { Tooltip } from '../Reusables/Tooltip';
import { Link } from 'react-router-dom';
import { NotificationType } from '../../enums/NotificationType';
import toast from 'react-hot-toast';
interface INotificationProps {
  isOpen: boolean;
}
const Notifications = forwardRef<HTMLDivElement, INotificationProps>(
  ({ isOpen }: INotificationProps) => {
    const {
      getMyNotifications: {
        data: notificationsData,
        isLoading,
        isRefetching,
        isPending,
        isFetching,
      },
      readAllNotifications,
      readNotification,
    } = useNotificationsQuery();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const isNotificationsLoading =
      isLoading || isRefetching || isPending || isFetching;

    useEffect(() => {
      setNotifications(notificationsData?.data.result ?? []);
    }, [notificationsData]);

    useEffect(() => {
      if (notifications.length < 1) return;
      const showToast =
        notificationsData?.data.result?.[0]?.notificationId !==
        notifications?.[0]?.notificationId;
      if (showToast) {
        toast(
          htmlToText(
            notificationsData?.data.result?.[0]?.notificationMessage ??
              'New Notification!'
          ),
          { icon: '🔔' }
        );
      }
    }, [notificationsData, notifications]);

    const getNotificationLink = (notification: INotification) => {
      switch (notification.notificationType) {
        case NotificationType.UPVOTE_BLOG:
        case NotificationType.DOWNVOTE_BLOG:
          return `/blog/${notification.blogPostId}`;

        case NotificationType.UPVOTE_COMMENT:
        case NotificationType.DOWNVOTE_COMMENT:
        case NotificationType.COMMENT:
        case NotificationType.REPLY:
          return `/blog/${notification.blogPostId}?commentId=${notification.commentId}`;

        case NotificationType.BOOKMARK:
          return `/blog/${notification.blogPostId}`;

        default:
          return '/';
      }
    };

    return (
      <AnimatePresence key={'notifications'}>
        {isOpen && (
          <motion.div
            className={`absolute flex bg-white shadow-normal bottom-0 right-0 h-auto rounded-md border-neutral-300 max-h-[70vh]`}
            initial={{ opacity: 0, y: '90%' }}
            animate={{ opacity: isOpen ? 1 : 0, y: '103%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="notifications"
          >
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center gap-x-3 border-b border-neutral-300 p-4">
                <div className="flex gap-x-2 items-center">
                  <NotificationIcon size={22} fill={COLORS.primary} />
                  <h1 className="text-2xl font-bold">Notifications</h1>
                </div>
                <Tooltip label="Mark all as read">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      readAllNotifications.mutate();
                    }}
                    className="flex items-center justify-center p-2 rounded-md border border-neutral-300 bg-white"
                  >
                    <ListChecks size={18} />
                  </button>
                </Tooltip>
              </div>
              <div
                className={cn(
                  'flex flex-col w-full overflow-y-scroll max-w-full overflow-x-hidden no-scrollbar'
                )}
              >
                {notifications.map(
                  (
                    {
                      blogPostId,
                      commentId,
                      createdAt,
                      isRead,
                      notificationId,
                      notificationMessage,
                      notificationType,
                      triggerUser,
                    },
                    index
                  ) => (
                    <Link
                      to={getNotificationLink({
                        blogPostId,
                        commentId,
                        createdAt,
                        isRead,
                        notificationId,
                        notificationMessage,
                        notificationType,
                        triggerUser,
                      })}
                      className={'w-full'}
                      key={notificationId}
                      onClick={() => readNotification.mutate(notificationId)}
                    >
                      <motion.div
                        className={cn(
                          'flex flex-col gap-y-3 border-b border-neutral-200 py-3 w-full hover:bg-neutral-100 transition-all duration-100 ease-in px-4',
                          {
                            'bg-neutral-50': !isRead,
                          }
                        )}
                        key={isOpen + ''}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{
                          duration: 0.1,
                          delay: index * 0.03,
                        }}
                      >
                        <div className="flex justify-between gap-x-3 max-w-full overflow-x-hidden">
                          {/* Image */}
                          <img
                            src={triggerUser.avatarUrl ?? AVATAR_PLACEHOLDER}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex flex-col gap-y-2 flex-1">
                            <div className="flex-col flex items-start">
                              <h3
                                id="notification-message"
                                className="text-sm font-normal text-left text-pretty text-neutral-600"
                                dangerouslySetInnerHTML={{
                                  __html: notificationMessage,
                                }}
                              />
                              <p className="text-sm text-secondary">
                                {whenDidItHappen(createdAt)}
                              </p>
                            </div>
                          </div>

                          <Dot
                            size={10}
                            style={{ transform: 'scale(3)' }}
                            className={cn('text-primary self-center', {
                              'opacity-0': isRead,
                            })}
                          />
                        </div>
                      </motion.div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

export default Notifications;
