const chatModel = require("../models/chat-model");

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

      const totalCount = await chatModel.findOne({ roomId });
      const totalPages = Math.ceil(
         totalCount.messages ? totalCount.messages.length / perPage : 0,
      );

      return {
         chat,
         pagination: {
            currentPage: Number(page),
            totalPages,
         },
      };
   }
}

module.exports = new ChatService();
