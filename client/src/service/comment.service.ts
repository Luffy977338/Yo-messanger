import { AxiosResponse } from "axios";
import $api from "../http";
import { IComment } from "../interfaces/comment.interface";

export default class CommentService {
  static async getComments(postId: string): Promise<AxiosResponse<IComment[]>> {
    return $api.get(`/post/comments/${postId}`);
  }

  static async getCommentReplies({
    commentId,
    pageParam = 0,
  }: {
    commentId: string;
    pageParam: number;
  }) {
    const response = await $api.get(
      `/post/comments/replies/${commentId}?page=${pageParam}`,
    );
    return response.data;
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

  static async replyComment(
    commentId: string,
    { message, pictures }: { message?: string; pictures?: File[] },
  ): Promise<AxiosResponse<IComment>> {
    return $api.post(`/post/comments/reply/${commentId}`, {
      message,
      pictures,
    });
  }

  static async likeComment(commentId: string) {
    return $api.post(`/post/comments/like/${commentId}`);
  }

  static async removeLikeComment(commentId: string) {
    return $api.delete(`post/comments/like/${commentId}`);
  }
}
