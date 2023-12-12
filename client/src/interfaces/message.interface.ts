import { IUser } from "./user.interface";

export interface IMessage {
   _id: string;
   messageCreator: IUser;
   createdAt: Date;
   content: string;
   picture: null | File;
}

export interface IChatRoom {
   _id: string;
   roomId: string;
   messages: IMessage[];
}
