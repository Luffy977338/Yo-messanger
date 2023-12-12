const Router = require("express").Router;
const userAuthController = require("../controllers/user-auth-controller.js");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = new Router();

router.post(
  "/registration",
  body("username", "Длина ника должна составлять от 4 до 15 символов").isLength(
    { min: 4, max: 15 },
  ),
  body("email", "Ваша почта не валидна").isEmail(),
  body("password", "Длина пароля должна быть от 3 до 15 символов").isLength({
    min: 3,
    max: 15,
  }),
  userAuthController.registration,
);
router.post("/login", userAuthController.login);
router.post("/logout", userAuthController.logout);
router.get("/activate/:link", userAuthController.activate);
router.get("/refresh", userAuthController.refresh);
router.get("/users", authMiddleware, userAuthController.getUsers);

module.exports = router;
