import { UserRole } from '../../enums/UserRole';

export interface IUser {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string | null;
  role: UserRole;
}
