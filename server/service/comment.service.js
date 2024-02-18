const ERROR = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const userModel = require("../models/user.model");

class CommentService {
  async getComments(postId) {
    if (!postId) throw ApiError.BadRequest(ERROR.expectedId);

    const post = await postModel.findById(postId).populate({
      path: "comments",
      populate: [
        {
          path: "post",
          populate: { path: "userCreator" },
        },
        {
          path: "user",
        },
      ],
    });

    if (!post) throw ApiError.NotFound(ERROR.postNotFound);

    const comments = post.comments;

    return comments;
  }

  async deleteComment(userId, commentId) {
    if (!userId) throw ApiError.BadRequest(ERROR.expectedId);
    if (!commentId) throw ApiError.BadRequest(ERROR.expectedId);

    const comment = await commentModel
      .findById(commentId)
      .populate("post user");

    if (!comment) throw ApiError.NotFound(ERROR.commentNotFound);

    const canBeDeleted =
      String(userId) === String(comment.user._id) ||
      String(userId) === String(comment.post.userCreator);

    if (canBeDeleted) {
      await postModel.findByIdAndUpdate(comment.post._id, {
        $pull: { comments: commentId },
      });
      return await commentModel.findByIdAndDelete(commentId);
    }

    return comment;
  }

  async comment(userId, postId, { message, pictures }) {
    if (!userId) throw ApiError.BadRequest(ERROR.expectedId);
    if (!postId) throw ApiError.BadRequest(ERROR.expectedId);
    if (!message && !pictures)
      throw ApiError.BadRequest(ERROR.commentCannotBeEmpty);

    pictures ? (pictures = new Map(Object.entries(files))) : (pictures = null);

    const post = await postModel.findById(postId);

    if (!post) throw ApiError.NotFound(ERROR.postNotFound);

    const user = await userModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const comment = await commentModel.create({
      message,
      pictures,
      post: postId,
      user: userId,
    });

    post.comments.push(comment);
    await post.save();

    return (await comment.populate("user post likes")).populate({
      path: "post",
      populate: "userCreator",
    });
  }
}

module.exports = new CommentService();
