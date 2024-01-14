module.exports = class ClosedUserDto {
  avatar;
  username;
  email;
  _id;
  isActivated;
  friends;
  subscriptions;
  description;
  recentChatUsers;
  notifications;
  settings;

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
    this.recentChatUsers = model.recentChatUsers;
    this.notifications = model.notifications;
    this.settings = model.settings;
  }
};
