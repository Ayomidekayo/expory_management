import { Request, Response, NextFunction } from "express";

import consigneeService from "../services/consignee.service";

import {
  createConsigneeSchema,
  updateConsigneeSchema,
} from "../validations/consignee.validation";

class ConsigneeController {
  /*
  =====================================
  Create Consignee
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createConsigneeSchema.parse(req.body);

      const consignee =
        await consigneeService.createConsignee(data);

      res.status(201).json({
        success: true,
        message:
          "Consignee created successfully.",
        data: consignee,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get All Consignees
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const consignees =
        await consigneeService.getConsignees();

      res.status(200).json({
        success: true,
        data: consignees,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get One Consignee
  =====================================
  */

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const consignee =
        await consigneeService.getConsignee(id);

      res.status(200).json({
        success: true,
        data: consignee,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Consignee
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
        updateConsigneeSchema.parse(req.body);

      const consignee =
        await consigneeService.updateConsignee(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Consignee updated successfully.",
        data: consignee,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Consignee
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      await consigneeService.deleteConsignee(id);

      res.status(200).json({
        success: true,
        message:
          "Consignee deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ConsigneeController();