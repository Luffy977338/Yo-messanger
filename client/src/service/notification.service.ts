import $api from "../http";

export default class NotificationService {
  static async getNotifications() {
    return $api.get(`/notifications`);
  }

  static async makeNotificationViewed(notifId: string) {
    return $api.patch(`/notifications/${notifId}`);
  }
}
