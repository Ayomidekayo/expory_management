import api from "../../lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const login = async (
  data: LoginDto
): Promise<LoginResponse> => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data.data;
};

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export const register = async (
  data: RegisterDto
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

interface CurrentUserResponse {
  success: boolean;

  data: User;
}

export async function getCurrentUser() {
  const { data } =
    await api.get<CurrentUserResponse>(
      "/auth/me"
    );

  return data;
}