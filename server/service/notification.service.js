const ERROR = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const notificationModel = require("../models/notification.model");
const postModel = require("../models/post.model");
const UserModel = require("../models/user.model");

class NotificationService {
  async getNotifications(userId) {
    if (!userId) throw ApiError.BadRequest(ERROR.expectedId);

    const user = await UserModel.findById(userId).populate({
      path: "notifications",
      populate: [{ path: "user" }, { path: "post", populate: "userCreator" }],
    });

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const notifications = user.notifications;

    return notifications;
  }

  async newNotification(postId, toUserId, userId, type) {
    const user = await UserModel.findById(userId);
    const post = await postModel.findById(postId);
    if (!user) throw ApiError.NotFound(ERROR.userNotFound);
    if (!post) throw ApiError.NotFound(ERROR.postNotFound);

    const isNotificationExist = await notificationModel.findOne({
      user: userId,
      post: postId,
      type,
    });

    if (isNotificationExist)
      throw ApiError.BadRequest(ERROR.notificationAlreadyExist);

    const notification = await notificationModel.create({
      user: userId,
      type: type,
      isViewed: false,
      post: postId ? postId : null,
    });

    await UserModel.updateOne(
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

    if (!notification) throw ApiError.NotFound(ERROR.notificationNotFound);

    return await notification.populate("user post");
  }

  async deleteNotificationsByPostId(postId) {
    const notification = await notificationModel.deleteMany({
      post: postId,
    });

    return notification;
  }
}

module.exports = new NotificationService();
