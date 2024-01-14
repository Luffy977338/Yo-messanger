const ERROR = require("../constants/ERROR");
const ApiError = require("../exceptions/api-error");
const SettingsModel = require("../models/settings.model");
const UserModel = require("../models/user.model");

class SettingService {
  async getSettingsByUserId(userId) {
    const user = await UserModel.findById(userId).populate({
      path: "settings",
    });

    if (!user) throw ApiError.NotFound(ERROR.userNotFound);

    return user.settings;
  }

  async changeProfileType(settingsId, type) {
    const user = await UserModel.findById(settingsId);

    const settings = await SettingsModel.findByIdAndUpdate(
      user.settings,
      {
        myPage: { profileType: type },
      },
      { new: true },
    );

    return settings;
  }

  async isProfileClosed(settings) {
    if (!settings) throw ApiError.BadRequest(ERROR.expectedSettings);
    return settings.myPage.profileType === "open" ? false : true;
  }
}

module.exports = new SettingService();
