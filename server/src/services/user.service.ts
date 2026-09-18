
import { ApiError } from "../utils/ApiError";
import { Permission, Role } from "../generated";
import userRepository from "../Repository/user.repository";
import bcrypt from "bcryptjs";
class UserService {
  /*
  =====================================
  Profile
  =====================================
  */

  async getProfile(id: string) {
    const user =
      await userRepository.findById(id);

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return {
      ...user,
      permissions:
        user.permissions.map(
          (item) => item.permission
        ),
    };
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
    const user =
      await userRepository.findById(id);

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    const updated =
      await userRepository.updateProfile(
        id,
        data
      );

    return {
      ...updated,
      permissions:
        updated.permissions.map(
          (item) => item.permission
        ),
    };
  }

  /*
  =====================================
  Get All Users
  =====================================
  */

  async getAllUsers() {
    const users =
      await userRepository.findAll();

    return users.map((user) => ({
      ...user,
      permissions:
        user.permissions.map(
          (item) => item.permission
        ),
    }));
  }

  /*
  =====================================
  Update Role
  =====================================
  */

  async updateUserRole(
    userId: string,
    role: Role
  ) {
    const user =
      await userRepository.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    const updated =
      await userRepository.updateRole(
        userId,
        role
      );

    return {
      ...updated,
      permissions:
        updated.permissions.map(
          (item) => item.permission
        ),
    };
  }

  /*
  =====================================
  Update Permissions
  =====================================
  */

  async updateUserPermissions(
    userId: string,
    permissions: Permission[]
  ) {
    const user =
      await userRepository.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    const updated =
      await userRepository.updatePermissions(
        userId,
        permissions
      );

    if (!updated) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return {
      ...updated,
      permissions:
        updated.permissions.map(
          (item) => item.permission
        ),
    };
  }

  /*
  =====================================
  Update Active Status
  =====================================
  */

  async updateUserStatus(
    userId: string,
    isActive: boolean
  ) {
    const user =
      await userRepository.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    const updated =
      await userRepository.updateActiveStatus(
        userId,
        isActive
      );

    return {
      ...updated,
      permissions:
        updated.permissions.map(
          (item) => item.permission
        ),
    };
  }

  // Keep your existing changePassword()

  /*
=====================================
Change Password
=====================================
*/

async changePassword(
  userId: string,
  data: {
    currentPassword: string;
    newPassword: string;
  }
) {
  const user =
    await userRepository.findWithPassword(
      userId
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found."
    );
  }

  const isPasswordValid =
    await bcrypt.compare(
      data.currentPassword,
      user.password
    );

  if (!isPasswordValid) {
    throw new ApiError(
      400,
      "Current password is incorrect."
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.newPassword,
      12
    );

  await userRepository.updatePassword(
    userId,
    hashedPassword
  );
}
}

export default new UserService();