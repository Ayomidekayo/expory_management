"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../lib/jwt");
const ApiError_1 = require("../utils/ApiError");
class AuthService {
    static async register(name, email, password) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ApiError_1.ApiError(400, "Email already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
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
    static async login(email, password) {
        // Find user by email
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        // Compare password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        }
        // Generate JWT
        const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
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
    static async me(userId) {
        const user = await prisma_1.prisma.user.findUnique({
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
            throw new ApiError_1.ApiError(404, "User not found");
        }
        if (!user.isActive) {
            throw new ApiError_1.ApiError(403, "Account disabled");
        }
        return {
            success: true,
            data: user,
        };
    }
}
exports.AuthService = AuthService;
