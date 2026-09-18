import {
  Request,
  Response,
  NextFunction,
} from "express";

import { Permission } from "../generated";

const requirePermission =
  (permission: Permission) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // ADMIN has full access
    if (req.user.role === "ADMIN") {
      return next();
    }

    const hasPermission =
      req.user.permissions?.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action.",
      });
    }

    next();
  };

export default requirePermission;