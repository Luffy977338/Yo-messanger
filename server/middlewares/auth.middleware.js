const ApiError = require("../exceptions/api-error.js");
const tokenService = require("../service/token.service.js");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(
        ApiError.UnauthorizedError("В headers нет поля authorization"),
      );
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError("Нет access токена"));
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError("Access токен не валиден"));
    }
    if (!userData.isActivated) {
      res.clearCookie("refreshToken");
      return next(ApiError.UnauthorizedError("MailNotActivate"));
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError("Пользователь не авторизован"));
  }
};
