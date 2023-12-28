import { AxiosResponse } from "axios";
import $api from "../http";
import user from "../store/user";

export default class PostService {
  static async deletePost(data: { id: string; fileName: string | null }) {
    return $api.delete(`/posts/${user.user._id}/${data.id}`, { data });
  }

  static async getOnePost(postId: string) {
    return $api.get(`/posts/${postId}`);
  }

  static async likePost(
    postId: string,
    userId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/posts/like/${postId}/${userId}`);
  }

  static async removeLikePost(
    postId: string,
    userId: string,
  ): Promise<AxiosResponse<any>> {
    return $api.post(`/posts/removeLike/${postId}/${userId}`);
  }
}
