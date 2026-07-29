import { Request, Response, NextFunction } from "express";

import allocationService from "../services/allocation.service";

import {
  createAllocationSchema,
  updateAllocationSchema,
} from "../validations/allocation.validation";

import { AllocationQueryDto } from "../validations/allocation-query.validation";


class AllocationController {

async updateStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const allocation =
      await allocationService.updateStatus(
        req.params.id as string,
        req.body.status
      );

    res.status(200).json({
      success: true,
      message:
        "Allocation status updated successfully.",
      data: allocation,
    });
  } catch (error) {
    next(error);
  }
}


  /*
  =====================================
  Create Allocation
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createAllocationSchema.parse(
          req.body
        );

      const allocation =
        await allocationService.create(
          data,
          req.user!.id
        );

      res.status(201).json({
        success: true,
        message:
          "Allocation created successfully.",
        data: allocation,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Allocations
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        AllocationQueryDto.parse(
          req.query
        );

      const allocations =
        await allocationService.findAll(
          query
        );

      res.status(200).json({
        success: true,
        ...allocations,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Allocation
  =====================================
  */

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const allocation =
  await allocationService.findById(
    req.params.id as string
  );

      res.status(200).json({
        success: true,
        data: allocation,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Allocation
  =====================================
  */

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        updateAllocationSchema.parse(
          req.body
        );

      const allocation =
  await allocationService.update(
    req.params.id as string,
    data
  );

      res.status(200).json({
        success: true,
        message:
          "Allocation updated successfully.",
        data: allocation,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Allocation
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
     await allocationService.delete(
  req.params.id as string
);

      res.status(200).json({
        success: true,
        message:
          "Allocation deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AllocationController();