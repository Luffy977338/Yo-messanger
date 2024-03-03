const ERROR = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

class CommentService {
  async getComments(postId, page, perPage) {
    if (!postId) throw ApiError.BadRequest(ERROR.expectedId);

    const agPost = await postModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $unwind: "$comments",
      },
      {
        $lookup: {
          from: "posts",
          localField: "comments.post",
          foreignField: "_id",
          as: "comments.post",
        },
      },
      {
        $addFields: {
          "comments.post": { $arrayElemAt: ["$comments.post", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.user",
          foreignField: "_id",
          as: "comments.user",
        },
      },
      {
        $addFields: {
          "comments.user": { $arrayElemAt: ["$comments.user", 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.post.userCreator",
          foreignField: "_id",
          as: "comments.post.userCreator",
        },
      },
      {
        $addFields: {
          "comments.post.userCreator": {
            $arrayElemAt: ["$comments.post.userCreator", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.likes",
          foreignField: "_id",
          as: "comments.likes",
        },
      },
      {
        $match: {
          "comments.reply": null,
        },
      },
      {
        $group: {
          _id: "$_id",
          comments: { $push: "$comments" },
          totalComments: { $sum: 1 },
          totalReplies: {
            $sum: {
              $sum: {
                $map: {
                  input: "$comments.replies",
                  as: "reply",
                  in: { $size: { $ifNull: ["$$reply.replies", []] } },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          comments: {
            $slice: ["$comments", page * perPage, perPage],
          },
        },
      },
    ]);

    if (!agPost) throw ApiError.NotFound(ERROR.postNotFound);

    const comments = agPost[0]?.comments;

    // sort comments by popularity
    comments?.sort((a, b) => (a.likes.length > b.likes.length ? -1 : 1));

    return comments;
  }

  async getCommentReplies(commentId, page, perPage) {
    if (!commentId) throw ApiError.BadRequest(ERROR.expectedId);

    const comment = await commentModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(commentId) },
      },
      {
        $facet: {
          totalCount: [
            {
              $lookup: {
                from: "comments",
                localField: "replies",
                foreignField: "_id",
                as: "replies",
              },
            },
            {
              $unwind: "$replies",
            },
            {
              $lookup: {
                from: "posts",
                localField: "replies.post",
                foreignField: "_id",
                as: "replies.post",
              },
            },
            {
              $addFields: {
                "replies.post": { $arrayElemAt: ["$replies.post", 0] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "replies.user",
                foreignField: "_id",
                as: "replies.user",
              },
            },
            {
              $addFields: {
                "replies.user": { $arrayElemAt: ["$replies.user", 0] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "replies.likes",
                foreignField: "_id",
                as: "replies.likes",
              },
            },
            {
              $addFields: {
                likes_count: { $size: { $ifNull: ["$replies.likes", []] } },
              },
            },
            {
              $sort: {
                likes_count: -1,
              },
            },
            {
              $group: {
                _id: "$_id",
                replies: { $push: "$replies" },
              },
            },
            {
              $addFields: {
                _count: { $size: { $ifNull: ["$replies", []] } },
              },
            },
          ],
          paginatedData: [
            {
              $lookup: {
                from: "comments",
                localField: "replies",
                foreignField: "_id",
                as: "replies",
              },
            },
            {
              $unwind: "$replies",
            },
            {
              $lookup: {
                from: "posts",
                localField: "replies.post",
                foreignField: "_id",
                as: "replies.post",
              },
            },
            {
              $addFields: {
                "replies.post": { $arrayElemAt: ["$replies.post", 0] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "replies.user",
                foreignField: "_id",
                as: "replies.user",
              },
            },
            {
              $addFields: {
                "replies.user": { $arrayElemAt: ["$replies.user", 0] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "replies.likes",
                foreignField: "_id",
                as: "replies.likes",
              },
            },
            {
              $skip: page * perPage,
            },
            {
              $limit: perPage,
            },
            {
              $group: {
                _id: "$_id",
                replies: { $push: "$replies" },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount._count", 0] },
          paginatedData: 1,
        },
      },
    ]);

    if (!comment[0]) throw ApiError.NotFound(ERROR.commentNotFound);

    const replies = comment[0]?.paginatedData[0]?.replies || [];
    const totalCount = comment[0]?.totalCount || 0;

    const totalPages = Math.ceil(
      totalCount <= perPage ? 0 : totalCount / perPage - 1,
    );

    return {
      replies: replies,
      pagination: {
        currentPage: Number(page),
        totalPages,
      },
    };
  }

  async deleteComment(userId, commentId) {
    if (!userId) throw ApiError.BadRequest(ERROR.expectedId);
    if (!commentId) throw ApiError.BadRequest(ERROR.expectedId);

    const comment = await commentModel
      .findById(commentId)
      .populate({ path: "post" })
      .populate("user");

    if (!comment) throw ApiError.NotFound(ERROR.commentNotFound);

    const canBeDeleted =
      String(userId) === String(comment.user._id) ||
      String(userId) === String(comment.post.userCreator);

    if (canBeDeleted) {
      await commentModel.findOneAndUpdate(
        { replies: commentId },
        { $pull: { replies: commentId } },
      );
      await postModel.findByIdAndUpdate(comment.post._id, {
        $pull: { comments: { _id: commentId } },
      });
      return await commentModel
        .findByIdAndDelete(commentId)
        .populate({ path: "post", populate: "comments" });
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
      reply: null,
    });

    post.comments.push(comment);
    await post.save();

    return (await comment.populate("user post likes replies")).populate({
      path: "post",
      populate: "userCreator",
    });
  }

  async likeComment(userId, commentId) {
    if (!userId || !commentId) throw ApiError.BadRequest(ERROR.expectedId);

    const user = await userModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const comment = await commentModel.findByIdAndUpdate(commentId, {
      $addToSet: { likes: userId },
    });

    return comment;
  }

  async removeLikeComment(userId, commentId) {
    if (!userId || !commentId) throw ApiError.BadRequest(ERROR.expectedId);

    const user = await userModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const comment = await commentModel.findByIdAndUpdate(commentId, {
      $pull: { likes: userId },
    });

    return comment;
  }

  async replyComment(userId, commentId, { message, pictures }) {
    if (!userId) throw ApiError.BadRequest(ERROR.expectedId);
    if (!message && !pictures)
      throw ApiError.BadRequest(ERROR.commentCannotBeEmpty);

    pictures ? (pictures = new Map(Object.entries(files))) : (pictures = null);

    const comment = await commentModel.findById(commentId);

    if (!comment) throw ApiError.NotFound(ERROR.postNotFound);

    const user = await userModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const newComment = await commentModel.create({
      message,
      pictures,
      post: comment.post._id,
      user: userId,
      reply: commentId,
    });

    comment.replies.push(newComment);
    await comment.save();

    return (await comment.populate("user post likes replies")).populate({
      path: "post",
      populate: "userCreator",
    });
  }
}

module.exports = new CommentService();
