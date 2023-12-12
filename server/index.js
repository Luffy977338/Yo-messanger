require("dotenv").config();
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

const PORT = process.env.PORT || 5000;

const app = express();

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

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`server started on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
