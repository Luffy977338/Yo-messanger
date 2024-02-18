const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const Router = require("express").Router;

const router = new Router();

router.get("/:postId", authMiddleware, commentController.getComments);
router.post("/:postId", authMiddleware, commentController.comment);
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;
