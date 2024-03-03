import { FC, ReactNode } from "react";
import MainHelmet from "react-helmet";

interface HelmetProps {
  title: string;
  children: ReactNode;
}

const Helmet: FC<HelmetProps> = ({ title, children }) => {
  return (
    <MainHelmet>
      <meta charSet='utf8' />
      <title>{title}</title>
      {children}
    </MainHelmet>
  );
};

export default Helmet;
