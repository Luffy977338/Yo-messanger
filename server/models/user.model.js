const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  avatar: { type: String, required: true },
  username: { type: String, required: true },
  description: { type: String, default: "" },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String, default: "" },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  subscriptions: [{ type: Schema.Types.ObjectId, ref: "User" }],
  subscribers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  recentChatUsers: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    },
  ],
  notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  socketId: { type: String },
  settings: { type: Schema.Types.ObjectId, ref: "Settings", required: true },
});

module.exports = model("User", UserSchema);
