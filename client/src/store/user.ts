import { makeAutoObservable } from "mobx";
import { IUser } from "../interfaces/user.interface";

class User {
   user = {} as IUser;
   recentUsers: IUser[] = [];

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

   addAndUpdateRecentMessage(user: IUser) {
      const userIndex = this.recentUsers.findIndex((u) => u._id === user._id);
      if (userIndex !== -1) {
         this.recentUsers.splice(userIndex, 1);
      }
      this.recentUsers.unshift(user);
   }
}

export default new User();
