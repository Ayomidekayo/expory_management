import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createInvoicePaymentSchema,
  updateInvoicePaymentSchema,
} from "../validations/invoice-payment.validation";

import invoicePaymentService from "../services/invoice-payment.service";

class InvoicePaymentController {
  /*
  =====================================
  Create Payment
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createInvoicePaymentSchema.parse(
          req.body
        );

      const result =
        await invoicePaymentService.create(
          data
        );

      return res.status(201).json({
        success: true,
        message:
          "Invoice payment recorded successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Find Payments By Invoice
  =====================================
  */

  async findByInvoiceId(
    req: Request<{ invoiceId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await invoicePaymentService.findByInvoiceId(
          req.params.invoiceId
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Find Payment By ID
  =====================================
  */

  async findById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payment =
        await invoicePaymentService.findById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Payment
  =====================================
  */

  async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        updateInvoicePaymentSchema.parse(
          req.body
        );

      const result =
        await invoicePaymentService.update(
          req.params.id,
          data
        );

      return res.status(200).json({
        success: true,
        message:
          "Invoice payment updated successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Payment
  =====================================
  */

  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await invoicePaymentService.delete(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Invoice payment deleted successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoicePaymentController();