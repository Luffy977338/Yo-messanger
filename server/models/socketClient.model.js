const { Schema, model } = require("mongoose");

const SocketClientSchema = new Schema({
  socketId: { type: String, required: true },
});

module.exports = model("Client", SocketClientSchema);
