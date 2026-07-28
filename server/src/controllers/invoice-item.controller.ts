import {
  Request,
  Response,
  NextFunction,
} from "express";

import invoiceItemService from "../services/invoice-item.service";

import {
  createInvoiceItemSchema,
  updateInvoiceItemSchema,
} from "../validations/invoice-item.validation";

class InvoiceItemController {
  /*
  =====================================
  Create Invoice Item
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const invoiceId = String(
        req.params.invoiceId
      );

      const data =
        createInvoiceItemSchema.parse(
          req.body
        );

      const item =
        await invoiceItemService.createItem(
          invoiceId,
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Invoice item created successfully.",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get Items By Invoice
  =====================================
  */

  async findByInvoice(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const invoiceId = String(
        req.params.invoiceId
      );

      const items =
        await invoiceItemService.getInvoiceItems(
          invoiceId
        );

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Get One Invoice Item
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

      const item =
        await invoiceItemService.getInvoiceItem(
          id
        );

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update Invoice Item
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
        updateInvoiceItemSchema.parse(
          req.body
        );

      const item =
        await invoiceItemService.updateItem(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Invoice item updated successfully.",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Invoice Item
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

      await invoiceItemService.deleteItem(
        id
      );

      res.status(200).json({
        success: true,
        message:
          "Invoice item deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoiceItemController();