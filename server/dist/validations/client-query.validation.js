"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientQueryDto = void 0;
const zod_1 = require("zod");
exports.ClientQueryDto = zod_1.z.object({
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number().default(10),
    search: zod_1.z.string().optional(),
    clientType: zod_1.z
        .enum(["COMPANY", "INDIVIDUAL"])
        .optional(),
    country: zod_1.z.string().optional(),
    isActive: zod_1.z
        .preprocess((value) => {
        if (value === "true")
            return true;
        if (value === "false")
            return false;
        return undefined;
    }, zod_1.z.boolean().optional()),
});
