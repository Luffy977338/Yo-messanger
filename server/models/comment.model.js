const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    message: { type: String },
    pictures: [{ type: String }],
  },
  { timestamps: true },
);

module.exports = model("Comment", CommentSchema);
