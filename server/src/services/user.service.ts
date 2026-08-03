import bcrypt from "bcrypt";

import userRepository from "../Repository/user.repository";

import { ApiError } from "../utils/ApiError";

import { ChangePasswordDto, UpdateProfileDto } from "../validations/user.validation";

class UserService {
  /*
  =====================================
  Get Profile
  =====================================
  */

  async getProfile(
    userId: string
  ) {
    const user =
      await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  /*
  =====================================
  Update Profile
  =====================================
  */

  async updateProfile(
    userId: string,
    data: UpdateProfileDto
  ) {
    await this.getProfile(userId);

    return userRepository.updateProfile(
      userId,
      data
    );
  }
  /*
=====================================
Change Password
=====================================
*/

async changePassword(
  userId: string,
  data: ChangePasswordDto
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

  const isValid =
    await bcrypt.compare(
      data.currentPassword,
      user.password
    );

  if (!isValid) {
    throw new ApiError(
      400,
      "Current password is incorrect."
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.newPassword,
      10
    );

  await userRepository.updatePassword(
    userId,
    hashedPassword
  );

  return {
    message:
      "Password updated successfully.",
  };
}
}

export default new UserService();