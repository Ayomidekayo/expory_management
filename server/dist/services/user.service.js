"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = __importDefault(require("../Repository/user.repository"));
const ApiError_1 = require("../utils/ApiError");
class UserService {
    /*
    =====================================
    Get Profile
    =====================================
    */
    async getProfile(userId) {
        const user = await user_repository_1.default.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found.");
        }
        return user;
    }
    /*
    =====================================
    Update Profile
    =====================================
    */
    async updateProfile(userId, data) {
        await this.getProfile(userId);
        return user_repository_1.default.updateProfile(userId, data);
    }
    /*
  =====================================
  Change Password
  =====================================
  */
    async changePassword(userId, data) {
        const user = await user_repository_1.default.findWithPassword(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found.");
        }
        const isValid = await bcrypt_1.default.compare(data.currentPassword, user.password);
        if (!isValid) {
            throw new ApiError_1.ApiError(400, "Current password is incorrect.");
        }
        const hashedPassword = await bcrypt_1.default.hash(data.newPassword, 10);
        await user_repository_1.default.updatePassword(userId, hashedPassword);
        return {
            message: "Password updated successfully.",
        };
    }
}
exports.default = new UserService();
