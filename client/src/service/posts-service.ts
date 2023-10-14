import $api from "../http";
import user from "../store/user";

export default class PostsService {
   static async deletePost(data: { id: number; fileName: string | null }) {
      return $api.delete(`/posts/${user.user._id}/${data.id}`, { data });
   }

   static async getOnePost(postId: number) {
      return $api.get(`/posts/${postId}`);
   }
}
