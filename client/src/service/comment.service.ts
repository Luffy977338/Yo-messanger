import { AxiosResponse } from "axios";
import $api from "../http";
import { IComment } from "../interfaces/comment.interface";

export default class CommentService {
  static async getComments(postId: string): Promise<AxiosResponse<IComment[]>> {
    return $api.get(`/post/comments/${postId}`);
  }

  static async deleteComment(
    commentId: string,
  ): Promise<AxiosResponse<IComment>> {
    return $api.delete(`/post/comments/${commentId}`);
  }
  static async comment(
    postId: string,
    { message, pictures }: { message?: string; pictures?: File[] },
  ): Promise<AxiosResponse<IComment>> {
    return $api.post(`/post/comments/${postId}`, { message, pictures });
  }
}
