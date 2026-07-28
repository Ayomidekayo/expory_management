import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createExporterSchema,
  updateExporterSchema,
} from "../validations/exporter.validation";

import { ExporterService } from "../services/exporter.service";

const service = new ExporterService();

export class ExporterController {
  /*
  =====================================
  Get All Exporters
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const exporters =
        await service.findAll();

      res.status(200).json({
        success: true,
        data: exporters,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Exporter
  =====================================
  */

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const exporter =
        await service.findById(id);

      res.status(200).json({
        success: true,
        data: exporter,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Create Exporter
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validated =
        createExporterSchema.parse(
          req.body
        );

      const exporter =
        await service.create(
          validated
        );

      res.status(201).json({
        success: true,
        message:
          "Exporter created successfully.",
        data: exporter,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Exporter
  =====================================
  */

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const validated =
        updateExporterSchema.parse(
          req.body
        );

      const exporter =
        await service.update(
          id,
          validated
        );

      res.status(200).json({
        success: true,
        message:
          "Exporter updated successfully.",
        data: exporter,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Exporter
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      await service.delete(id);

      res.status(200).json({
        success: true,
        message:
          "Exporter deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ExporterController();