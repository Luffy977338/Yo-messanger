import $api from "../http";

export default class SettingsService {
  static async getSettingsByUserId(userId?: string) {
    return $api.get(`/settings/${userId}`);
  }

  static async changeProfileType(type: "close" | "open") {
    return $api.post(`/settings/profileType`, {
      type,
    });
  }
}
