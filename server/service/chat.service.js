const chatModel = require("../models/chat.model.js");
const messageModel = require("../models/message.model.js");
const userModel = require("../models/user.model.js");
const UserDto = require("../dtos/user.dto.js");

class ChatService {
  async getChat(roomId, perPage, page) {
    const chat = await chatModel.findOne({ roomId }).populate({
      path: "messages",
      populate: {
        path: "messageCreator",
        select: "username avatar",
      },
      options: {
        skip: perPage * page,
        limit: perPage,
        sort: { createdAt: -1 },
      },
    });

    if (chat?.messages && chat.messages.length) {
      chat.messages = chat.messages.reverse();
    }
    let totalPages = 0;

    if (roomId.split("_").length === 2) {
      const totalCount = await chatModel.findOne({ roomId });
      totalPages = totalCount.messages.length
        ? Math.ceil(totalCount.messages.length / perPage)
        : 0;
    }

    return {
      chat,
      pagination: {
        currentPage: Number(page),
        totalPages,
      },
    };
  }

  async sendMessage(roomId, messageCreatorDto, message, messageToId) {
    const newMessage = await messageModel.create({
      messageCreator: messageCreatorDto,
      createdAt: message.createdAt,
      content: message.content,
      picture: message.picture,
    });

    await chatModel.findOneAndUpdate(
      { roomId: roomId },
      { $addToSet: { messages: newMessage } },
      { upsert: true },
    );

    const messageToUser = await userModel.findById(messageToId);
    const messageToUserDto = new UserDto(messageToUser);

    const existingRecentChatUser = await userModel.findOne({
      _id: message.creatorId,
      "recentChatUsers.user": messageToUserDto._id,
    });

    if (existingRecentChatUser) {
      await userModel.updateOne(
        {
          _id: message.creatorId,
          "recentChatUsers.user": messageToUserDto._id,
        },
        {
          $set: {
            "recentChatUsers.$.lastMessage": newMessage,
          },
        },
        { new: true },
      );
    } else {
      await userModel.findByIdAndUpdate(
        message.creatorId,
        {
          $addToSet: {
            recentChatUsers: {
              user: messageToUserDto,
              lastMessage: newMessage,
            },
          },
        },
        { upsert: true, new: true },
      );
    }

    const existingRecentChatUserMessageTo = await userModel.findOne({
      _id: messageToId,
      "recentChatUsers.user": messageCreatorDto,
    });

    if (existingRecentChatUserMessageTo) {
      await userModel.updateOne(
        {
          _id: messageToId,
          "recentChatUsers.user": messageCreatorDto,
        },
        {
          $set: {
            "recentChatUsers.$.lastMessage": newMessage,
          },
        },
      );
    } else {
      await userModel.findByIdAndUpdate(
        messageToId,
        {
          $addToSet: {
            recentChatUsers: {
              user: messageCreatorDto,
              lastMessage: newMessage,
            },
          },
        },
        { upsert: true, new: true },
      );
    }
  }
}

module.exports = new ChatService();
