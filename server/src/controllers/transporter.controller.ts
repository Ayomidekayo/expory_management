import type {
  Request,
  Response,
  NextFunction,
} from "express";
import { TransporterService } from "../services/transporter.service";
import { createTransporterPaymentSchema, createTransporterSchema, transporterIdSchema, transporterItemParamsSchema, transporterItemSchema, transporterQuerySchema, updateTransporterItemSchema, updateTransporterSchema } from "../validations/transporter.validation";




type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
    userId?: string;
  };
};
export class TransporterController {
  constructor(
    private readonly service: TransporterService
  ) {}
getItemPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = transporterItemParamsSchema.safeParse(
      req.params
    );

    if (!params.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid transporter item parameters.",
      });
    }

    const result = await this.service.getItemPayments(
      params.data.id,
      params.data.itemId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

recordPayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = transporterItemParamsSchema.safeParse(
      req.params
    );

    const body = createTransporterPaymentSchema.safeParse(
      req.body
    );

    if (!params.success || !body.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment data.",
        errors: body.success
          ? undefined
          : body.error.flatten(),
      });
    }

    const recordedById =
      req.user?.id ?? req.user?.userId;

    if (!recordedById) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const result = await this.service.recordPayment(
      params.data.id,
      params.data.itemId,
      body.data,
      recordedById
    );

    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = transporterQuerySchema.safeParse(
        req.query
      );

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter query parameters.",
          errors: parsed.error.flatten(),
        });
      }

      const result = await this.service.findAll(
        parsed.data
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = transporterIdSchema.safeParse(
        req.params
      );

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter ID.",
        });
      }

      const result = await this.service.findById(
        parsed.data.id
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = createTransporterSchema.safeParse(
        req.body
      );

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter data.",
          errors: parsed.error.flatten(),
        });
      }

      const result = await this.service.create(
        parsed.data
      );

      return res.status(201).json({
        success: true,
        message: "Transporter created successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = transporterIdSchema.safeParse(
        req.params
      );

      const body = updateTransporterSchema.safeParse(
        req.body
      );

      if (!params.success || !body.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter update data.",
          errors: body.success
            ? undefined
            : body.error.flatten(),
        });
      }

      const result = await this.service.update(
        params.data.id,
        body.data
      );

      return res.status(200).json({
        success: true,
        message: "Transporter updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const parsed = transporterIdSchema.safeParse(
        req.params
      );

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter ID.",
        });
      }

      await this.service.delete(parsed.data.id);

      return res.status(200).json({
        success: true,
        message: "Transporter deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  addItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = transporterIdSchema.safeParse(
        req.params
      );

      const body = transporterItemSchema.safeParse(
        req.body
      );

      if (!params.success || !body.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter item data.",
          errors: body.success
            ? undefined
            : body.error.flatten(),
        });
      }

      const result = await this.service.addItem(
        params.data.id,
        body.data
      );

      return res.status(201).json({
        success: true,
        message: "Transporter item added successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = transporterItemParamsSchema.safeParse(
        req.params
      );

      const body = updateTransporterItemSchema.safeParse(
        req.body
      );

      if (!params.success || !body.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter item update data.",
          errors: body.success
            ? undefined
            : body.error.flatten(),
        });
      }

      const result = await this.service.updateItem(
        params.data.id,
        params.data.itemId,
        body.data
      );

      return res.status(200).json({
        success: true,
        message: "Transporter item updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params = transporterItemParamsSchema.safeParse(
        req.params
      );

      if (!params.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transporter item parameters.",
        });
      }

      await this.service.deleteItem(
        params.data.id,
        params.data.itemId
      );

      return res.status(200).json({
        success: true,
        message: "Transporter item deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };
}