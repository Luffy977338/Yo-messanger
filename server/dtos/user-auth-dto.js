module.exports = class UserAuthDto {
   username;
   email;
   _id;

   constructor(model) {
      this.username = model.username;
      this.email = model.email;
      this._id = model._id;
   }
};
