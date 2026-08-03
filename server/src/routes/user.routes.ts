import { Router } from "express";
import userController from "../controllers/user.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

/*
=====================================
Profile
=====================================
*/

router.get(
  "/profile",
  authenticate,
  userController.getProfile
);

router.patch(
  "/profile",
  authenticate,
  userController.updateProfile
);

/*
=====================================
Password
=====================================
*/

router.patch(
  "/change-password",
  authenticate,
  userController.changePassword
);

export default router;