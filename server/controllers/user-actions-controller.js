const userActionsService = require("../service/user-actions-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserActionsController {
   async editProfile(req, res, next) {
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

         const id = req.params.id;
         const { username, description, prevAvatar } = req.body;
         const avatar = req.files ? req.files.avatar : null;

         const newData = await userActionsService.editProfile(
            id,
            username,
            description,
            avatar,
            prevAvatar,
         );

         return res.json(newData);
      } catch (e) {
         next(e);
      }
   }

   async likePost(req, res, next) {
      try {
         const userId = req.params.userId;
         const postId = req.params.postId;

         const post = await userActionsService.likePost(postId, userId);

         return res.json(post);
      } catch (e) {
         next(e);
      }
   }

   async removeLikePost(req, res, next) {
      try {
         const userId = req.params.userId;
         const postId = req.params.postId;

         const post = await userActionsService.removeLikePost(postId, userId);

         return res.json(post);
      } catch (e) {
         next(e);
      }
   }

   async getOneUser(req, res, next) {
      try {
         const id = req.params.id;
         const page = req.query.page;
         const perPage = 8;
         const user = await userActionsService.getOneUser(id, perPage, page);

         return res.json(user);
      } catch (e) {
         next(e);
      }
   }
}

module.exports = new UserActionsController();
