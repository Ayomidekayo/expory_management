import api from "../lib/axios";
import type { ChangePasswordInput, UpdateProfileInput } from "../validations/profile.validation";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};


export async function getProfile() {
  const response =
    await api.get("/users/profile");

  return response.data;
}

export async function updateProfile(
  data: UpdateProfileInput
) {
  const response =
    await api.patch(
      "/users/profile",
      data
    );

  return response.data;
}

export async function changePassword(
  data: ChangePasswordInput
) {
  const response =
    await api.patch(
      "/users/change-password",
      data
    );

  return response.data;
}