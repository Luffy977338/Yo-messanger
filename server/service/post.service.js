const ERROR = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const fileService = require("./file.service");
const path = require("path");
const notificationService = require("./notification.service");

class PostService {
  async getAllPosts(page, perPage) {
    const posts = await postModel
      .find()
      .skip(perPage * page)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate("userCreator");
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

  async getOnePost(postId) {
    if (!postId) {
      throw ApiError.BadRequest("нет Id");
    }

    const post = await postModel
      .findById(postId)
      .populate("likes")
      .populate("userCreator");

    if (!post) {
      throw ApiError.NotFound(ERROR.postNotFound);
    }

    return post;
  }

  async createPost(userId, content, files) {
    let map;
    files ? (map = new Map(Object.entries(files))) : null;

    if (!content && !files) {
      throw ApiError.BadRequest("Пост не может быть пустым");
    }

    if (!userId) {
      throw ApiError.BadRequest(ERROR.userNotFound);
    }

    const updatedFields = {
      userCreator: userId,
      content,
      pictures: [],
    };

    if (map) {
      if (map.size >= 9) throw ApiError.BadRequest("Слишком много фотографий");
      for (const picture of map.values()) {
        const pictureExtension = path.extname(picture.name);
        if (pictureExtension !== ".png" && pictureExtension !== ".jpg") {
          throw ApiError.BadRequest("Формат файла не поддерживается");
        }
        const pictureFile = fileService.saveFile(picture);
        updatedFields.pictures.push(pictureFile);
      }
    }

    const post = await postModel.create(updatedFields);
    await userModel.findByIdAndUpdate(
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
    return post;
  }

  async deletePost(userId, postId) {
    const post = await postModel.findByIdAndDelete(postId);
    await notificationService.deleteNotificationByPostId(postId);
    await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { posts: post._id },
      },
      { new: true },
    );

    if (!!post.pictures.length) {
      for (let picture of post.pictures) {
        fileService.deleteFile(picture);
      }
    }

    return post;
  }

  async likePost(postId, userId) {
    if (!postId || !userId) {
      throw ApiError.BadRequest(ERROR.expectedId);
    }

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
    if (!postId || !userId) {
      throw ApiError.NotFound("Пост или пользователь не найден");
    }

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
