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
}
