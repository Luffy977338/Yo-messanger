import { ButtonHTMLAttributes, FC, ReactNode, forwardRef } from "react";
import st from "./button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button: FC<ButtonProps> = forwardRef(({ children, ...options }) => {
  return (
    <button {...options} className={st.button}>
      {children}
    </button>
  );
});

export default Button;
