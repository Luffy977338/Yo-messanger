const ERROR = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const userModel = require("../models/user.model");

class CommentService {
  async commentPost(userId, postId, { message, pictures }) {
    if (!userId) throw ApiError.BadRequest(ERROR.expectedId);
    if (!postId) throw ApiError.BadRequest(ERROR.expectedId);
    if (!message && !pictures.length)
      throw ApiError.BadRequest(ERROR.requiredField);

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

    post.comments.unshift(comment);
    await post.save();

    return post.populate({
      path: "comments",
      populate: { path: "user post likes" },
    });
  }
}

module.exports = new CommentService();
