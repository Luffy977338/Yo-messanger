const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
   messageCreator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   content: { type: String },
   picture: { type: String },
   createdAt: { type: Date },
   likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = model("Message", MessageSchema);
