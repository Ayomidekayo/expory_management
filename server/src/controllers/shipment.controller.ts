import {
  Request,
  Response,
  NextFunction,
} from "express";

import shipmentService from "../services/shipment.service";

import {
  createShipmentSchema,
  updateShipmentSchema,
} from "../validations/shipment.validation";

import { ShipmentQueryDto } from "../validations/shipment-query.validation";

class ShipmentController {
  /* ===========================================
     Available Shipments
  =========================================== */

  async findAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const shipments =
        await shipmentService.findAvailable();

      res.status(200).json({
        success: true,
        data: shipments,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     Create Shipment
  =========================================== */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createShipmentSchema.parse(
          req.body
        );

      const shipment =
        await shipmentService.create(
          data,
          req.user!.id
        );

      res.status(201).json({
        success: true,
        message:
          "Shipment created successfully.",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     Get Shipments
  =========================================== */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        ShipmentQueryDto.parse(req.query);

      const shipments =
        await shipmentService.findAll(
          query
        );

      res.status(200).json({
        success: true,
        ...shipments,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     Get Shipment Details
     
     This returns:
     - shipment information
     - client
     - exporter
     - consignee
     - allocation
     - ALL invoices
     - packing list
     - containers
     - transits
     - documents
     - created by
     - counts
  =========================================== */

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(
        req.params.id
      );

      const shipment =
        await shipmentService.findById(
          id
        );

      res.status(200).json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     Update Shipment
  =========================================== */

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(
        req.params.id
      );

      const data =
        updateShipmentSchema.parse(
          req.body
        );

      const shipment =
        await shipmentService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Shipment updated successfully.",
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     Delete Shipment
  =========================================== */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(
        req.params.id
      );

      await shipmentService.delete(id);

      res.status(200).json({
        success: true,
        message:
          "Shipment deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ShipmentController();