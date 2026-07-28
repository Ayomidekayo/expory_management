"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const ApiError_1 = require("./utils/ApiError");
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // React Vite
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Export Management API Running',
    });
});
app.use('/api', routes_1.default);
app.use(error_middleware_1.default);
app.use((err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    console.error(err); // log unexpected errors
    return res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});
exports.default = app;
