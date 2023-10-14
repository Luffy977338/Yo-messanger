import LoginForm from "../../components/LoginForm/LoginForm";
import st from "./authorization.module.scss";

const Authorization = () => {
   return (
      <div className={st.authorization}>
         <div className={st.wrap}>
            <div className={st.login__form_wrap}>
               <LoginForm />
            </div>
            <div className={st.description}>
               <p>Добро</p>
               <p>Пожаловать в</p>
               <p>
                  <span>Y</span>
                  <span>o</span>
                  <span>!</span>
               </p>
               <p>Спасибо за то,</p>
               <p>что используете наш сервис</p>
            </div>
         </div>
      </div>
   );
};

export default Authorization;
