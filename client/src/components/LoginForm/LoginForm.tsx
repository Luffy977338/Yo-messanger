import { useState } from "react";
import SignIn from "../UI/SignIn/SignIn";
import SignUp from "../UI/SignUp/SignUp";
import st from "./login-form.module.scss";
import GoogleSignIn from "../UI/GoogleSignIn/GoogleSignIn";
import ProoveMail from "../ProoveMail/ProoveMail";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(-1);

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
        <div className={st.google}>
          <GoogleSignIn />
        </div>
        <span className={st.line}>
          <span
            style={{
              width: `${
                step > totalSteps ? "0%" : (step / totalSteps) * 100 + "%"
              }`,
              opacity: `${
                step > totalSteps || step / totalSteps === 0 ? "0%" : "100%"
              }`,
            }}
            className={st.line__before}
          ></span>
        </span>
        {isLogin ? (
          <SignIn />
        ) : (
          <>
            {(() => {
              switch (step) {
                case 1:
                  return <ProoveMail />;
                default:
                  return (
                    <SignUp setStep={setStep} setTotalSteps={setTotalSteps} />
                  );
              }
            })()}
          </>
        )}
      </div>
    </>
  );
};

export default LoginForm;
