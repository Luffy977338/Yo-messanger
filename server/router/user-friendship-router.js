const userFriendshipController = require("../controllers/user-friendship-controller.js");
const authMiddleware = require("../middlewares/auth-middleware.js");
const Router = require("express").Router;

const router = new Router();

router.post(
  "/subscribe/:id/:subscriberId",
  authMiddleware,
  userFriendshipController.subscribe,
);
router.post(
  "/unsubscribe/:id/:subscriberId",
  authMiddleware,
  userFriendshipController.unsubscribe,
);
router.post(
  "/acceptFriend/:id/:subscriberId",
  authMiddleware,
  userFriendshipController.acceptFriend,
);
router.post(
  "/rejectFriend/:id/:subscriberId",
  authMiddleware,
  userFriendshipController.rejectFriend,
);
router.post(
  "/deleteFriend/:id/:subscriberId",
  authMiddleware,
  userFriendshipController.deleteFriend,
);

module.exports = router;
