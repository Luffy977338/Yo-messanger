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

  async newLikeNotification({ toUserId, userId, postId }) {
    if (!toUserId || !userId || !postId)
      throw ApiError.BadRequest(ERROR.expectedId);

    if (toUserId === userId)
      throw ApiError.BadRequest(
        ERROR.notificationCannotBeSentToTheSameIdAsTheSender,
      );

    const user = await UserModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const post = await postModel.findById(postId);

    if (!post) throw ApiError.NotFound(ERROR.postNotFound);

    const isNotificationExist = await notificationModel.findOne({
      user: userId,
      post: postId,
      type: "like",
    });

    if (isNotificationExist)
      throw ApiError.BadRequest(ERROR.notificationAlreadyExist);

    const notification = await notificationModel.create({
      user: userId,
      type: "like",
      isViewed: false,
      post: postId,
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
      populate: "userCreator comments",
    });
  }

  async newCommentNotification({ toUserId, userId, postId, commentId }) {
    if (!toUserId || !userId || !postId || !commentId)
      throw ApiError.BadRequest(ERROR.expectedId);

    if (toUserId === userId)
      throw ApiError.BadRequest(
        ERROR.notificationCannotBeSentToTheSameIdAsTheSender,
      );

    const user = await UserModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const post = await postModel.findById(postId);

    if (!post) throw ApiError.NotFound(ERROR.postNotFound);

    const notification = await notificationModel.create({
      user: userId,
      type: "comment",
      isViewed: false,
      post: postId,
      comment: commentId,
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

    return (await notification.populate("user post comment")).populate({
      path: "post",
      populate: "userCreator comments",
    });
  }

  async newFriendRequestNotification({ toUserId, userId }) {
    if (!toUserId || !userId) throw ApiError.BadRequest(ERROR.expectedId);

    if (toUserId === userId)
      throw ApiError.BadRequest(
        ERROR.notificationCannotBeSentToTheSameIdAsTheSender,
      );

    const user = await UserModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const isNotificationExist = await notificationModel.findOne({
      user: userId,
      type: "friendReq",
    });

    if (isNotificationExist)
      throw ApiError.BadRequest(ERROR.notificationAlreadyExist);

    const notification = await notificationModel.create({
      user: userId,
      type: "friendReq",
      isViewed: false,
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

    return await notification.populate("user");
  }
}

module.exports = new NotificationService();
