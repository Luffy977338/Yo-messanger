const UserModel = require("../models/user.model");
const ChatHandler = require("./eventHandlers/chat.socket");
const NotificationHandler = require("./eventHandlers/notification.socket");

function WebsocketSetUp(io) {
  io.on("connection", async (socket) => {
    socket.on("setUserId", async (userId) => {
      socket.userId = userId;
      await UserModel.findOneAndUpdate(
        { _id: userId },
        { socketId: socket.id },
        { new: true },
      );
    });

    ChatHandler(socket, io);
    NotificationHandler(socket, io);
  });
}

module.exports = WebsocketSetUp;
