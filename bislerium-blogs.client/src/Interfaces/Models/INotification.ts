import { NotificationType } from '../../enums/NotificationType';
import { IUser } from './IUser';

export interface INotification {
  notificationId: string;
  triggerUser: IUser;
  blogPostId: string;
  commentId: string;
  notificationType: NotificationType;
  notificationMessage: string;
  createdAt: string;
  isRead: boolean;
}
