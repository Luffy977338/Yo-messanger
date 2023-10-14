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
const setupChatSocket = require("./sockets/chatSocket.js");

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 80;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
   cors: {
      origin: "*",
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
app.use(errorMiddleware);

setupChatSocket(io);

const start = async () => {
   try {
      await mongoose.connect(process.env.DB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      server.listen(SOCKET_PORT, () =>
         console.log(`socket started on ${SOCKET_PORT}`),
      );
      app.listen(PORT, () => console.log(`server started on ${PORT}`));
   } catch (e) {
      console.log(e);
   }
};

start();
