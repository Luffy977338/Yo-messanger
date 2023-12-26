import { useMutation, useQueryClient } from "@tanstack/react-query";
import PostsService from "../service/posts.service";
import errors from "../store/errors";

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation(PostsService.deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      errors.makeErrorEmpty();
    },
  });
}
