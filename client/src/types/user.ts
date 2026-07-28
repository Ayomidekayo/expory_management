import type { Role } from "./enums";

export interface User {
  id: string;

  name: string;

  email: string;

  role: Role;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}