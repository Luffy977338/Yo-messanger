import { IPost } from "./post.interface";
import { IUser } from "./user.interface";

export interface IComment {
  _id: string;
  post: IPost;
  user: IUser;
  likes: IUser[];
  replies: IComment[];
  createdAt: Date;
  reply: IComment | null;
  message?: string;
  pictures?: string[];
}
