import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../../service/auth.service";
import user from "../../../store/user";
import LoginInput from "../LoginInput/LoginInput";
import st from "./sign-up.module.scss";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const path = useNavigate();
  const registrationMutation = useMutation(
    () => AuthService.registration(username, email, password),
    {
      onSuccess: (data) => {
        path("/posts");
        localStorage.setItem("token", data.data.accessToken);
        user.setUser(data.data.user);
      },
    },
  );

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    return toast.promise(registrationMutation.mutateAsync(), {
      loading: "Проверка данных",
      success: "Добро пожаловать",
      error: (data) => `${data.response.data.message}` || "Что-то пошло не так",
    });
  };

  return (
    <form onSubmit={handleForm} className={st.signUp}>
      <h1 className={st.signUp__title}>Регистрация</h1>
      <div style={{ display: "inline-grid", gap: 10 }}>
        <LoginInput
          type='text'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          value={username}
          placeholder='Имя'
        />
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
        <div style={{ display: "inline-block" }}>
          <button
            className={st.signUp__button}
            disabled={registrationMutation.isLoading}
          >
            Зарегестрироваться
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
