import { Router } from "express";
import { body, param } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import { handleInputErrors } from "../middleware/validation.js";
import { FollowController } from "../controllers/FollowController.js";

const router = Router()

router.get('/follow',
    body('followed').
        isMongoId().withMessage('ID no Válido'),
    handleInputErrors,
    authenticate,
    FollowController.follow
)

router.delete(
  "/unfollow/:unfollowedId",
  param("unfollowedId").isMongoId().withMessage("ID no Válido"),
  handleInputErrors,
  authenticate,
  FollowController.unfollow
);

export default router