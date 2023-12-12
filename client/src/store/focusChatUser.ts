import { makeAutoObservable } from "mobx";

class FocusChatUser {
   focusChatUser: string = "";

   constructor() {
      makeAutoObservable(this);
   }

   setFocusChatUser(username: string) {
      this.focusChatUser = username;
   }
}

export default new FocusChatUser();
