


import { prisma } from "../config/prisma";
import { Permission, Role } from "../generated";

class UserRepository {
  /*
  =====================================
  Get User Profile
  =====================================
  */

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

        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
  }

  /*
  =====================================
  Update Profile
  =====================================
  */

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

        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
  }

  /*
  =====================================
  Find By Email
  =====================================
  */

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  /*
  =====================================
  Find With Password
  =====================================
  */

  async findWithPassword(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  /*
  =====================================
  Update Password
  =====================================
  */

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
  Get All Users
  =====================================
  */

  async findAll() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
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

        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
  }

  /*
  =====================================
  Update User Role
  =====================================
  */

  async updateRole(
    id: string,
    role: Role
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,

        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
  }

  /*
  =====================================
  Update User Permissions
  =====================================
  */

  async updatePermissions(
    userId: string,
    permissions: Permission[]
  ) {
    return prisma.$transaction(
      async (tx) => {
        // Remove existing permissions
        await tx.userPermission.deleteMany({
          where: {
            userId,
          },
        });

        // Add the new permissions
        if (permissions.length > 0) {
          await tx.userPermission.createMany({
            data: permissions.map(
              (permission) => ({
                userId,
                permission,
              })
            ),
            skipDuplicates: true,
          });
        }

        return tx.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,

            permissions: {
              select: {
                permission: true,
              },
            },
          },
        });
      }
    );
  }

  /*
  =====================================
  Update User Active Status
  =====================================
  */

  async updateActiveStatus(
    id: string,
    isActive: boolean
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,

        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });
  }
}

export default new UserRepository();
