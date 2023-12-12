const chatController = require("../controllers/chat-controller");

const Router = require("express").Router;

const router = new Router();

router.get("/:roomId", chatController.getChat);

module.exports = router;
