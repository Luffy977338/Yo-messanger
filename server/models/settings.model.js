const { Schema, model } = require("mongoose");

const SettingsSchema = new Schema({
  myPage: {
    profileType: {
      type: String,
      enum: ["open", "close"],
      default: "open",
    },
    whoCanComment: {
      type: String,
      enum: ["everyone", "meOnly", "friendsOnly"],
      default: "everyone",
    },
  },
});

module.exports = model("Settings", SettingsSchema);
