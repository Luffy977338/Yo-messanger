const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  message: { type: String },
  pictures: [{ type: String }],
});

module.exports = model("Chat", CommentSchema);
