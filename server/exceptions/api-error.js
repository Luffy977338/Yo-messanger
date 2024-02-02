module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(message = "Пользовательне не авторизован") {
    return new ApiError(401, message);
  }

  static BadRequest(message = "Неккоректно веденные данные", errors = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message = "Не найдено", errors = []) {
    return new ApiError(404, message, errors);
  }

  static NotActivated() {
    return new ApiError(403, "Почта не подтверждена");
  }

  static ModuleOutOfWork(message = "Модуль не работает", errors = []) {
    return new ApiError(500, message, errors);
  }
};
