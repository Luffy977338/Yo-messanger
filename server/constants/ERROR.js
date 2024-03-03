const ERROR = {
  userNotFound: "Такого пользователя не существует",
  usernameAlreadyUse: "Имя уже занято",
  requiredField: "Поле обязательно",
  notificationNotFound: "Такого уведомления не существует",
  commentNotFound: "Такого комментария не существует",
  commentCannotBeEmpty: "Комментарий не может быть пустым",
  notificationAlreadyExist: "Такое уведомление уже есть",
  MailNotActivated: "Почта не подтвержденна",
  postCannotBeDeletedNotUserCreator:
    "Пост не можеть быть удален не его создателем",
  notificationCannotBeSentToTheSameIdAsTheSender:
    "Уведомление нельзя отправить самому себе",
  postNotFound: "Такого поста не существует",
  postCannotBeEmpty: "Пост не может быть пустым",
  expectedId: "Ожидалось получение id",
  expectedSettings: "Ожидались настройки",
  expectedEmail: "Ожидалось получение email",
  extensionNotValid: "Расширение не поддерживается",
  usernameMustHaveNoSpaces: "Имя не должно содержать пробелов",
  noInformation: "Нет информации",
  toManyPhotos: "Слишком много фотографий",
  roomIdMustHaveTwoIds: "roomId должно состоять из 2-ух id",
  googleVerifyTokenException: "Ошибка googleVerifyToken",
};

module.exports = ERROR;
