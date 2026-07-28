"use strict";
// prisma.config.ts
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema.prisma",
    migrations: {
        seed: "tsx prisma/seed.ts",
    },
});
