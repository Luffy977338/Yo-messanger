import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentService from "../service/comment.service";
import { Dispatch, SetStateAction } from "react";
import { IComment } from "../interfaces/comment.interface";
import { useCreateNewNotification } from "./NotificationsHooks";

export function useGetComments(
  postId: string,
  setComments?: Dispatch<SetStateAction<IComment[]>>,
) {
  return useQuery([postId], () => CommentService.getComments(postId), {
    select: ({ data }) => data,
    onSuccess: (data) => {
      setComments ? setComments(data) : null;
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation(CommentService.deleteComment, {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([data.post]);
    },
  });
}

export function useComment(postId: string) {
  const queryClient = useQueryClient();
  const createNotification = useCreateNewNotification();
  return useMutation(
    ({ message, pictures }: { message?: string; pictures?: File[] }) =>
      CommentService.comment(postId, { message, pictures }),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries([postId]);
        createNotification("comment", {
          toUserId: data.post.userCreator._id,
          userId: data.user._id,
          postId: data.post._id,
          commentId: data._id,
        });
      },
    },
  );
}
