import { InputHTMLAttributes } from "react";
import st from "./login-input.module.scss";

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const LoginInput: React.FC<LoginInputProps> = (props) => {
  return <input className={st.loginInput} {...props} required />;
};

export default LoginInput;
