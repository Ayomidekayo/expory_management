"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const client_1 = require("../generated/client");
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
function errorHandler(err, req, res, next) {
    console.error(err);
    // Custom API errors
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // Validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: err.flatten(),
        });
    }
    // Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return res.status(409).json({
                    success: false,
                    message: "A record with the same value already exists.",
                });
            case "P2025":
                return res.status(404).json({
                    success: false,
                    message: "Record not found.",
                });
            default:
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
        }
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
    });
}
