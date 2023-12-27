import { useMutation, useQueryClient } from "@tanstack/react-query";
import PostsService from "../service/post.service";
import errors from "../store/errors";

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation(PostsService.deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["notifications"]);
      errors.makeErrorEmpty();
    },
  });
}
