import { Request, Response, NextFunction } from "express";

import clientService from "../services/client.service";

import {
  createClientSchema,
  updateClientSchema,
} from "../validations/client.validation";

import { ClientQueryDto } from "../validations/client-query.validation";

class ClientController {
  /*
  =====================================
  Create Client
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createClientSchema.parse(req.body);

      const client =
        await clientService.create(data);

      res.status(201).json({
        success: true,
        message:
          "Client created successfully.",
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Clients
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        ClientQueryDto.parse(req.query);

      const clients =
        await clientService.findAll(query);

      res.status(200).json({
        success: true,
        ...clients,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Client
  =====================================
  */

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const client =
        await clientService.findById(id);

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Client
  =====================================
  */

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const data =
        updateClientSchema.parse(req.body);

      const client =
        await clientService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Client updated successfully.",
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Client
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      await clientService.delete(id);

      res.status(200).json({
        success: true,
        message:
          "Client deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Activate / Deactivate
  =====================================
  */

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const client =
        await clientService.updateStatus(
          id,
          req.body.isActive
        );

      res.status(200).json({
        success: true,
        message:
          client.isActive
            ? "Client activated successfully."
            : "Client deactivated successfully.",
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientController();