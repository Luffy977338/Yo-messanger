const ERROR = require("../constants/ERROR");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exceptions/api-error");
const notificationModel = require("../models/notification.model");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");

class NotificationService {
  async newNotification(postId, toUserId, userId, type) {
    const user = await userModel.findById(userId);

    if (!user) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const post = await postModel.findById(postId);

    if (!post) {
      throw ApiError.NotFound(ERROR.postNotFound);
    }

    const userDto = new UserDto(user);

    const isNotificationExist = await notificationModel.findOne({
      user: userDto,
      post: postId,
      type,
    });

    if (isNotificationExist) {
      throw ApiError.BadRequest(ERROR.notificationAlreadyExist);
    }

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

    return (await notification.populate("user post")).populate({
      path: "post",
      populate: "userCreator",
    });
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

  async deleteNotificationByPostId(postId) {
    const notification = await notificationModel.deleteMany({
      post: postId,
    });

    return notification;
  }
}

module.exports = new NotificationService();
