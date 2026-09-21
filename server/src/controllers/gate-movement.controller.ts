import {
  Request,
  Response,
  NextFunction,
} from "express";

import gateMovementService from "../services/gate-movement.service";

import {
  createGateMovementSchema,
  updateGateMovementSchema,
  updateGateStatusSchema,
} from "../validations/gate-movement.validation";

import {
  GateMovementStatus,
  GateType,
} from "../generated";

class GateMovementController {
  /*
  =========================================
  CREATE
  =========================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createGateMovementSchema.parse(
          req.body
        );

      const movement =
        await gateMovementService.create(
          data
        );

      res.status(201).json({
        success: true,

        message:
          "Gate movement recorded successfully.",

        data: movement,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =========================================
  FIND ALL
  =========================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        gateType,
        status,
        containerNumber,
        yardStoreNumber,
      } = req.query;

      const movements =
        await gateMovementService.findAll({
          gateType:
            gateType
              ? (String(
                  gateType
                ) as GateType)
              : undefined,

          status:
            status
              ? (String(
                  status
                ) as GateMovementStatus)
              : undefined,

          containerNumber:
            containerNumber
              ? String(
                  containerNumber
                )
              : undefined,

          yardStoreNumber:
            yardStoreNumber
              ? String(
                  yardStoreNumber
                )
              : undefined,
        });

      res.status(200).json({
        success: true,

        data: movements,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =========================================
  FIND ONE
  =========================================
  */

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id =
        String(req.params.id);

      const movement =
        await gateMovementService.findById(
          id
        );

      res.status(200).json({
        success: true,

        data: movement,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =========================================
  UPDATE
  =========================================
  */

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id =
        String(req.params.id);

      const data =
        updateGateMovementSchema.parse(
          req.body
        );

      const movement =
        await gateMovementService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,

        message:
          "Gate movement updated successfully.",

        data: movement,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =========================================
  UPDATE STATUS
  =========================================
  */

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id =
        String(req.params.id);

      const { status } =
        updateGateStatusSchema.parse(
          req.body
        );

      const movement =
        await gateMovementService.updateStatus(
          id,
          status
        );

      res.status(200).json({
        success: true,

        message:
          "Gate movement status updated successfully.",

        data: movement,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =========================================
  DELETE
  =========================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id =
        String(req.params.id);

      await gateMovementService.delete(
        id
      );

      res.status(200).json({
        success: true,

        message:
          "Gate movement deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =========================================
  STATISTICS
  =========================================
  */

  async statistics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const statistics =
        await gateMovementService.getStatistics();

      res.status(200).json({
        success: true,

        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GateMovementController();