import { AxiosResponse } from "axios";
import $api from "../http";

export default class PostService {
  static async getAllUserPosts({ pageParam = 1 }, userId?: string) {
    const response = await $api.get(`/posts/user/${userId}?page=${pageParam}`);
    return response.data;
  }

  static async deletePost(data: { id: string; fileName: string | null }) {
    return $api.delete(`/posts/${data.id}`, { data });
  }

  static async getOnePost(postId: string) {
    return $api.get(`/posts/${postId}`);
  }

  static async likePost(postId: string): Promise<AxiosResponse<any>> {
    return $api.post(`/posts/like/${postId}`);
  }

  static async removeLikePost(postId: string): Promise<AxiosResponse<any>> {
    return $api.delete(`/posts/removeLike/${postId}`);
  }

  static async createPost(newPost: any): Promise<AxiosResponse<any>> {
    const response = await $api.post(`/posts`, newPost);
    return response.data;
  }
}
