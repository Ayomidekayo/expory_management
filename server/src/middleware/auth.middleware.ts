import {
  Request,
  Response,
  NextFunction,
} from "express";

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { verifyToken } from "../lib/jwt";
import { prisma } from "../config/prisma";

interface TokenPayload {
  userId: string;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing.",
    });
  }

  let payload: TokenPayload;

  try {
    payload = verifyToken(token) as TokenPayload;

    if (
      !payload ||
      typeof payload.userId !== "string" ||
      !payload.userId
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Access token expired. Please log in again.",
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token. Please log in again.",
      });
    }

    console.error("Token verification failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify authentication.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: {
        permissions: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token was not found.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account disabled.",
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions.map(
        (item) => item.permission,
      ),
    };

    return next();
  } catch (error) {
    console.error("Authentication database error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to authenticate user.",
    });
  }
};

export default authenticate;