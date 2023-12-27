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

  async createPost(userId, content, picture) {
    if (!content && !picture) {
      throw ApiError.BadRequest("Пост не может быть пустым");
    }

    if (!userId) {
      throw ApiError.BadRequest("Пользователь не найден");
    }

    const updatedFields = {
      userCreator: userId,
      content,
    };

    if (picture) {
      const pictureExt = path.extname(picture.name);
      if (pictureExt !== ".png" && pictureExt !== ".jpg") {
        throw ApiError.BadRequest("Формат файла не поддерживается");
      } else {
        const pictureFile = fileService.saveFile(picture);
        updatedFields.picture = pictureFile;
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

  async deletePost(userId, postId, fileName) {
    await notificationService.deleteNotificationByPostId(postId);
    const post = await postModel.findByIdAndDelete(postId);
    await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { posts: post._id },
      },
      { new: true },
    );
    if (fileName) {
      fileService.deleteFile(fileName);
    }
    return post;
  }
}

module.exports = new PostService();
