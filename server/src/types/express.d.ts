import { Role } from "../generated";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      name: string;
      email: string;
      role: Role;
    }

    interface Request {
      user: UserPayload;
    }
  }
}

export {};