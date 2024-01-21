const ERROR = {
  userNotFound: "Такого пользователя не существует",
  notificationNotFound: "Такого уведомления не существует",
  notificationAlreadyExist: "Такое уведомление уже есть",
  postCannotBeDeletedNotUserCreator:
    "Пост не можеть быть удален не его создателем",
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
