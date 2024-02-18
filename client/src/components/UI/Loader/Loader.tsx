import { FC, HTMLProps } from "react";
import st from "./loader.module.scss";

interface LoaderProps extends HTMLProps<HTMLDivElement> {}

const Loader: FC<LoaderProps> = ({ ...options }) => {
  return <div {...options} className={st.spinner}></div>;
};

export default Loader;
