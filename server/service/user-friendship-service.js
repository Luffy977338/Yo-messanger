const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const UserModel = require("../models/user-model");

class UserFriendshipService {
   async subscribe(id, subscriberId) {
      if (!id || !subscriberId) {
         throw ApiError.NotFound("Пользователь не был найден");
      }

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

      const userDto = new UserDto(user);
      const subscriberDto = new UserDto(subscriber);

      return { user: userDto, subscriber: subscriberDto };
   }

   async unsubscribe(id, subscriberId) {
      if (!id || !subscriberId) {
         throw ApiError.NotFound("Пользователь не был найден");
      }

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

      const userDto = new UserDto(user);
      const subscriberDto = new UserDto(subscriber);

      return { user: userDto, subscriber: subscriberDto };
   }

   async acceptFriend(id, subscriberId) {
      if (!id || !subscriberId) {
         throw ApiError.NotFound("Пользователь не был найден");
      }

      const updatedSubscriber = await UserModel.findByIdAndUpdate(
         subscriberId,
         { $addToSet: { friends: id }, $pull: { subscriptions: id } },
         { new: true },
      )
         .populate("subscriptions")
         .populate("friends")
         .populate("subscribers");

      const updatedUser = await UserModel.findByIdAndUpdate(
         id,
         {
            $addToSet: { friends: subscriberId },
            $pull: { subscribers: subscriberId },
         },
         { new: true },
      )
         .populate("subscribers")
         .populate("friends")
         .populate("subscriptions");

      const subscriberDto = new UserDto(updatedSubscriber);
      const userDto = new UserDto(updatedUser);

      return { user: userDto, subscriber: subscriberDto };
   }

   async rejectFriend(id, subscriberId) {
      if (!id || !subscriberId) {
         throw ApiError.NotFound("Пользователь не был найден");
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
         subscriberId,
         { $pull: { subscribers: id } },
         { new: true },
      )
         .populate("subscriptions")
         .populate("friends");

      const updatedSubscriber = await UserModel.findByIdAndUpdate(
         id,
         {
            $pull: { subscriptions: subscriberId },
         },
         { new: true },
      )
         .populate("subscribers")
         .populate("friends");

      const subscriberDto = new UserDto(updatedSubscriber);
      const userDto = new UserDto(updatedUser);

      return { user: userDto, subscriber: subscriberDto };
   }

   async deleteFriend(id, subscriberId) {
      if (!id || !subscriberId) {
         throw ApiError.NotFound("Пользователь не был найден");
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
         id,
         { $pull: { friends: subscriberId } },
         { new: true },
      ).populate("friends");

      const updatedSubscriber = await UserModel.findByIdAndUpdate(
         subscriberId,
         { $pull: { friends: id } },
         { new: true },
      ).populate("friends");

      const userDto = new UserDto(updatedUser);
      const subscriberDto = new UserDto(updatedSubscriber);

      return { user: userDto, subscriber: subscriberDto };
   }
}

module.exports = new UserFriendshipService();
