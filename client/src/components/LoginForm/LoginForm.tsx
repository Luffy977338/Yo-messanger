import React from "react";
import SignIn from "../UI/SignIn/SignIn";
import SignUp from "../UI/SignUp/SignUp";
import st from "./login-form.module.scss";

const LoginForm = () => {
  const [isLogin, setIsLogin] = React.useState(true);

  const changeOnLogin = () => {
    setIsLogin(true);
  };

  const changeOnRegistration = () => {
    setIsLogin(false);
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
          />
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
        {isLogin ? <SignIn /> : <SignUp />}
      </div>
    </>
  );
};

export default LoginForm;
