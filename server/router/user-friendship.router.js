const userFriendshipController = require("../controllers/user-friendship.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const Router = require("express").Router;

const router = new Router();

router.post(
  "/subscribe/:id",
  authMiddleware,
  userFriendshipController.subscribe,
);
router.post(
  "/unsubscribe/:id",
  authMiddleware,
  userFriendshipController.unsubscribe,
);
router.post(
  "/acceptFriend/:id",
  authMiddleware,
  userFriendshipController.acceptFriend,
);
router.post(
  "/rejectFriend/:id",
  authMiddleware,
  userFriendshipController.rejectFriend,
);
router.post(
  "/deleteFriend/:id",
  authMiddleware,
  userFriendshipController.deleteFriend,
);

module.exports = router;
