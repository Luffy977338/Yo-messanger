import { useMutation } from "@tanstack/react-query";
import AuthService from "../service/auth.service";
import { useNavigate } from "react-router-dom";
import user from "../store/user";

export function useGoogleAuth() {
  const path = useNavigate();
  return useMutation(AuthService.googleAuth, {
    onSuccess: (data) => {
      path("/posts");
      localStorage.setItem("token", data.data.accessToken);
      user.setUser(data.data.user);
    },
  });
}
