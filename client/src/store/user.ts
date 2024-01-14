import { makeAutoObservable } from "mobx";
import { IUser } from "../interfaces/user.interface";

class User {
  user = {} as IUser;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(newData: IUser) {
    this.user = newData;
  }
}

export default new User();
