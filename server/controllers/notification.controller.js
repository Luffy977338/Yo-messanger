const notificationService = require("../service/notification.service");

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const id = req.user._id;
      const notifications = await notificationService.getNotifications(id);

      return res.json(notifications);
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

module.exports = new NotificationController();
