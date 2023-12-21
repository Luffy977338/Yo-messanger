const { Schema, model } = require("mongoose");

const ChatSchema = new Schema({
  roomId: { type: String, required: true, unique: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = model("Chat", ChatSchema);
