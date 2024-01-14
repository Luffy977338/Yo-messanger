import { AxiosResponse } from "axios";
import $api from "../http";

export default class UserFriendshipService {
  static async subscribe(id: string): Promise<AxiosResponse<any>> {
    return $api.post(`/subscribe/${id}`);
  }

  static async unsubscribe(id: string): Promise<AxiosResponse<any>> {
    return $api.post(`/unsubscribe/${id}`);
  }

  static async confirmFriend(id: string): Promise<AxiosResponse<any>> {
    return $api.post(`/acceptFriend/${id}`);
  }

  static async deleteFriend(id: string): Promise<AxiosResponse<any>> {
    return $api.post(`/deleteFriend/${id}`);
  }

  static async rejectFriend(id: string): Promise<AxiosResponse<any>> {
    return $api.post(`/rejectFriend/${id}`);
  }
}
