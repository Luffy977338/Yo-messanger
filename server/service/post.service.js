const ERROR = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const postModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const fileService = require("./file.service");
const path = require("path");
const notificationService = require("./notification.service");
const isPictureExtensionOk = require("../constants/acceptedPictureExtensions");
const userService = require("./user.service");
const mongoose = require("mongoose");

class PostService {
  async getAllPosts(page, perPage, reqUser) {
    //! handles user access to see closed profile posts and return posts
    const posts = await postModel.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userCreator",
          foreignField: "_id",
          as: "userCreator",
        },
      },
      {
        $unwind: "$userCreator",
      },
      {
        $lookup: {
          from: "settings",
          localField: "userCreator.settings",
          foreignField: "_id",
          as: "userSettings",
        },
      },
      {
        $unwind: {
          path: "$userSettings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { "userSettings.myPage.profileType": { $ne: "close" } },
            reqUser && reqUser._id
              ? {
                  $or: [
                    {
                      "userCreator.friends": {
                        $in: [new mongoose.Types.ObjectId(reqUser._id)],
                      },
                    },
                    {
                      "userCreator._id": new mongoose.Types.ObjectId(
                        reqUser._id,
                      ),
                    },
                  ],
                }
              : {},
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: perPage * page,
      },
      {
        $limit: perPage,
      },
    ]);

    posts.forEach((post) => {
      post.comments = post.comments.filter((comment) => comment.reply === null);
    });

    const totalCount = await postModel.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    return {
      posts,
      pagination: {
        currentPage: Number(page),
        totalPages,
      },
    };
  }

  async getAllUserPosts(reqUser, userId, page, perPage) {
    const user = await UserModel.findById(userId)
      .populate("settings")
      .populate({
        path: "posts",
        populate: [
          {
            path: "userCreator",
            populate: [{ path: "settings" }, { path: "friends" }],
          },
          {
            path: "comments",
          },
        ],
        options: {
          skip: perPage * page,
          limit: perPage,
          sort: { createdAt: -1 },
        },
      });

    const { userDto } = await userService.generateUserDtos(user, reqUser);

    if (!userDto.posts)
      return {
        closedProfile: true,
      };

    const totalCount = userDto.posts.length;
    const totalPages = Math.ceil(totalCount / perPage);

    return {
      posts: userDto.posts,
      pagination: {
        currentPage: Number(page),
        totalPages,
      },
    };
  }

  async getOnePost(postId) {
    if (!postId) throw ApiError.BadRequest(ERROR.expectedId);

    const post = await postModel
      .findById(postId)
      .populate("likes")
      .populate({ path: "userCreator", populate: [{ path: "settings" }] });

    if (!post) throw ApiError.NotFound(ERROR.postNotFound);

    return post;
  }

  async createPost(userId, content, files) {
    if (!content && !files) throw ApiError.BadRequest(ERROR.postCannotBeEmpty);
    if (!userId) throw ApiError.BadRequest(ERROR.expectedId);

    let pictures;
    files ? (pictures = new Map(Object.entries(files))) : null;

    const updatedFields = {
      userCreator: userId,
      content,
      pictures: [],
    };

    if (pictures) {
      if (pictures.size >= 9) throw ApiError.BadRequest(ERROR.toManyPhotos);
      for (const picture of pictures.values()) {
        const pictureExtension = path.extname(picture.name);

        if (!isPictureExtensionOk.includes(pictureExtension)) {
          throw ApiError.BadRequest(ERROR.extensionNotValid);
        }

        const pictureFile = fileService.saveFile(picture);
        updatedFields.pictures.push(pictureFile);
      }
    }

    const post = await postModel.create(updatedFields);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          posts: {
            $each: [post],
            $position: 0,
          },
        },
      },
      { new: true },
    );

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    return post;
  }

  async deletePost(userId, postId) {
    const postCandidate = await postModel.findById(postId);

    if (String(postCandidate.userCreator) !== String(userId))
      throw ApiError.BadRequest(ERROR.postCannotBeDeletedNotUserCreator);

    const post = await postModel.findByIdAndDelete(postId);

    await notificationService.deleteNotificationsByPostId(postId);
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { posts: post._id },
      },
      { new: true },
    );

    if (post.pictures.length) {
      for (let picture of post.pictures) {
        fileService.deleteFile(picture);
      }
    }

    return post;
  }

  async likePost(postId, userId) {
    if (!postId || !userId) throw ApiError.BadRequest(ERROR.expectedId);

    const user = await UserModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const post = await postModel
      .findByIdAndUpdate(
        postId,
        {
          $addToSet: { likes: userId },
        },
        { new: true },
      )
      .populate("likes")
      .populate("userCreator");

    if (!post) {
      throw ApiError.NotFound(ERROR.postNotFound);
    }

    return post;
  }

  async removeLikePost(postId, userId) {
    if (!postId || !userId) throw ApiError.NotFound(ERROR.expectedId);

    const user = await UserModel.findById(userId);

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const post = await postModel
      .findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
        },
        { new: true },
      )
      .populate("likes")
      .populate("userCreator");

    return post;
  }
}

module.exports = new PostService();
