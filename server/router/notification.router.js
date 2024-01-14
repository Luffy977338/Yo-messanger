const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const Router = require("express").Router;

const router = new Router();

router.patch(
  "/:id",
  authMiddleware,
  notificationController.makeNotificationViewed,
);
router.get("/", authMiddleware, notificationController.getNotifications);

module.exports = router;
