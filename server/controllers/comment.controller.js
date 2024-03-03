const commentService = require("../service/comment.service");

class CommentController {
  async getComments(req, res, next) {
    try {
      const { postId } = req.params;
      const page = 0;
      const perPage = 6;
      const comments = await commentService.getComments(postId, page, perPage);

      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }

  async getCommentReplies(req, res, next) {
    try {
      const { commentId } = req.params;
      const page = req.query.page || 0;
      const perPage = 5;

      const replies = await commentService.getCommentReplies(
        commentId,
        page,
        perPage,
      );

      return res.json(replies);
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

  async likeComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { user } = req;

      const comment = await commentService.likeComment(user._id, commentId);

      return res.json(comment);
    } catch (e) {
      next(e);
    }
  }

  async removeLikeComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { user } = req;

      const comment = await commentService.removeLikeComment(
        user._id,
        commentId,
      );

      return res.json(comment);
    } catch (e) {
      next(e);
    }
  }

  async replyComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { message } = req.body;
      const pictures = req.files;
      const userId = req.user._id;

      const comment = await commentService.replyComment(userId, commentId, {
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
