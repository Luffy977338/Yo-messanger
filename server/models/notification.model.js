const { Schema, model } = require("mongoose");

const notificationTypes = ["like", "comment", "friendReq"];

const NotificationShema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: notificationTypes },
    isViewed: { type: Boolean, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true },
);

module.exports = model("Notification", NotificationShema);
