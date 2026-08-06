"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
class UserRepository {
    async findById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                phone: true,
                department: true,
                jobTitle: true,
                avatar: true,
                createdAt: true,
            },
        });
    }
    async updateProfile(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                department: true,
                jobTitle: true,
                avatar: true,
            },
        });
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async findWithPassword(id) {
        return prisma_1.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async updatePassword(id, password) {
        return prisma_1.prisma.user.update({
            where: {
                id,
            },
            data: {
                password,
            },
        });
    }
}
exports.default = new UserRepository();
