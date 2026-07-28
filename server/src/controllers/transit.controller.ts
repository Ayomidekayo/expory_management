import {
  Request,
  Response,
  NextFunction,
} from "express";

import transitService from "../services/transit.service";

import {
  createTransitSchema,
  updateTransitSchema,
} from "../validations/transit.validation";

import {
  TransitQueryDto,
} from "../validations/transit-query.validation";

class TransitController {
  /*
  =====================================
  Create
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createTransitSchema.parse(req.body);

      const transit =
        await transitService.create(data);

      res.status(201).json({
        success: true,
        message:
          "Transit created successfully.",
        data: transit,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        TransitQueryDto.parse(req.query);

      const result =
        await transitService.findAll(query);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const transit =
        await transitService.findById(id);

      res.status(200).json({
        success: true,
        data: transit,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update
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
        updateTransitSchema.parse(req.body);

      const transit =
        await transitService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Transit updated successfully.",
        data: transit,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      await transitService.delete(id);

      res.status(200).json({
        success: true,
        message:
          "Transit deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TransitController();