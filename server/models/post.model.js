const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    userCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    pictures: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

module.exports = model("Post", PostSchema);
