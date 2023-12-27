import { AxiosResponse } from "axios";
import $api from "../http";
import user from "../store/user";

export default class UserActionsService {
  static async editProfile(updatedFields: any): Promise<AxiosResponse<any>> {
    return $api.patch(`/edit/${user.user._id}`, updatedFields);
  }

  static async getOneUser(id: string): Promise<AxiosResponse<any>> {
    return $api.get(`/${id}`);
  }

  static async likePost(
    postId: string,
    userId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.patch(`/like/${postId}/${userId}`);
  }

  static async removeLikePost(
    postId: string,
    userId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.patch(`/removeLike/${postId}/${userId}`);
  }

  static async makeNotificationViewed(notifId: string) {
    return $api.post(`/makeNotificationViewed/${notifId}`);
  }
}
