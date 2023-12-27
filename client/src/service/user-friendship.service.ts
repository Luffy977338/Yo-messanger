import { AxiosResponse } from "axios";
import $api from "../http";

// the first "id" is who they unfollow, and the second "subscriberId" is who unfollows

export default class UserFriendshipService {
  static async subscribe(
    id: number | string,
    subscriberId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/subscribe/${id}/${subscriberId}`);
  }

  static async unsubscribe(
    id: number | string,
    subscriberId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/unsubscribe/${id}/${subscriberId}`);
  }

  static async confirmFriend(
    id: number | string,
    subscriberId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/acceptFriend/${id}/${subscriberId}`);
  }

  static async deleteFriend(
    id: number | string,
    subscriberId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/deleteFriend/${id}/${subscriberId}`);
  }

  static async rejectFriend(
    id: number | string,
    subscriberId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/rejectFriend/${id}/${subscriberId}`);
  }
}
