import { useEffect, useState } from "react";
import user from "../../store/user";
import { QueryKey, useQuery } from "@tanstack/react-query";
import $api from "../../http";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "./../../utils/debouce";
import st from "./proove-mail.module.scss";
import Button from "../UI/Button/Button";

const ProoveMail = () => {
  const path = useNavigate();
  const [tries, setStries] = useState(0);
  const [queryKey, setQueryKey] = useState<QueryKey>([
    user.user._id,
    Date.now(),
  ]);

  const { data } = useQuery(queryKey, () => $api.get(`/${user.user._id}`), {
    select: ({ data }) => data,
  });

  useEffect(() => {
    if ("isActivated" in Object(data) && tries > 0) {
      data.isActivated
        ? path("/posts")
        : toast.error("Почта все еще не активированна");
    }
  }, [data]);

  const refetchHandler = debounce(() => {
    setStries((prev) => prev + 1);
    setQueryKey([user.user._id, Date.now()]);
  }, 1000);

  return (
    <>
      <div className={st.message}>
        <div>Письмо с подтверждением было отправленно вам на почту.</div>
        <div>Проверьте почту и подтвердите ее.</div>
      </div>
      <Button onClick={() => refetchHandler()}>Проверить</Button>
    </>
  );
};

export default observer(ProoveMail);
