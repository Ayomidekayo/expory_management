

import api from "../lib/axios";
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from "../validations/profile.validation";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  permissions: string[];
}

export const getUsers = async (): Promise<ManagedUser[]> => {
  const response = await api.get("/users");

  return response.data.data;
};

export async function updateUserRole(
  userId: string,
  role: string
): Promise<ManagedUser> {
  const response = await api.patch(
    `/users/${userId}/role`,
    { role }
  );

  return response.data.data;
}

export async function updateUserPermissions(
  userId: string,
  permissions: string[]
): Promise<ManagedUser> {
  const response = await api.patch(
    `/users/${userId}/permissions`,
    { permissions }
  );

  return response.data.data;
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean
): Promise<ManagedUser> {
  const response = await api.patch(
    `/users/${userId}/status`,
    { isActive }
  );

  return response.data.data;
}

export async function getProfile() {
  const response = await api.get("/users/profile");
  return response.data;
}

export async function updateProfile(
  data: UpdateProfileInput
) {
  const response = await api.patch(
    "/users/profile",
    data
  );

  return response.data;
}

export async function changePassword(
  data: ChangePasswordInput
) {
  const response = await api.patch(
    "/users/change-password",
    data
  );

  return response.data;
}