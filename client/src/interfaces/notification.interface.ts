import { IPost } from "./post.interface";
import { IUser } from "./user.interface";

export interface INotification {
  _id: string;
  user: IUser;
  type: "like" | "comment" | "subscribe";
  isViewed: boolean;
  post?: IPost;
}
