const ApiError = require("../exceptions/api-error");
const userAuthService = require("../service/user-auth-service");
const { validationResult } = require("express-validator");

class UserAuthController {
   async registration(req, res, next) {
      try {
         const validationErrors = validationResult(req);
         const errors = validationErrors.array();
         console.log(errors);
         if (!validationErrors.isEmpty()) {
            return next(
               ApiError.BadRequest(
                  errors[0].msg || "Введены неккоректные данные",
               ),
            );
         }

         const { username, email, password } = req.body;
         const userData = await userAuthService.registration(
            username,
            email,
            password,
         );

         res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         });
         return res.json(userData);
      } catch (e) {
         next(e);
      }
   }

   async login(req, res, next) {
      try {
         const { email, password } = req.body;
         const userData = await userAuthService.login(email, password);
         res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         });
         return res.json(userData);
      } catch (e) {
         next(e);
      }
   }

   async logout(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         const token = await userAuthService.logout(refreshToken);
         res.clearCookie("refreshToken");
         return res.json(token);
      } catch (e) {
         next(e);
      }
   }

   async activate(req, res, next) {
      try {
         const activationLink = req.params.link;
         await userAuthService.activate(activationLink);
         return res.redirect(process.env.CLIENT_URL);
      } catch (e) {
         next(e);
      }
   }

   async refresh(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         const userData = await userAuthService.refresh(refreshToken);
         res.cookie("refreshToken", userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
         });
         return res.json(userData);
      } catch (e) {
         next(e);
      }
   }

   async getUsers(req, res, next) {
      try {
         const users = await userAuthService.getAllUsers();
         return res.json(users);
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new UserAuthController();
