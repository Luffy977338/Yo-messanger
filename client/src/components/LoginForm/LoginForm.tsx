import React from "react";
import SignIn from "../UI/SignIn/SignIn";
import SignUp from "../UI/SignUp/SignUp";
import st from "./login-form.module.scss";

const LoginForm = () => {
   const [email, setEmail] = React.useState<string>("");
   const [username, setUsername] = React.useState<string>("");
   const [password, setPassword] = React.useState<string>("");
   const [isLogin, setIsLogin] = React.useState(true);

   const changeOnLogin = () => {
      setIsLogin(true);
      setUsername("");
      setEmail("");
      setPassword("");
   };

   const changeOnRegistration = () => {
      setIsLogin(false);
      setEmail("");
      setPassword("");
   };

   return (
      <>
         <div className={st.login__form}>
            <div className={st.auth__types}>
               <div
                  className={
                     isLogin
                        ? st.auth__button_background
                        : [
                             st.auth__button_background,
                             st.auth__button_backgroundSecond,
                          ].join(" ")
                  }
               ></div>
               <button
                  onClick={() => changeOnLogin()}
                  className={st.auth__button_login}
               >
                  Войти
               </button>
               <button
                  onClick={() => changeOnRegistration()}
                  className={st.auth__button_register}
               >
                  Зарегестрироваться
               </button>
            </div>
            {isLogin ? (
               <SignIn
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
               />
            ) : (
               <SignUp
                  username={username}
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setUsername={setUsername}
                  setPassword={setPassword}
               />
            )}
         </div>
      </>
   );
};

export default LoginForm;
