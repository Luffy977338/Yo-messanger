const commentService = require("../service/comment.service");

class CommentController {
  async getComments(req, res, next) {
    try {
      const { postId } = req.params;

      const comments = await commentService.getComments(postId);

      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await commentService.deleteComment(userId, commentId);

      return res.json(comment);
    } catch (e) {
      next(e);
    }
  }

  async comment(req, res, next) {
    try {
      const { postId } = req.params;
      const { message } = req.body;
      const pictures = req.files;
      const userId = req.user._id;

      const comment = await commentService.comment(userId, postId, {
        message,
        pictures,
      });

      return res.json(comment);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CommentController();
