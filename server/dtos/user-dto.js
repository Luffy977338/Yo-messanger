module.exports = class UserDto {
  avatar;
  username;
  email;
  _id;
  isActivated;
  friends;
  subscriptions;
  description;
  posts;
  recentChatUsers;

  constructor(model) {
    this.avatar = model.avatar;
    this.username = model.username;
    this.description = model.description;
    this.email = model.email;
    this._id = model._id;
    this.isActivated = model.isActivated;
    this.friends = model.friends;
    this.subscriptions = model.subscriptions;
    this.subscribers = model.subscribers;
    this.posts = model.posts;
    this.recentChatUsers = model.recentChatUsers;
  }
};
