import { useMutation, useQueryClient } from "@tanstack/react-query";
import user from "../store/user";
import PostService from "../service/post.service";

export function useLike(
  postId: string,
  likes: number,
  setLikes: React.Dispatch<React.SetStateAction<number>>,
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();
  return useMutation(() => PostService.likePost(postId, user.user._id), {
    onError: () => {
      setLikes(likes - 1);
      setIsLiked(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post"]);
    },
  });
}

export function useRemoveLike(
  postId: string,
  likes: number,
  setLikes: React.Dispatch<React.SetStateAction<number>>,
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();
  return useMutation(() => PostService.removeLikePost(postId, user.user._id), {
    onError: () => {
      setLikes(likes + 1);
      setIsLiked(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post"]);
    },
  });
}
