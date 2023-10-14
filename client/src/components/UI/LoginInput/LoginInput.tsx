import st from "./login-input.module.scss";

interface LoginInputProps {
   options: any;
}

const LoginInput = ({ options }: LoginInputProps) => {
   return <input className={st.loginInput} {...options} required />;
};

export default LoginInput;
