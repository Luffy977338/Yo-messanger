import React from "react";
import { useMutation } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import $api, { API_URL } from "../../http";
import user from "../../store/user";
import st from "./form.module.scss";
import { SlCamera } from "react-icons/sl";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Form = ({
   setQueryKey,
}: {
   setQueryKey: React.Dispatch<React.SetStateAction<any>>;
}) => {
   const { id } = useParams();
   const [content, setContent] = React.useState<string>("");
   const [picture, setPicture] = React.useState<File | null>(null);

   const createPost = async (newPost: any) => {
      const response = await $api.post(`/posts/${user.user._id}`, newPost);
      return response.data;
   };

   const mutation = useMutation(createPost, {
      onSuccess: () => {
         setQueryKey(["posts", id ? id : null, Date.now()]);
         setContent("");
         setPicture(null);
      },
      onError: () => {
         setPicture(null);
      },
   });

   const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("content", content);
      if (picture) {
         formData.append("picture", picture);
      }

      toast.promise(mutation.mutateAsync(formData), {
         loading: "Проверка поста",
         success: "Пост опубликован",
         error: (data) =>
            `${data.response.data.message}` || "Что-то пошло не так",
      });
   };

   const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedPicture = event.target.files && event.target.files[0];
      setPicture(selectedPicture);
   };

   return (
      <form className={st.postForm} onSubmit={handleForm}>
         <div className={st.postForm__data}>
            <div>
               <img
                  draggable={false}
                  className={st.postForm__data_avatar}
                  src={`${API_URL}/${user.user.avatar}`}
                  alt=''
               />
            </div>
            <div>
               <input
                  placeholder='О чем хотите рассказать?...'
                  className={st.postForm__data_input}
                  type='text'
                  value={content}
                  disabled={mutation.isLoading}
                  maxLength={3000}
                  onChange={(e) => setContent(e.target.value)}
               />
            </div>
         </div>
         <div className={st.postForm__tools}>
            <div>
               <input
                  id='picture'
                  name='picture'
                  type='file'
                  onChange={handlePictureChange}
               />
               <label className={st.label} title='Фотографии' htmlFor='picture'>
                  <SlCamera style={{ fontSize: "20px" }} />
               </label>
            </div>
            <div>
               <button
                  className={st.postForm__tools_button}
                  type='submit'
                  disabled={mutation.isLoading}
               >
                  {mutation.isLoading ? "Сохранение" : "Сохранить"}
               </button>
            </div>
         </div>
         {picture && (
            <div>
               <button
                  onClick={() => {
                     setPicture(null);
                  }}
               >
                  X
               </button>
               <div>
                  <img
                     draggable={false}
                     style={{
                        width: 300,
                        height: 300,
                        objectFit: "cover",
                     }}
                     src={picture ? URL.createObjectURL(picture) : ""}
                     alt=''
                  />
               </div>
            </div>
         )}
      </form>
   );
};

export default observer(Form);
