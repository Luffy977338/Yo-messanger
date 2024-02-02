import { useMutation } from "@tanstack/react-query";
import AuthService from "../service/auth.service";
import user from "../store/user";
import { useNavigate } from "react-router-dom";

export function useGoogleAuth() {
  const path = useNavigate();
  return useMutation(AuthService.googleAuth, {
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.accessToken);
      user.setUser(data.data.user);
      path("/posts");
    },
  });
}
