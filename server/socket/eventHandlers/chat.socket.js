const ERROR = require("../../constants/ERROR");
const UserDto = require("../../dtos/user.dto");
const ApiError = require("../../exceptions/api-error");
const userModel = require("../../models/user.model");
const chatService = require("../../service/chat.service");

function ChatHandler(socket, io) {
  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("message", async ({ roomId, message, messageToId }) => {
    try {
      if (!message.content && !message.picture) {
        return ApiError.BadRequest("Сообщение не может быть пустым");
      }
      const messageCreator = await userModel.findById(message.creatorId);

      if (!messageCreator) {
        return ApiError.NotFound(ERROR.userNotFound);
      }

      const messageCreatorDto = new UserDto(messageCreator);

      io.to(roomId).emit("newMessage", {
        messageCreator: messageCreatorDto,
        createdAt: message.createdAt,
        content: message.content,
        picture: message.picture,
      });

      return chatService.sendMessage(
        roomId,
        messageCreatorDto,
        message,
        messageToId,
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
  });
}

module.exports = ChatHandler;
