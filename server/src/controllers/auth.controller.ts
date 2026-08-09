import {
  Request,
  Response,
} from "express";

import { AuthService } from "../services/auth.service";

export class AuthController {
  /*
  =====================================
  Register
  =====================================
  */

  static async register(
    req: Request,
    res: Response
  ) {
    const {
      name,
      email,
      password,
    } = req.body;

    const result =
      await AuthService.register(
        name,
        email,
        password
      );

    return res.status(201).json(result);
  }

  /*
  =====================================
  Login
  =====================================
  */

  static async login(
    req: Request,
    res: Response
  ) {
    const {
      email,
      password,
    } = req.body;

    const result =
      await AuthService.login(
        email,
        password
      );

    return res.status(200).json(result);
  }

  /*
  =====================================
  Current User
  =====================================
  */

  static async me(
    req: Request,
    res: Response
  ) {
    const result =
      await AuthService.me(
        req.user.id
      );

    return res.status(200).json(result);
  }
}