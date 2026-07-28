"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../lib/jwt");
const prisma_1 = require("../config/prisma");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader ||
            !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }
        const token = authHeader.split(" ")[1];
        const payload = (0, jwt_1.verifyToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: payload.userId,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
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
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};
exports.default = authenticate;
