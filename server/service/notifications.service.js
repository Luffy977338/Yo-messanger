const ERROR = require("../constants/ERROR");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exceptions/api-error");
const notificationModel = require("../models/notification.model");
const userModel = require("../models/user.model");

class NotificationService {
  async newNotification(postId, toUserId, userId, type) {
    const user = await userModel.findById(userId);

    if (!user) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const userDto = new UserDto(user);

    const notification = await notificationModel.create({
      user: userDto,
      type: type,
      isViewed: false,
      post: postId ? postId : null,
    });

    await userModel.updateOne(
      { _id: toUserId },
      {
        $push: {
          notifications: {
            $each: [notification],
            $position: 0,
          },
        },
      },
    );

    return await notification.populate("user post");
  }

  async makeNotificationViewed(notifId) {
    const notification = await notificationModel.findByIdAndUpdate(
      notifId,
      { isViewed: true },
      { new: true },
    );

    if (!notification) {
      throw ApiError.NotFound(ERROR.notificationNotFound);
    }

    return await notification.populate("user post");
  }
}

module.exports = new NotificationService();
