require("dotenv").config();
const socketIo = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const postRouter = require("./router/post.router.js");
const userAuthRouter = require("./router/user-auth.router.js");
const errorMiddleware = require("./middlewares/error.middleware.js");
const userFriendshipRouter = require("./router/user-friendship.router.js");
const userRouter = require("./router/user.router.js");
const chatRouter = require("./router/chat.router.js");
const WebsocketSetUp = require("./socket/connection.socket.js");
const settingRouter = require("./router/settings.router.js");
const notificationRouter = require("./router/notification.router.js");
const commentRouter = require("./router/comment.router.js");
const helmet = require("helmet");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
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
app.use("/posts", postRouter);
app.use("/post/comments", commentRouter);
app.use("/notifications", notificationRouter);
app.use("/chat", chatRouter);
app.use("/settings", settingRouter);
app.use(userFriendshipRouter);
app.use(userRouter);
app.use(errorMiddleware);

WebsocketSetUp(io);

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
