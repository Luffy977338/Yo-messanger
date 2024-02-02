import { ButtonHTMLAttributes, FC, ReactNode, forwardRef } from "react";
import st from "./button.module.scss";

interface ButtonProps {
  children: ReactNode;
}

const Button: FC<ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>> =
  forwardRef(({ children, ...options }) => {
    return (
      <button {...options} className={st.button}>
        {children}
      </button>
    );
  });

export default Button;
