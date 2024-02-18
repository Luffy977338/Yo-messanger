import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const path = useNavigate();

  return (
    <div>
      <h1>Страница не найдена</h1>
      <span>Что-то пошло не так, проверьте правильно-ли вы ввели URL</span>
      <br />
      <button onClick={() => path("/posts")}>На главную</button>
    </div>
  );
};

export default NotFound;
