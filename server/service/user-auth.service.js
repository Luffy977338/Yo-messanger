const UserModel = require("../models/user.model.js");
const SettingsModel = require("../models/settings.model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const path = require("path");
const mailService = require("./mail.service.js");
const tokenService = require("./token.service.js");
const UserDto = require("../dtos/user.dto.js");
const UserAuthDto = require("../dtos/user-auth.dto.js");
const ApiError = require("../exceptions/api-error.js");
const ERROR = require("../constants/ERROR.js");
const userService = require("./user.service.js");

const isEmailService =
  !!process.env.SMTP_PASSWORD &&
  !!process.env.SMTP_USER &&
  !!process.env.SMTP_PORT &&
  !!process.env.SMTP_HOST;

class UserAuthService {
  async registration(username, email, password) {
    const candidateEmail = await UserModel.findOne({ email });
    const candidateName = await UserModel.findOne({ username });
    if (candidateName) {
      throw ApiError.BadRequest("Пользователь с таким ником уже есть");
    }
    if (candidateEmail) {
      throw ApiError.BadRequest("Пользователь с такой почтой уже есть");
    }

    const hashPassword = await bcrypt.hash(password, 4);
    const activationLink = uuid.v4();

    const avatarPath = path.join(
      __dirname,
      "images",
      "default-user-avatar.jpg",
    );
    const avatar = path.basename(avatarPath);

    const settings = await SettingsModel.create({});

    const user = await UserModel.create({
      avatar,
      username,
      email,
      password: hashPassword,
      activationLink,
      friends: [],
      subscribers: [],
      subscriptions: [],
      description: "",
      settings,
    });

    if (isEmailService) {
      await mailService.sendActiovationLink(
        email,
        `${process.env.API_URL}/auth/activate/${activationLink}`,
      );
    }

    const userDto = new UserDto(user);
    const userAuthDto = new UserAuthDto(user);

    const tokens = tokenService.generateTokens({ ...userAuthDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("wrong link");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const data = await userService.getUserByEmail(email);

    if (!data) throw ApiError.BadRequest("Неверный логин или пароль");

    const { user, userAuth, password: userPassword } = data;

    const isPasswordEquals = await bcrypt.compare(password, userPassword);
    if (!isPasswordEquals) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }

    const tokens = tokenService.generateTokens({ ...userAuth });
    await tokenService.saveToken(user._id, tokens.refreshToken);

    return { ...tokens, user };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!tokenFromDb || !userData) {
      throw ApiError.UnauthorizedError();
    }
    const { user, userAuth } = await userService.getUserById(userData._id);

    const tokens = tokenService.generateTokens({ ...userAuth });
    await tokenService.saveToken(user._id, tokens.refreshToken);

    return { ...tokens, user };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserAuthService();
