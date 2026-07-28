import { Role } from "../../generated/enums";
import type { Multer } from "multer";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }

    interface Request {
      user: User;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export {};