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
const chatModel = require("./models/chat-model.js");
const messageModel = require("./models/message-model.js");
const ApiError = require("./exceptions/api-error.js");
const userModel = require("./models/user-model.js");
const UserDto = require("./dtos/user-dto.js");

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 80;

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
   console.log("Client connected");
   socket.on("join", (roomId) => {
      console.log(`join on ${roomId}`);
      socket.join(roomId);
   });

   socket.on(
      "message",
      async ({
         roomId,
         message = {
            creatorId: null,
            createdAt: null,
            content: null,
            picture: null,
         },
         messageToId,
      }) => {
         try {
            console.log(`message on ${roomId}`);
            if (!message.content && !message.picture) {
               return ApiError.BadRequest("Сообщение не может быть пыстым");
            }
            const messageCreator = await userModel.findById(message.creatorId);
            const messageCreatorDto = new UserDto(messageCreator);

            if (!messageCreator) {
               return ApiError.NotFound("Такой пользователь не найден");
            }

            io.to(roomId).emit("newMessage", {
               messageCreator: messageCreatorDto,
               createdAt: message.createdAt,
               content: message.content,
               picture: message.picture,
            });

            const newMessage = await messageModel.create({
               messageCreator: messageCreatorDto,
               createdAt: message.createdAt,
               content: message.content,
               picture: message.picture,
            });

            await chatModel.findOneAndUpdate(
               { roomId: roomId },
               { $addToSet: { messages: newMessage } },
               { upsert: true },
            );

            const messageToUser = await userModel.findById(messageToId);
            const messageToUserDto = new UserDto(messageToUser);

            const existingRecentChatUser = await userModel.findOne({
               _id: message.creatorId,
               "recentChatUsers.user": messageToUserDto._id,
            });

            if (existingRecentChatUser) {
               await userModel.updateOne(
                  {
                     _id: message.creatorId,
                     "recentChatUsers.user": messageToUserDto._id,
                  },
                  {
                     $set: {
                        "recentChatUsers.$.lastMessage": newMessage,
                     },
                  },
                  { new: true },
               );
            } else {
               await userModel.findByIdAndUpdate(
                  message.creatorId,
                  {
                     $addToSet: {
                        recentChatUsers: {
                           user: messageToUserDto,
                           lastMessage: newMessage,
                        },
                     },
                  },
                  { upsert: true, new: true },
               );
            }

            const existingRecentChatUserMessageTo = await userModel.findOne({
               _id: messageToId,
               "recentChatUsers.user": messageCreatorDto,
            });

            if (existingRecentChatUserMessageTo) {
               await userModel.updateOne(
                  {
                     _id: messageToId,
                     "recentChatUsers.user": messageCreatorDto,
                  },
                  {
                     $set: {
                        "recentChatUsers.$.lastMessage": newMessage,
                     },
                  },
               );
            } else {
               await userModel.findByIdAndUpdate(
                  messageToId,
                  {
                     $addToSet: {
                        recentChatUsers: {
                           user: messageCreatorDto,
                           lastMessage: newMessage,
                        },
                     },
                  },
                  { upsert: true, new: true },
               );
            }
         } catch (e) {
            console.log(e);
         }
      },
   );

   socket.on("leave", (roomId) => {
      socket.leave(roomId);
      console.log(`leave from ${roomId}`);
   });

   clients[socket.id] = socket;

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
      app.listen(PORT, () => console.log(`server started on ${PORT}`));
      server.listen(SOCKET_PORT, () =>
         console.log(`socket started on ${SOCKET_PORT}`),
      );
   } catch (e) {
      console.log(e);
   }
};

start();
