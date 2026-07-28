import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/jwt";
import { ApiError } from "../utils/ApiError";

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ApiError(400, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken({ userId: user.id, role: user.role });

    // Strip password before returning
    const { password: _, ...safeUser } = user;

    return {
      success: true,
      message: "User registered successfully",
      data: {
        user: safeUser,
        token,
      },
    };
  }
  

 static async login(email: string, password: string) {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate JWT
    const token = generateToken({ userId: user.id, role: user.role });

    // Strip password before returning
    const { password: _, ...safeUser } = user;

    return {
      success: true,
      message: "Login successful",
      data: {
        user: safeUser,
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

    data: user,

  };

}
}







