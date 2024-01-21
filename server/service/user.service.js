const ERROR = require("../constants/ERROR");
const SettingsService = require("../service/settings.service");
const isPictureExtensionOk = require("../constants/acceptedPictureExtensions");
const UserAuthDto = require("../dtos/user-auth.dto");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exceptions/api-error");
const UserModel = require("../models/user.model");
const fileService = require("./file.service");
const path = require("path");
const ClosedUserDto = require("../dtos/closed-user.dto");

class UserService {
  async editProfile(id, username, description, avatar, prevAvatar) {
    let updatedFields = {};
    const prevAvatarSplitted = prevAvatar.split("/");
    prevAvatar = prevAvatarSplitted[prevAvatarSplitted.length - 1];

    if (!username && !description) {
      throw ApiError.BadRequest(ERROR.noInformation);
    }

    if (username.includes(" ")) {
      throw ApiError.BadRequest(ERROR.usernameMustHaveNoSpaces);
    }

    updatedFields.username = username;
    updatedFields.description = description;

    if (avatar) {
      const avatarExt = path.extname(avatar.name);

      if (!isPictureExtensionOk.includes(avatarExt)) {
        throw ApiError.BadRequest(ERROR.extensionNotValid);
      }

      const avatarFile = fileService.saveFile(avatar);
      updatedFields.avatar = process.env.API_URL + "/" + avatarFile;

      if (prevAvatar) {
        fileService.deleteFile(
          prevAvatar === "default-user-avatar.jpg" ? null : prevAvatar,
        );
      }
    } else if (prevAvatar) {
      fileService.deleteFile(
        prevAvatar === "default-user-avatar.jpg" ? null : prevAvatar,
      );

      const avatarPath = path.join(
        __dirname,
        "images",
        "default-user-avatar.jpg",
      );

      updatedFields.avatar =
        process.env.API_URL + "/" + path.basename(avatarPath);
    }

    const newUser = await UserModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    const userDto = new UserDto(newUser);

    return userDto;
  }

  async getUserById(id, reqUser) {
    if (!id) throw ApiError.BadRequest(ERROR.expectedId);

    const user = await UserModel.findById(id)
      .populate({
        path: "friends subscriptions subscribers posts settings",
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

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    const { userDto, userAuthDto } = await this.generateUserDtos(user, reqUser);

    return { user: userDto, userAuth: userAuthDto };
  }

  async getUserByEmail(email) {
    if (!email) {
      throw ApiError.BadRequest(ERROR.expectedEmail);
    }

    const user = await UserModel.findOne({ email })
      .populate({
        path: "friends subscriptions subscribers posts settings",
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
      return undefined;
    }

    const { userDto, userAuthDto } = await this.generateUserDtos(user);

    return { user: userDto, userAuth: userAuthDto, password: user.password };
  }

  async generateUserDtos(user, reqUserData = null) {
    const userAuthDto = new UserAuthDto(user);

    if (reqUserData) {
      const isProfileClosed = await SettingsService.isProfileClosed(
        user.settings,
      );

      const reqUser = reqUserData
        ? await UserModel.findById(reqUserData._id)
        : null;

      const isFriends = user.friends.some((friend) =>
        friend._id.equals(reqUser._id),
      );

      const userDto =
        isProfileClosed &&
        !isFriends &&
        String(reqUser._id) !== String(user._id)
          ? new ClosedUserDto(user)
          : new UserDto(user);

      return { userDto, userAuthDto };
    }

    const userDto = new UserDto(user);

    return { userDto, userAuthDto };
  }
}

module.exports = new UserService();
