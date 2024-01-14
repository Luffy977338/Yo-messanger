const userFriendshipService = require("../service/user-friendship.service");

class UserFriendshipController {
  async subscribe(req, res, next) {
    try {
      const id = req.params.id;
      const subscriberId = req.user._id;
      const action = await userFriendshipService.subscribe(id, subscriberId);
      return res.json(action);
    } catch (e) {
      next(e);
    }
  }

  async unsubscribe(req, res, next) {
    try {
      const id = req.params.id;
      const subscriberId = req.user._id;
      const action = await userFriendshipService.unsubscribe(id, subscriberId);
      return res.json(action);
    } catch (e) {
      next(e);
    }
  }

  async acceptFriend(req, res, next) {
    try {
      const id = req.params.id;
      const subscriberId = req.user._id;
      const action = await userFriendshipService.acceptFriend(id, subscriberId);
      return res.json(action);
    } catch (e) {
      next(e);
    }
  }

  async rejectFriend(req, res, next) {
    try {
      const id = req.params.id;
      const subscriberId = req.user._id;
      const action = await userFriendshipService.rejectFriend(id, subscriberId);
      return res.json(action);
    } catch (e) {
      next(e);
    }
  }

  async deleteFriend(req, res, next) {
    try {
      const id = req.params.id;
      const subscriberId = req.user._id;
      const action = await userFriendshipService.deleteFriend(id, subscriberId);
      return res.json(action);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserFriendshipController();
