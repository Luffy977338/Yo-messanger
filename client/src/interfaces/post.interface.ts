import { IUser } from "./user.interface";

export interface IPost {
  _id: string;
  userCreator: IUser;
  content: string;
  pictures: string[] | [];
  likes: string[];
  comments: [{ user: IUser; content: string }];
  createdAt: Date;
  updatedAt: Date;
}
