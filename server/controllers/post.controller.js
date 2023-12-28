const postService = require("../service/post.service");

class PostController {
  async getAllPosts(req, res, next) {
    try {
      const page = req.query.page || 0;
      const perPage = 12;
      const posts = await postService.getAllPosts(page, perPage);
      return res.json(posts);
    } catch (e) {
      next(e);
    }
  }

  async getOnePost(req, res, next) {
    try {
      const postId = req.params.postId;
      const post = await postService.getOnePost(postId);

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async createPost(req, res, next) {
    try {
      const userId = req.params.userId;
      const content = req.body.content;
      const files = req.files ? req.files.picture : null;
      const post = await postService.createPost(userId, content, files);
      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async deletePost(req, res, next) {
    try {
      const userId = req.params.userId;
      const postId = req.params.postId;
      const { fileName } = req.body;
      const post = await postService.deletePost(userId, postId, fileName);

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async likePost(req, res, next) {
    try {
      const userId = req.params.userId;
      const postId = req.params.postId;

      const post = await postService.likePost(postId, userId);

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }

  async removeLikePost(req, res, next) {
    try {
      const userId = req.params.userId;
      const postId = req.params.postId;

      const post = await postService.removeLikePost(postId, userId);

      return res.json(post);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PostController();
