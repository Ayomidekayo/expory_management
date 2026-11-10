
import {
  Request,
  Response,
  NextFunction,
} from "express";

import transportService from "../services/transport.service";

import {
  createTransportSchema,
  updateTransportSchema,
} from "../validations/transport.validation";

import {
  TransportQueryDto,
} from "../validations/transport-query.validation";
import { updateTransportColumnLockSchema } from "../validations/transport-column-lock.validation";
import { ApiError } from "../utils/ApiError";

class TransportController {
  /* ===========================================
     CREATE TRANSPORT
  =========================================== */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createTransportSchema.parse(req.body);

      const transport =
        await transportService.create(data);

      res.status(201).json({
        success: true,
        message: "Transport created successfully.",
        data: transport,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     GET ALL TRANSPORTS
  =========================================== */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        TransportQueryDto.parse(req.query);

      const transports =
        await transportService.findAll(query);

      res.status(200).json({
        success: true,
        ...transports,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     GET ONE TRANSPORT
  =========================================== */

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const transport =
        await transportService.findById(id);

      res.status(200).json({
        success: true,
        data: transport,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
     UPDATE TRANSPORT
  =========================================== */

 
async update(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id ?? "");

    console.log("========== TRANSPORT UPDATE ==========");
    console.log("ID:", id);
    console.log("Method:", req.method);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    console.log("======================================");

    if (!id) {
      throw new ApiError(400, "Transport ID is required.");
    }

    if (!req.body || typeof req.body !== "object") {
      throw new ApiError(400, "Request body is missing.");
    }

    const data = updateTransportSchema.parse(req.body);



    const transport = await transportService.update(
      id,
      data,
      req.user?.id
    );

    return res.status(200).json({
      success: true,
      message: "Transport updated successfully.",
      data: transport,
    });
  } catch (error) {
    next(error);
  }
}


  /* ===========================================
     DELETE TRANSPORT
  =========================================== */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      await transportService.delete(id);

      res.status(200).json({
        success: true,
        message: "Transport deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  /* ===========================================
   GET COLUMN LOCKS
=========================================== */

async getColumnLocks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await transportService.getColumnLocks();

    res.status(200).json({
      success: true,
      message: "Transport column locks retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
}

/* ===========================================
   UPDATE COLUMN LOCK
=========================================== */

async updateColumnLock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const columnKey = String(req.params.columnKey ?? "");

    if (!columnKey) {
      throw new ApiError(400, "Transport column key is required.");
    }

    const payload =
      updateTransportColumnLockSchema.parse(req.body);

    const userId = req.user?.id;

    const data = await transportService.updateColumnLock(
      columnKey,
      payload,
      userId,
    );

    res.status(200).json({
      success: true,
      message: payload.isLocked
        ? "Transport column locked successfully."
        : "Transport column unlocked successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
}




/* ===========================================
   LOCK / UNLOCK TRANSPORT ITEM
=========================================== */

async updateItemLock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const itemId = String(req.params.itemId ?? "");

    if (!itemId) {
      throw new ApiError(400, "Transport item ID is required.");
    }

    const { isLocked } = req.body ?? {};

    if (typeof isLocked !== "boolean") {
      throw new ApiError(
        400,
        "isLocked must be a boolean value.",
      );
    }

    const data = await transportService.updateItemLock(
      itemId,
      isLocked,
    );

    return res.status(200).json({
      success: true,
      message: isLocked
        ? "Transport item locked successfully."
        : "Transport item unlocked successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
}

}

export default new TransportController();
