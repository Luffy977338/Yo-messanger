import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import CommentService from "../service/comment.service";
import { Dispatch, SetStateAction } from "react";
import { IComment } from "../interfaces/comment.interface";
import { useCreateNewNotification } from "./NotificationsHooks";

export function useGetComments(
  postId: string,
  setComments?: Dispatch<SetStateAction<IComment[]>>,
  queryKey?: QueryKey,
) {
  return useQuery(
    [postId, queryKey ? queryKey : null],
    () => CommentService.getComments(postId),
    {
      select: ({ data }) => data,
      onSuccess: (data) => {
        setComments ? setComments(data) : null;
      },
    },
  );
}

export function useGetCommentReplies(queryKey: QueryKey, commentId: string) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) =>
      CommentService.getCommentReplies({
        pageParam: pageParam,
        commentId: commentId,
      }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      if (!currentPage && currentPage !== 0) return false;
      return currentPage >= totalPages ? false : currentPage + 1;
    },
    retry: 0,
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation(CommentService.deleteComment, {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries([data.post._id]);
      queryClient.invalidateQueries([data._id]);
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

export function useReplyComment(commentId: string) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ message, pictures }: { message?: string; pictures?: File[] }) =>
      CommentService.replyComment(commentId, { message, pictures }),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries([data._id]);
      },
    },
  );
}

export function useLikeComment({
  commentId,
  setLikes,
  setIsLiked,
}: {
  commentId: string;
  setLikes: Dispatch<SetStateAction<number>>;
  setIsLiked: Dispatch<SetStateAction<boolean>>;
}) {
  return useMutation(() => CommentService.likeComment(commentId), {
    onError: () => {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    },
  });
}

export function useRemoveLikeComment({
  commentId,
  setLikes,
  setIsLiked,
}: {
  commentId: string;
  setLikes: Dispatch<SetStateAction<number>>;
  setIsLiked: Dispatch<SetStateAction<boolean>>;
}) {
  return useMutation(() => CommentService.removeLikeComment(commentId), {
    onError: () => {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    },
  });
}
