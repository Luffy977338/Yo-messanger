const settingsController = require("../controllers/settings.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const Router = require("express").Router;

const router = new Router();

router.get("/:userId", authMiddleware, settingsController.getSettingsByUserId);
router.post(
  "/profileType",
  authMiddleware,
  settingsController.changeProfileType,
);

module.exports = router;
