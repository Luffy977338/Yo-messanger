const postController = require("../controllers/post-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const Router = require("express").Router;

const router = new Router();

router.get("/", authMiddleware, postController.getAllPosts);
router.get("/:postId", authMiddleware, postController.getOnePost);
router.post("/:userId", authMiddleware, postController.createPost);
router.delete("/:userId/:postId", authMiddleware, postController.deletePost);

module.exports = router;
