const userActionsService = require("../service/user-actions.service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const notificationService = require("../service/notification.service");

class UserActionsController {
  async editProfile(req, res, next) {
    try {
      const validationErrors = validationResult(req);
      const errors = validationErrors.array();
      console.log(errors);
      if (!validationErrors.isEmpty()) {
        return next(
          ApiError.BadRequest(errors[0].msg || "Введены неккоректные данные"),
        );
      }

      const id = req.params.id;
      const { username, description, prevAvatar } = req.body;
      const avatar = req.files ? req.files.avatar : null;

      const newData = await userActionsService.editProfile(
        id,
        username,
        description,
        avatar,
        prevAvatar,
      );

      return res.json(newData);
    } catch (e) {
      next(e);
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await userActionsService.getOneUser(id);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async makeNotificationViewed(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationService.makeNotificationViewed(id);

      return res.json(notification);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserActionsController();
