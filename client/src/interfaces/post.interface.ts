import { IUser } from "./user.interface";

export interface IPost {
   _id: number;
   userCreator: IUser;
   content: string;
   picture: string;
   likes: number[];
   comments: [{ user: IUser; content: string }];
   createdAt: Date;
   updatedAt: Date;
}
