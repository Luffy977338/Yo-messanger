import { IMessage } from "./message.interface";
import { INotification } from "./notification.interface";
import { IPost } from "./post.interface";

export interface IUser {
  avatar: string;
  username: string;
  description: string;
  email: string;
  _id: number;
  isActivated: boolean;
  friends: IUser[];
  subscriptions: IUser[];
  subscribers: IUser[];
  posts: IPost[];
  recentChatUsers: { user: IUser; lastMessage: IMessage };
  notifications: INotification[];
}
