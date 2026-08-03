import {
  Request,
  Response,
  NextFunction,
} from "express";

import userService from "../services/user.service";

import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/user.validation";

class UserController {
  /*
  =====================================
  Get Profile
  =====================================
  */

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profile =
        await userService.getProfile(
          req.user.id
        );

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Profile
  =====================================
  */

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        updateProfileSchema.parse(
          req.body
        );

      const profile =
        await userService.updateProfile(
          req.user.id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Profile updated successfully.",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Change Password
  =====================================
  */

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        changePasswordSchema.parse(
          req.body
        );

      await userService.changePassword(
        req.user.id,
        data
      );

      res.status(200).json({
        success: true,
        message:
          "Password changed successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();