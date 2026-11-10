import type { Request, Response, NextFunction } from "express";
import { createTransportPaymentSchema } from "../validations/transport-payment.validation";
import { transportPaymentService } from "../services/transport-payment.service";
import { updateTransportSchema } from "../validations/transport.validation";
import transportService from "../services/transport.service";
import { ApiError } from "../utils/ApiError";

export const transportPaymentController = {
  async findPayments(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
  const itemId = String(req.params.itemId ?? "");
      const result =
        await transportPaymentService.findPayments(itemId);

      res.status(200).json({
        success: true,
        message: "Transport payments retrieved successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async createPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const itemId = String(req.params.itemId ?? "");

      const payload = createTransportPaymentSchema.parse(req.body);

      // Change this if your authentication middleware exposes
      // the authenticated user's ID under a different property.
      const recordedById = req.user?.id;

      const result = await transportPaymentService.createPayment(
        itemId,
        payload,
        recordedById,
      );

      res.status(201).json({
        success: true,
        message: "Payment recorded successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};



export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transportId = String(req.params.id ?? "");

    console.log("========== UPDATE TRANSPORT ==========");
    console.log("Transport ID:", transportId);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request body:", req.body);
    console.log("======================================");

    if (!transportId) {
      throw new ApiError(400, "Transport ID is required");
    }

    if (!req.body || typeof req.body !== "object") {
      throw new ApiError(400, "Request body is missing or invalid");
    }

    const validatedData = updateTransportSchema.parse(req.body);

    const transport = await transportService.update(
      transportId,
      validatedData,
      req.user?.id
    );

    return res.status(200).json({
      success: true,
      message: "Transport updated successfully",
      data: transport,
    });
  } catch (error) {
    next(error);
  }
};

