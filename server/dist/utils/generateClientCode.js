"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClientCode = generateClientCode;
const prisma_1 = require("../config/prisma");
async function generateClientCode() {
    const year = new Date().getFullYear();
    const count = await prisma_1.prisma.client.count();
    return `CLI-${year}-${String(count + 1).padStart(5, "0")}`;
}
