const UserModel = require("../../models/user.model");
const notificationService = require("../../service/notification.service");

function NotificationHandler(socket, io) {
  socket.on("comment", async ({ toUserId, postId, userId, commentId }) => {
    try {
      const commentedUser = await UserModel.findById(toUserId);

      const notification = await notificationService.newCommentNotification({
        toUserId,
        userId,
        postId,
        commentId,
      });

      if (commentedUser.socketId) {
        io.to(commentedUser.socketId).emit("newNotification", notification);
      }

      return notification;
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("like", async ({ postId, toUserId, userId }) => {
    try {
      const likedUser = await UserModel.findById(toUserId);

      const notification = await notificationService.newLikeNotification({
        postId,
        toUserId,
        userId,
      });

      if (likedUser.socketId) {
        io.to(likedUser.socketId).emit("newNotification", notification);
      }

      return notification.populate("user post");
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("friendReq", async ({ toUserId, userId }) => {
    try {
      const friendRequestUser = await UserModel.findById(toUserId);

      const notification =
        await notificationService.newFriendRequestNotification({
          toUserId,
          userId,
        });

      if (friendRequestUser.socketId) {
        io.to(friendRequestUser.socketId).emit("newNotification", notification);
      }

      return notification.populate("user");
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = NotificationHandler;
