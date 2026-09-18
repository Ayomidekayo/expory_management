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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

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






/*
=====================================
Admin - Get All Users
=====================================
*/

async getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users =
      await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

/*
=====================================
Admin - Update User Role
=====================================
*/

async updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Array.isArray(
      req.params.id
    )
      ? req.params.id[0]
      : req.params.id;

    const { role } = req.body;

    const user =
      await userService.updateUserRole(
        userId,
        role
      );

    res.status(200).json({
      success: true,
      message:
        "User role updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/*
=====================================
Admin - Update User Permissions
=====================================
*/

async updateUserPermissions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Array.isArray(
      req.params.id
    )
      ? req.params.id[0]
      : req.params.id;

    const { permissions } = req.body;

    const user =
      await userService.updateUserPermissions(
        userId,
        permissions
      );

    res.status(200).json({
      success: true,
      message:
        "User permissions updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/*
=====================================
Admin - Activate / Disable User
=====================================
*/

async updateUserStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = Array.isArray(
      req.params.id
    )
      ? req.params.id[0]
      : req.params.id;

    const { isActive } = req.body;

    const user =
      await userService.updateUserStatus(
        userId,
        isActive
      );

    res.status(200).json({
      success: true,
      message:
        "User status updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

}

export default new UserController();