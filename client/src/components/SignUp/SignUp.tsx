import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../service/auth.service";
import user from "../../store/user";
import LoginInput from "../UI/LoginInput/LoginInput";
import st from "./sign-up.module.scss";
import toast from "react-hot-toast";

const SignUp = ({
  setStep,
  setTotalSteps,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setTotalSteps: Dispatch<SetStateAction<number>>;
}) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const registrationMutation = useMutation(
    () => AuthService.registration(username, email, password),
    {
      onSuccess: (data) => {
        if ("activate" in data.data) {
          setStep(1);
          return;
        }
        setStep(1);
        localStorage.setItem("token", data.data.accessToken);
        user.setUser(data.data.user);
      },
    },
  );

  useEffect(() => {
    setTotalSteps(1);
    setStep(0);
  }, []);

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    return await toast.promise(registrationMutation.mutateAsync(), {
      success: (data) => {
        if ("activate" in data.data) {
          return "Письмо с подтверждением отправленно";
        }
        return "Добро пожаловать";
      },
      error: (data) => `${data.response.data.message}` || "Что-то пошло не так",
      loading: "Смотрим данные",
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
