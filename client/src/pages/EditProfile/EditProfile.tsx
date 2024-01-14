import React from "react";
import st from "./edit-profile.module.scss";
import { useMutation } from "@tanstack/react-query";
import UserService from "../../service/user.service";
import user from "../../store/user";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EditAvatarField from "../../components/UI/EditAvatarField/EditAvatarField";

const EditProfile = () => {
  const [username, setUsername] = React.useState<string>(user.user.username);
  const [description, setDescription] = React.useState<string>(
    user.user.description,
  );
  const [avatar, setAvatar] = React.useState<File | null | undefined>(null);
  const path = useNavigate();

  const editProfileMutation = useMutation(UserService.editProfile, {
    onSuccess: (data) => {
      path("/posts");
      user.setUser(data.data);
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedAvatar = event.target.files && event.target.files[0];
    setAvatar(selectedAvatar);
  };

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("description", description);
    if (avatar) {
      formData.append("avatar", avatar);
      formData.append("prevAvatar", user.user.avatar);
    } else if (avatar === undefined) {
      formData.append("prevAvatar", user.user.avatar);
    }

    toast.promise(editProfileMutation.mutateAsync(formData), {
      loading: "Проверка данных",
      success: "Данные изменены",
      error: (data) => `${data.response.data.message}` || "Что-то пошло не так",
    });
  };

  return (
    <div className={st.edit}>
      <div className={st.topBanner}></div>
      <EditAvatarField avatar={avatar} setAvatar={setAvatar} />
      <div className={st.botBanner}>
        <form onSubmit={handleForm}>
          <input
            type='file'
            style={{ display: "none" }}
            id='avatar'
            onChange={handleAvatarChange}
          />
          <input
            className={st.edit__username}
            type='text'
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            maxLength={15}
            placeholder='Имя...'
          />
          <textarea
            className={st.edit__description}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            maxLength={100}
            placeholder='Описание...'
          />
          <button disabled={editProfileMutation.isLoading}>
            {editProfileMutation.isLoading ? "Сохранение" : "Сохранить"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default observer(EditProfile);
