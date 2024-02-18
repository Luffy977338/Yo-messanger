import { IPost } from "./post.interface";
import { IUser } from "./user.interface";

export interface IComment {
  _id: string;
  post: IPost;
  user: IUser;
  likes: IUser[];
  message?: string;
  pictures?: string[];
}
