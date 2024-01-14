import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "../service/user-friendship.service";

export function useSubscribe(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.subscribe(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}

export function useUnsubscribe(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.unsubscribe(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}

export function useAcceptFriend(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.confirmFriend(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}

export function useRejectFriend(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.rejectFriend(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}

export function useDeleteFriend(id: string) {
  const queryClient = useQueryClient();
  return useMutation(() => UserService.deleteFriend(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
    },
  });
}
