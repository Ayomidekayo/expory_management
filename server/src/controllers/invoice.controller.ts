import {
  Request,
  Response,
  NextFunction,
} from "express";

import invoiceService from "../services/invoice.service";

import {
  createInvoiceSchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
} from "../validations/invoice.validation";

import { InvoiceQueryDto } from "../validations/invoice-query.validation";

class InvoiceController {
  /*
  =====================================
  CREATE
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createInvoiceSchema.parse(
          req.body
        );

      const invoice =
        await invoiceService.create(
          data
        );

      res.status(201).json({
        success: true,

        message:
          "Invoice created successfully.",

        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  GET ALL
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        InvoiceQueryDto.parse(
          req.query
        );

      const invoices =
        await invoiceService.findAll(
          query
        );

      res.status(200).json({
        success: true,
        ...invoices,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  GET ONE
  =====================================
  */

  async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id =
        String(req.params.id);

      const invoice =
        await invoiceService.findById(
          id
        );

      res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  UPDATE STATUS
  =====================================
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
        updateInvoiceStatusSchema.parse(
          req.body
        );

      const invoice =
        await invoiceService.updateStatus(
          id,
          status
        );

      res.status(200).json({
        success: true,

        message:
          "Invoice status updated successfully.",

        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  UPDATE
  =====================================
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
        updateInvoiceSchema.parse(
          req.body
        );

      const invoice =
        await invoiceService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,

        message:
          "Invoice updated successfully.",

        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  DELETE
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id =
        String(req.params.id);

      await invoiceService.delete(
        id
      );

      res.status(200).json({
        success: true,

        message:
          "Invoice deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoiceController();