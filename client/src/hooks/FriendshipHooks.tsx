import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "../service/user-friendship-service";
import user from "../store/user";

export function useSubscribe(id: string) {
   const queryClient = useQueryClient();
   return useMutation(() => UserService.subscribe(id, user.user._id), {
      onSuccess: () => {
         queryClient.invalidateQueries(["friends"]);
      },
   });
}

export function useUnsubscribe(id: string) {
   const queryClient = useQueryClient();
   return useMutation(() => UserService.unsubscribe(id, user.user._id), {
      onSuccess: () => {
         queryClient.invalidateQueries(["friends"]);
      },
   });
}

export function useAcceptFriend(id: string) {
   const queryClient = useQueryClient();
   return useMutation(() => UserService.confirmFriend(id, user.user._id), {
      onSuccess: () => {
         queryClient.invalidateQueries(["friends"]);
      },
   });
}

export function useRejectFriend(id: string) {
   const queryClient = useQueryClient();
   return useMutation(() => UserService.rejectFriend(id, user.user._id), {
      onSuccess: () => {
         queryClient.invalidateQueries(["friends"]);
      },
   });
}

export function useDeleteFriend(id: string) {
   const queryClient = useQueryClient();
   return useMutation(() => UserService.deleteFriend(id, user.user._id), {
      onSuccess: () => {
         queryClient.invalidateQueries(["friends"]);
      },
   });
}
