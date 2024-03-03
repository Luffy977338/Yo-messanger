import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const path = useNavigate();

  return (
    <div>
      <Helmet title='Yo' />
      <h1>Страница не найдена</h1>
      <span>Что-то пошло не так, проверьте правильно-ли вы ввели URL</span>
      <br />
      <button onClick={() => path("/posts")}>На главную</button>
    </div>
  );
};

export default NotFound;
