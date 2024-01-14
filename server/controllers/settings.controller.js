const settingsService = require("../service/settings.service");

class SettingsController {
  async getSettingsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const settings = await settingsService.getSettingsByUserId(userId);

      res.json(settings);
    } catch (e) {
      next(e);
    }
  }

  async changeProfileType(req, res, next) {
    try {
      const id = req.user._id;
      const { type } = req.body;
      const settings = await settingsService.changeProfileType(id, type);
      return res.json(settings);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new SettingsController();
