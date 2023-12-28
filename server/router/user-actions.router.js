const userActionsController = require("../controllers/user-actions.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { body } = require("express-validator");
const Router = require("express").Router;

const router = new Router();

router.patch(
  "/edit/:id",
  authMiddleware,
  body("username", "Длина ника должна составлять от 4 до 15 символов").isLength(
    { min: 4, max: 15 },
  ),
  body("description", "Длина описания должна быть до 100 символов").isLength({
    min: 0,
    max: 100,
  }),
  userActionsController.editProfile,
);
router.get("/:id", authMiddleware, userActionsController.getOneUser);
router.post(
  "/makeNotificationViewed/:id",
  userActionsController.makeNotificationViewed,
);

module.exports = router;
