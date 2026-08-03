
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { ChangePasswordDto } from "../validations/user.validation";

class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
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

  async updateProfile(
    id: string,
    data: {
      name: string;
      phone?: string;
      department?: string;
      jobTitle?: string;
      avatar?: string;
    }
  ) {
    return prisma.user.update({
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
  async findByEmail(
  email: string
) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async findWithPassword(
  id: string
) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async updatePassword(
  id: string,
  password: string
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      password,
    },
  });
}
/*
=====================================
Change Password
=====================================
*/


}



export default new UserRepository();

