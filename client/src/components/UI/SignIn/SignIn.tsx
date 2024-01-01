import React from "react";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../../service/auth.service";
import user from "../../../store/user";
import st from "./sign-in.module.scss";
import LoginInput from "../LoginInput/LoginInput";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface SignIpProps {
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const SignIn = React.memo(
  ({ email, password, setEmail, setPassword }: SignIpProps) => {
    const path = useNavigate();

    const loginMutation = useMutation(
      () => AuthService.login(email, password),
      {
        onSuccess: (data) => {
          path("/posts");
          console.log(data);
          localStorage.setItem("token", data.data.accessToken);
          user.setUser(data.data.user);
        },
      },
    );

    return (
      <div className={st.signIn}>
        <h1 className={st.signIn__title} style={{ fontFamily: "Arial" }}>
          Вход
        </h1>
        <div style={{ display: "inline-grid", gap: 10 }}>
          <LoginInput
            options={{
              type: "email",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value),
              value: email,
              placeholder: "Email",
            }}
          />
          <LoginInput
            options={{
              type: "password",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value),
              value: password,
              placeholder: "Пароль",
            }}
          />
          <div>
            <button
              onClick={() => {
                toast.promise(loginMutation.mutateAsync(), {
                  loading: "Проверка данных",
                  success: "С возвращением",
                  error: (data) =>
                    `${data.response.data.message}` || "Что-то пошло не так",
                });
              }}
              disabled={loginMutation.isLoading}
              className={st.signIn__button}
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default SignIn;
