const { Schema, model } = require("mongoose");

const notificationTypes = ["like", "comment", "friend"];

const NotificationShema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  notificationType: { type: String, required: true, enum: notificationTypes },
});

module.exports = model("Notification", NotificationShema);
