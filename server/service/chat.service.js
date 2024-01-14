const chatModel = require("../models/chat.model.js");
const messageModel = require("../models/message.model.js");
const UserModel = require("../models/user.model.js");
const UserDto = require("../dtos/user.dto.js");
const ApiError = require("../exceptions/api-error.js");
const ERROR = require("../constants/ERROR.js");

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

    if (!(roomId.split("_").length === 2))
      throw ApiError.BadRequest(ERROR.roomIdMustHaveTwoIds);

    const totalCount = await chatModel.findOne({ roomId });
    totalPages =
      totalCount && totalCount.messages.length
        ? Math.ceil(totalCount.messages.length / perPage)
        : 0;

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
      { roomId },
      { $addToSet: { messages: newMessage } },
      { upsert: true },
    );

    const messageToUser = await UserModel.findById(messageToId);
    const messageToUserDto = new UserDto(messageToUser);

    const existingRecentChatUser = await UserModel.findOne({
      _id: message.creatorId,
      "recentChatUsers.user": messageToUserDto._id,
    });

    if (existingRecentChatUser) {
      await UserModel.updateOne(
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
      await UserModel.findByIdAndUpdate(
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

    const existingRecentChatUserMessageTo = await UserModel.findOne({
      _id: messageToId,
      "recentChatUsers.user": messageCreatorDto,
    });

    if (existingRecentChatUserMessageTo) {
      await UserModel.updateOne(
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
      await UserModel.findByIdAndUpdate(
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
