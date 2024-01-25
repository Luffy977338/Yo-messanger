module.exports = class UserAuthDto {
  _id;
  username;
  email;
  isActivated;

  constructor(model) {
    this._id = model._id;
    this.username = model.username;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
};
