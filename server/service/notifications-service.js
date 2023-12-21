const { ERROR } = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const notificationModel = require("../models/notification-model");
const userModel = require("../models/user-model");

class NotificationService {
  async newNotification(creatorId, type) {
    const user = await userModel.findById(creatorId);

    if (!user) {
      ApiError.NotFound(ERROR.userNotFound);
    }

    const notification = await notificationModel.create({
      user,
      type,
    });

    return notification;
  }
}

module.exports = new NotificationService();
