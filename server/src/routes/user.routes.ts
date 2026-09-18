import { Router } from "express";

import userController from "../controllers/user.controller";
import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/authorize.middleware";

import { Role } from "../generated";

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

/*
=====================================
Admin - User Management
=====================================
*/

router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  userController.getUsers
);

router.patch(
  "/:id/role",
  authenticate,
  authorize(Role.ADMIN),
  userController.updateUserRole
);

router.patch(
  "/:id/permissions",
  authenticate,
  authorize(Role.ADMIN),
  userController.updateUserPermissions
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(Role.ADMIN),
  userController.updateUserStatus
);

export default router;