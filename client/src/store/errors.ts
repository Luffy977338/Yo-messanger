import { makeAutoObservable } from "mobx";

class Errors {
   error: string = "";
   constructor() {
      makeAutoObservable(this);
   }

   setError(err: string) {
      this.error = err;
   }

   makeErrorEmpty() {
      this.error = "";
   }
}

export default new Errors();
