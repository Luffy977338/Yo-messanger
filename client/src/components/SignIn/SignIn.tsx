import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../service/auth.service";
import user from "../../store/user";
import st from "./sign-in.module.scss";
import LoginInput from "../UI/LoginInput/LoginInput";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const path = useNavigate();

  const loginMutation = useMutation(() => AuthService.login(email, password), {
    onSuccess: (data) => {
      path("/posts");
      localStorage.setItem("token", data.data.accessToken);
      user.setUser(data.data.user);
    },
  });

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    return toast.promise(loginMutation.mutateAsync(), {
      loading: "Проверка данных...",
      success: "С возвращением",
      error: (data) => `${data.response.data.message}` || "Что-то пошло не так",
    });
  };

  return (
    <form onSubmit={handleForm} className={st.signIn}>
      <h1 className={st.signIn__title} style={{ fontFamily: "Arial" }}>
        Вход
      </h1>
      <div style={{ display: "inline-grid", gap: 10 }}>
        <LoginInput
          type='email'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          value={email}
          placeholder='Email'
          autoComplete='on'
        />
        <LoginInput
          type='password'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          value={password}
          placeholder='Пароль'
          autoComplete='current-password'
        />
        <div>
          <button
            disabled={loginMutation.isLoading}
            className={st.signIn__button}
          >
            Войти
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
