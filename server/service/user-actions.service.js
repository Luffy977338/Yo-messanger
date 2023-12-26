const ERROR = require("../constants/ERROR");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exceptions/api-error");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const fileService = require("./file.service");
const path = require("path");

class UserActionsService {
  async editProfile(id, username, description, avatar, prevAvatar) {
    let updatedFields = {};

    if (!username && !description) {
      throw ApiError.BadRequest("Нет информации");
    }

    if (username.includes(" ")) {
      throw ApiError.BadRequest("Имя не должно содержать пробелов");
    }

    updatedFields.username = username;
    updatedFields.description = description;

    if (avatar) {
      const avatarExt = path.extname(avatar.name);
      if (avatarExt !== ".png" && avatarExt !== ".jpg") {
        throw ApiError.BadRequest("Формат файла не поддерживается");
      } else {
        const avatarFile = fileService.saveFile(avatar);
        updatedFields.avatar = avatarFile;
      }
      if (prevAvatar) {
        fileService.deleteFile(
          prevAvatar === "default-user-avatar.jpg" ? null : prevAvatar,
        );
      }
    } else if (!avatar) {
      if (prevAvatar) {
        fileService.deleteFile(
          prevAvatar === "default-user-avatar.jpg" ? null : prevAvatar,
        );
        const avatarPath = path.join(
          __dirname,
          "images",
          "default-user-avatar.jpg",
        );
        updatedFields.avatar = path.basename(avatarPath);
      }
    }

    const newUser = await userModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    const userDto = new UserDto(newUser);

    return userDto;
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

  async getOneUser(id) {
    if (!id) {
      throw ApiError.BadRequest(ERROR.expectedId);
    }

    const user = await userModel
      .findById(id)
      .populate({
        path: "friends subscriptions subscribers posts",
      })
      .populate({
        path: "notifications",
        populate: [
          { path: "user post" },
          { path: "post", populate: "userCreator" },
        ],
      })
      .populate({
        path: "recentChatUsers",
        populate: [
          { path: "user lastMessage" },
          {
            path: "lastMessage",
            populate: "messageCreator",
          },
        ],
        options: {
          sort: { "lastMessage.createdAt": -1 }, // Сортировка recentChatUsers
        },
      });

    if (!user) {
      throw ApiError.NotFound(ERROR.userNotFound);
    }

    const userDto = new UserDto(user);

    return userDto;
  }
}

module.exports = new UserActionsService();
