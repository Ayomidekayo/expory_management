import {
  Request,
  Response,
  NextFunction,
} from "express";

import packingListService from "../services/packing-list.service";

import {
  createPackingListSchema,
  updatePackingListSchema,
} from "../validations/packing-list.validation";

import {
  PackingListQueryDto,
} from "../validations/packing-list-query.validation";

class PackingListController {
  /*
  =====================================
  Create Packing List
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createPackingListSchema.parse(
          req.body
        );

      const packingList =
        await packingListService.create(
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Packing list created successfully.",
        data: packingList,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Packing Lists
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        PackingListQueryDto.parse(
          req.query
        );

      const packingLists =
        await packingListService.findAll(
          query
        );

      res.status(200).json({
        success: true,
        ...packingLists,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Packing List
  =====================================
  */

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(
        req.params.id
      );

      const packingList =
        await packingListService.findById(
          id
        );

      res.status(200).json({
        success: true,
        data: packingList,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Packing List
  =====================================
  */

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
        updatePackingListSchema.parse(
          req.body
        );

      const packingList =
        await packingListService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Packing list updated successfully.",
        data: packingList,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Packing List
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(
        req.params.id
      );

      await packingListService.delete(
        id
      );

      res.status(200).json({
        success: true,
        message:
          "Packing list deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PackingListController();