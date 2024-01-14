import { IMessage } from "./message.interface";
import { INotification } from "./notification.interface";
import { IPost } from "./post.interface";
import { ISettings } from "./settings.interface";

export interface IUser {
  _id: string;
  avatar: string;
  username: string;
  description: string;
  email: string;
  isActivated: boolean;
  friends: IUser[];
  subscriptions: IUser[];
  subscribers: IUser[];
  posts: IPost[];
  recentChatUsers: { user: IUser; lastMessage: IMessage };
  notifications: INotification[];
  settings: ISettings;
}
