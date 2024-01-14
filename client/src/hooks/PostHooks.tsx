import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import PostService from "../service/post.service";
import { monthNames } from "../constants/month";
import { Dispatch, SetStateAction } from "react";

export function useGetUserPosts(queryKey: QueryKey, userId?: string) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) =>
      PostService.getAllUserPosts({ pageParam }, userId),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      if (!currentPage && currentPage !== 0) return false;
      return currentPage >= totalPages ? false : currentPage + 1;
    },
    retry: 0,
  });
}

export function useDeletePost(beforeDelete?: Function) {
  const queryClient = useQueryClient();
  return useMutation(PostService.deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      if (beforeDelete) beforeDelete();
    },
  });
}

export function useLike(
  postId: string,
  likes: number,
  setLikes: React.Dispatch<React.SetStateAction<number>>,
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();
  return useMutation(() => PostService.likePost(postId), {
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
  return useMutation(() => PostService.removeLikePost(postId), {
    onError: () => {
      setLikes(likes + 1);
      setIsLiked(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post"]);
    },
  });
}

export function usePostDate(time: Date) {
  const date = new Date();
  const createdAt = new Date(time);
  const hours = createdAt.getHours();
  const minutes = createdAt.getMinutes().toString().padStart(2, "0");
  const month = createdAt.getMonth();
  const dayOfMonth = createdAt.getDate();
  const year = createdAt.getFullYear();
  const isCreatedInThisYear = createdAt.getFullYear() === date.getFullYear();
  const isCreatedToday = dayOfMonth === date.getDate();
  const isCreatedYesterday = dayOfMonth === date.getDate() - 1;

  const postDate = isCreatedInThisYear
    ? isCreatedToday
      ? `сегодня в ${hours}:${minutes}`
      : isCreatedYesterday
      ? `вчера в ${hours}:${minutes}`
      : `${dayOfMonth} ${monthNames[month]} в ${hours}:${minutes}`
    : `${dayOfMonth} ${monthNames[month]} ${year}`;

  return postDate;
}

export function useCreatePost({
  setQueryKey,
  setContent,
  setPictures,
}: {
  setQueryKey: Dispatch<SetStateAction<any>>;
  setContent: Dispatch<SetStateAction<string>>;
  setPictures: Dispatch<SetStateAction<File[] | []>>;
}) {
  return useMutation(PostService.createPost, {
    onSuccess: () => {
      setQueryKey(["posts", Date.now()]);
      setContent("");
      setPictures([]);
    },
  });
}
