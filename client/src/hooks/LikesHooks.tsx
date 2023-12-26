import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserActionsService from "../service/user-actions.service";
import user from "../store/user";

export function useLike(
  postId: number,
  likes: number,
  setLikes: React.Dispatch<React.SetStateAction<number>>,
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();
  return useMutation(() => UserActionsService.likePost(postId, user.user._id), {
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
  postId: number,
  likes: number,
  setLikes: React.Dispatch<React.SetStateAction<number>>,
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();
  return useMutation(
    () => UserActionsService.removeLikePost(postId, user.user._id),
    {
      onError: () => {
        setLikes(likes + 1);
        setIsLiked(true);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["post"]);
      },
    },
  );
}
