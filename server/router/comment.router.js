const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const Router = require("express").Router;

const router = new Router();

router.get("/:postId", authMiddleware, commentController.getComments);
router.get("/replies/:commentId", commentController.getCommentReplies);
router.post("/:postId", authMiddleware, commentController.comment);
router.post(
  "/reply/:commentId",
  authMiddleware,
  commentController.replyComment,
);
router.post("/like/:commentId", authMiddleware, commentController.likeComment);
router.delete(
  "/like/:commentId",
  authMiddleware,
  commentController.removeLikeComment,
);
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;
