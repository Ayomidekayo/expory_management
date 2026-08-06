"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const user_validation_1 = require("../validations/user.validation");
class UserController {
    /*
    =====================================
    Get Profile
    =====================================
    */
    async getProfile(req, res, next) {
        try {
            const profile = await user_service_1.default.getProfile(req.user.id);
            res.status(200).json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Update Profile
    =====================================
    */
    async updateProfile(req, res, next) {
        try {
            const data = user_validation_1.updateProfileSchema.parse(req.body);
            const profile = await user_service_1.default.updateProfile(req.user.id, data);
            res.status(200).json({
                success: true,
                message: "Profile updated successfully.",
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /*
    =====================================
    Change Password
    =====================================
    */
    async changePassword(req, res, next) {
        try {
            const data = user_validation_1.changePasswordSchema.parse(req.body);
            await user_service_1.default.changePassword(req.user.id, data);
            res.status(200).json({
                success: true,
                message: "Password changed successfully.",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new UserController();
