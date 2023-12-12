const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
   avatar: { type: String },
   username: { type: String, unique: true, required: true },
   description: { type: String },
   email: { type: String, unique: true, required: true },
   password: { type: String, required: true },
   isActivated: { type: Boolean, default: false },
   activationLink: { type: String },
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
});

module.exports = model("User", UserSchema);
