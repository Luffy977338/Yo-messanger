require("dotenv").config();
const socketIo = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const postsRouter = require("./router/posts-router.js");
const userAuthRouter = require("./router/user-auth-router.js");
const errorMiddleware = require("./middlewares/error-middleware.js");
const userFriendshipRouter = require("./router/user-friendship-router.js");
const userActionsRouter = require("./router/user-actions-router.js");
const chatRouter = require("./router/chat-router.js");
const ApiError = require("./exceptions/api-error.js");
const userModel = require("./models/user-model.js");
const UserDto = require("./dtos/user-dto.js");
const { ERROR } = require("./constants/ERROR.js");
const chatService = require("./service/chat-service.js");
const notificationsService = require("./service/notifications-service.js");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static("images"));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use("/auth", userAuthRouter);
app.use("/posts", postsRouter);
app.use(userFriendshipRouter);
app.use(userActionsRouter);
app.use("/chat", chatRouter);
app.use(errorMiddleware);

const clients = {};

io.on("connection", (socket) => {
  // console.log("Client connected");
  socket.on("join", (roomId) => {
    // console.log(`join on ${roomId}`);
    socket.join(roomId);
  });

  socket.on("message", async ({ roomId, message, messageToId }) => {
    try {
      if (!message.content && !message.picture) {
        return ApiError.BadRequest("Сообщение не может быть пыстым");
      }
      const messageCreator = await userModel.findById(message.creatorId);
      const messageCreatorDto = new UserDto(messageCreator);

      if (!messageCreator) {
        return ApiError.NotFound(ERROR.userNotFound);
      }

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
    console.log(`leave from ${roomId}`);
  });

  clients[socket.id] = socket;

  socket.on("comment", async (commentedUserId, userId) => {
    if (clients[commentedUserId]) {
      clients[commentedUserId].emit("newNotification", {
        userId,
        type: "comment",
      });
    }

    return notificationsService.newNotification(userId, "comment");
  });

  socket.on("like", async (likedUserId, userId) => {
    if (clients[likedUserId]) {
      clients[likedUserId].emit("newNotification", { userId, type: "like" });
    }

    return notificationsService.newNotification(userId, "like");
  });

  socket.on("friendReq", async (potentialFriendUserId, userId) => {
    if (clients[potentialFriendUserId]) {
      clients[potentialFriendUserId].emit("newNotification", {
        userId,
        type: "friend",
      });
    }

    return notificationsService.newNotification(userId, "friend");
  });

  io.on("disconnect", () => {
    console.log("Client disconnected");
    delete clients[socket.id];
  });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server.listen(PORT, () => console.log(`socket started on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
