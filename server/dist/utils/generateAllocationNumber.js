"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAllocationNumber = generateAllocationNumber;
const prisma_1 = require("../config/prisma");
async function generateAllocationNumber() {
    const year = new Date().getFullYear();
    const total = await prisma_1.prisma.allocation.count();
    return `ALC-${year}-${String(total + 1).padStart(6, "0")}`;
}
