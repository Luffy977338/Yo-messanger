const ERROR = require("../constants/ERROR");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exceptions/api-error");
const UserModel = require("../models/user.model");

class UserFriendshipService {
  async subscribe(id, subscriberId) {
    const subscriber = await UserModel.findByIdAndUpdate(
      subscriberId,
      { $addToSet: { subscriptions: id } },
      { new: true },
    ).populate("subscriptions");

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $addToSet: { subscribers: subscriberId } },
      { new: true },
    ).populate("subscribers");

    if (!subscriber || !user) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const userDto = new UserDto(user);
    const subscriberDto = new UserDto(subscriber);

    return { user: userDto, subscriber: subscriberDto };
  }

  async unsubscribe(id, subscriberId) {
    const subscriber = await UserModel.findByIdAndUpdate(
      subscriberId,
      { $pull: { subscriptions: id } },
      { new: true },
    ).populate("subscriptions");

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { subscribers: subscriberId } },
      { new: true },
    ).populate("subscribers");

    if (!subscriber || !user) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const userDto = new UserDto(user);
    const subscriberDto = new UserDto(subscriber);

    return { user: userDto, subscriber: subscriberDto };
  }

  async acceptFriend(id, subscriberId) {
    await this.unsubscribe(subscriberId, id);
    const updatedSubscriber = await UserModel.findByIdAndUpdate(
      subscriberId,
      { $addToSet: { friends: id } },
      { new: true },
    )
      .populate("subscriptions")
      .populate("friends")
      .populate("subscribers");

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { friends: subscriberId },
      },
      { new: true },
    )
      .populate("subscribers")
      .populate("friends")
      .populate("subscriptions");

    if (!updatedSubscriber || !updatedUser) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const subscriberDto = new UserDto(updatedSubscriber);
    const userDto = new UserDto(updatedUser);

    return { user: userDto, subscriber: subscriberDto };
  }

  async rejectFriend(id, subscriberId) {
    const updatedSubscriber = await UserModel.findByIdAndUpdate(
      id,
      {
        $pull: { subscriptions: subscriberId },
      },
      { new: true },
    )
      .populate("subscribers")
      .populate("friends");

    const updatedUser = await UserModel.findByIdAndUpdate(
      subscriberId,
      { $pull: { subscribers: id } },
      { new: true },
    )
      .populate("subscriptions")
      .populate("friends");

    if (!updatedSubscriber || !updatedUser) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const subscriberDto = new UserDto(updatedSubscriber);
    const userDto = new UserDto(updatedUser);

    return { user: userDto, subscriber: subscriberDto };
  }

  async deleteFriend(id, subscriberId) {
    const updatedSubscriber = await UserModel.findByIdAndUpdate(
      subscriberId,
      { $pull: { friends: id } },
      { new: true },
    ).populate("friends");

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { friends: subscriberId } },
      { new: true },
    ).populate("friends");

    if (!updatedSubscriber || !updatedUser) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const userDto = new UserDto(updatedUser);
    const subscriberDto = new UserDto(updatedSubscriber);

    return { user: userDto, subscriber: subscriberDto };
  }
}

module.exports = new UserFriendshipService();
