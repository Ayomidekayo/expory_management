import {
  Request,
  Response,
  NextFunction,
} from "express";

import containerService from "../services/container.service";

import {
  createContainerSchema,
  updateContainerSchema,
} from "../validations/container.validation";

import {
  ContainerQueryDto,
} from "../validations/container-query.validation";

class ContainerController {
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
        createContainerSchema.parse(
          req.body
        );

      const container =
        await containerService.create(
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Container created successfully.",
        data: container,
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
        ContainerQueryDto.parse(
          req.query
        );

      const result =
        await containerService.findAll(
          query
        );

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
  Find One
  =====================================
  */

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const container =
        await containerService.findById(
          id
        );

      res.status(200).json({
        success: true,
        data: container,
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
        updateContainerSchema.parse(
          req.body
        );

      const container =
        await containerService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Container updated successfully.",
        data: container,
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

      await containerService.delete(
        id
      );

      res.status(200).json({
        success: true,
        message:
          "Container deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ContainerController();