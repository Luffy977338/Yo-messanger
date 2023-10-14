import React from "react";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../../service/auth-service";
import user from "../../../store/user";
import LoginInput from "../LoginInput/LoginInput";
import st from "./sign-up.module.scss";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface SignUpProps {
   username: string;
   email: string;
   password: string;
   setUsername: React.Dispatch<React.SetStateAction<string>>;
   setEmail: React.Dispatch<React.SetStateAction<string>>;
   setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const SignUp = React.memo(
   ({
      username,
      email,
      password,
      setEmail,
      setPassword,
      setUsername,
   }: SignUpProps) => {
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
      return (
         <div className={st.signUp}>
            <h1 className={st.signUp__title}>Регистрация</h1>
            <div style={{ display: "inline-grid", gap: 10 }}>
               <LoginInput
                  options={{
                     type: "text",
                     onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        setUsername(e.target.value),
                     value: username,
                     placeholder: "Имя",
                  }}
               />
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
               <div style={{ display: "inline-block" }}>
                  <button
                     className={st.signUp__button}
                     onClick={() => {
                        toast.promise(registrationMutation.mutateAsync(), {
                           loading: "Проверка данных",
                           success: "Добро пожаловать",
                           error: (data) =>
                              `${data.response.data.message}` ||
                              "Что-то пошло не так",
                        });
                     }}
                     disabled={registrationMutation.isLoading}
                  >
                     Зарегестрироваться
                  </button>
               </div>
            </div>
         </div>
      );
   },
);

export default SignUp;
