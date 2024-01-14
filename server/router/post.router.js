const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const Router = require("express").Router;

const router = new Router();

router.get("/", postController.getAllPosts);
router.get("/:postId", authMiddleware, postController.getOnePost);
router.get("/user/:userId", authMiddleware, postController.getAllUserPosts);
router.post("/", authMiddleware, postController.createPost);
router.delete("/:postId", authMiddleware, postController.deletePost);
router.post("/like/:postId", authMiddleware, postController.likePost);
router.delete(
  "/removeLike/:postId",
  authMiddleware,
  postController.removeLikePost,
);

module.exports = router;
