import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/jwt";
import { ApiError } from "../utils/ApiError";

export class AuthService {
  /*
  =====================================
  Register
  =====================================
  */

  static async register(
    name: string,
    email: string,
    password: string
  ) {
    /*
     * Generic registration error.
     *
     * We deliberately do not reveal whether
     * the email already belongs to an account.
     */

    const REGISTRATION_ERROR_MESSAGE =
      "Unable to complete registration with the information provided. Please check your details and try again.";

    /*
     * Check whether the email already exists.
     */

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    /*
     * Do NOT reveal that the email already exists.
     */

    if (existingUser) {
      throw new ApiError(
        400,
        REGISTRATION_ERROR_MESSAGE
      );
    }

    /*
     * Hash password.
     */

    const hashedPassword =
      await bcrypt.hash(password, 10);

    /*
     * Create user.
     *
     * A newly registered user does not receive
     * any individual permissions automatically.
     */

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        include: {
          permissions: true,
        },
      });

    /*
     * Generate JWT.
     *
     * Permissions are deliberately NOT stored
     * inside the JWT. They are loaded from the
     * database by authenticate middleware.
     */

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    /*
     * Never return password.
     */

    const {
      password: _,
      permissions,
      ...safeUser
    } = user;

    return {
      success: true,

      message:
        "User registered successfully",

      data: {
        user: {
          ...safeUser,

          permissions: permissions.map(
            (item) => item.permission
          ),
        },

        token,
      },
    };
  }

  /*
  =====================================
  Login
  =====================================
  */

  static async login(
    email: string,
    password: string
  ) {
    /*
     * ONE generic message for all
     * authentication failures.
     */

    const INVALID_CREDENTIALS_MESSAGE =
      "Invalid email or password.";

    /*
     * Find user together with permissions.
     */

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          permissions: true,
        },
      });

    /*
     * Do not reveal that the account
     * does not exist.
     */

    if (!user) {
      throw new ApiError(
        401,
        INVALID_CREDENTIALS_MESSAGE
      );
    }

    /*
     * Do not reveal that the account
     * has been disabled.
     */

    if (!user.isActive) {
      throw new ApiError(
        401,
        INVALID_CREDENTIALS_MESSAGE
      );
    }

    /*
     * Compare password.
     */

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    /*
     * Same error as non-existent user.
     */

    if (!isMatch) {
      throw new ApiError(
        401,
        INVALID_CREDENTIALS_MESSAGE
      );
    }

    /*
     * Credentials are valid.
     */

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    /*
     * Never return password.
     */

    const {
      password: _,
      permissions,
      ...safeUser
    } = user;

    return {
      success: true,

      message: "Login successful",

      data: {
        user: {
          ...safeUser,

          permissions: permissions.map(
            (item) => item.permission
          ),
        },

        token,
      },
    };
  }

  /*
  =====================================
  Current User
  =====================================
  */

  static async me(userId: string) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,

          permissions: {
            select: {
              permission: true,
            },
          },
        },
      });

    if (!user) {
      throw new ApiError(
        404,
        "User not found"
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Account disabled"
      );
    }

    return {
      success: true,

      data: {
        ...user,

        permissions:
          user.permissions.map(
            (item) => item.permission
          ),
      },
    };
  }
}