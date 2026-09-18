import { Role, Permission } from "../generated";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
        permissions: Permission[];
      };
    }
  }
}