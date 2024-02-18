import { IComment } from "./comment.interface";
import { IUser } from "./user.interface";

export interface IPost {
  _id: string;
  userCreator: IUser;
  content: string;
  pictures: string[] | [];
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
