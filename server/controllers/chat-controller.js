const chatService = require("../service/chat-service");

class ChatController {
  async getChat(req, res, next) {
    try {
      const roomId = req.params.roomId;
      const perPage = 16;
      const page = req.query.page || 0;
      const chat = await chatService.getChat(roomId, perPage, page);
      return res.json(chat);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ChatController();
