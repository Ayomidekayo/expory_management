"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res) {
        const { name, email, password } = req.body;
        const result = await auth_service_1.AuthService.register(name, email, password);
        res.status(201).json(result);
    }
    static async login(req, res) {
        const { email, password } = req.body;
        const result = await auth_service_1.AuthService.login(email, password);
        res.status(200).json(result);
    }
    /*
    =====================================
    Current User
    =====================================
    */
    static async me(req, res) {
        const result = await auth_service_1.AuthService.me(req.user.id);
        res.status(200).json(result);
    }
}
exports.AuthController = AuthController;
