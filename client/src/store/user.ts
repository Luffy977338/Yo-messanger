import { makeAutoObservable } from "mobx";
import { IUser } from "../interfaces/user.interface";

class User {
   user = {} as IUser;

   constructor() {
      makeAutoObservable(this);
   }

   setUser(newData: IUser) {
      this.user.username = newData.username;
      this.user.description = newData.description;
      this.user.email = newData.email;
      this.user._id = newData._id;
      this.user.isActivated = newData.isActivated;
      this.user.avatar = newData.avatar;
      this.user.friends = newData.friends;
      this.user.subscriptions = newData.subscriptions;
      this.user.subscribers = newData.subscribers;
   }
}

export default new User();
