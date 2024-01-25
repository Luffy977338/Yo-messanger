const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const notificationService = require("../service/notification.service");
const userService = require("../service/user.service");
const tokenService = require("../service/token.service");
const ERROR = require("../constants/ERROR");

class UserController {
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

      const { id } = req.params;
      const { username, description, prevAvatar } = req.body;
      const avatar = req.files ? req.files.avatar : null;

      const newData = await userService.editProfile(
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

  async getUser(req, res, next) {
    try {
      const id = req.params.id;
      const reqUser = tokenService.validateAccessToken(
        req.headers.authorization?.split(" ")[1],
      );
      const { user } = await userService.getUserById(id, reqUser);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
