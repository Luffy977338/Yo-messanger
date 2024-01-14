const UserModel = require("../../models/user.model");
const notificationService = require("../../service/notification.service");

function NotificationHandler(socket, io) {
  socket.on("comment", async ({ commentedUserId, commentedPostId, userId }) => {
    const commentedUser = await UserModel.findById(commentedUserId);

    if (commentedClient) {
      const user = await UserModel.findById(userId);

      commentedClient.emit("newNotification", {
        user,
        type: "comment",
        isViewed: false,
      });
    }

    const notification = await notificationService.newNotification(
      userId,
      "comment",
    );
    return notification;
  });

  socket.on("like", async ({ likedPostId, likedUserId, userId }) => {
    try {
      const likedUser = await UserModel.findById(likedUserId);
      const notification = await notificationService.newNotification(
        likedPostId,
        likedUserId,
        userId,
        "like",
      );

      if (likedUser.socketId) {
        io.to(likedUser.socketId).emit("newNotification", notification);
      }

      return notification.populate("user post");
    } catch (error) {
      console.log(error);
    }
  });

  // socket.on("subscription", async ({ SubscriptionUserId, userId }) => {
  //   const subscriptionClient = await socketClientModel.findById(
  //     SubscriptionUserId,
  //   );

  //   if (subscriptionClient) {
  //     const user = await UserModel.findById(userId);

  //     subscriptionClient.emit("newNotification", {
  //       user,
  //       type: "subscription",
  //       isViewed: false,
  //     });
  //   }

  //   return notificationService.newNotification(userId, "subscription");
  // });
}

module.exports = NotificationHandler;
