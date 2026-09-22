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

      console.log(
        "\n========================================"
      );
      console.log(
        "CREATE INVOICE ITEM"
      );
      console.log(
        "========================================"
      );

      console.log(
        "Invoice ID:",
        invoiceId
      );

      console.log(
        "RAW REQUEST BODY:",
        req.body
      );

      console.log(
        "RAW ITEM DATE:",
        req.body?.itemDate
      );

      /*
      =====================================
      Validate Request
      =====================================
      */

      const data =
        createInvoiceItemSchema.parse(
          req.body
        );

      console.log(
        "VALIDATED DATA:",
        data
      );

      console.log(
        "VALIDATED ITEM DATE:",
        data.itemDate
      );

      /*
      =====================================
      Create Item
      =====================================
      */

      const item =
        await invoiceItemService.createItem(
          invoiceId,
          data
        );

      console.log(
        "CREATED INVOICE ITEM:",
        item
      );

      console.log(
        "SAVED ITEM DATE:",
        item.itemDate
      );

      console.log(
        "========================================\n"
      );

      res.status(201).json({
        success: true,
        message:
          "Invoice item created successfully.",
        data: item,
      });
    } catch (error) {
      console.error(
        "\n========================================"
      );

      console.error(
        "CREATE INVOICE ITEM ERROR"
      );

      console.error(
        "========================================"
      );

      console.error(error);

      console.error(
        "========================================\n"
      );

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

      console.log(
        "\n========================================"
      );

      console.log(
        "GET INVOICE ITEMS"
      );

      console.log(
        "Invoice ID:",
        invoiceId
      );

      const items =
        await invoiceItemService.getInvoiceItems(
          invoiceId
        );

      console.log(
        "INVOICE ITEMS:",
        items
      );

      console.log(
        "ITEM COUNT:",
        items.length
      );

      console.table(
        items.map((item) => ({
          id: item.id,

          invoiceId:
            item.invoiceId,

          itemDate:
            item.itemDate,

          description:
            item.description,

          quantity:
            item.quantity,

          unitPrice:
            item.unitPrice,

          total:
            item.total,
        }))
      );

      console.log(
        "========================================\n"
      );

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.error(
        "GET INVOICE ITEMS ERROR:",
        error
      );

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

      console.log(
        "GET INVOICE ITEM:",
        id
      );

      const item =
        await invoiceItemService.getInvoiceItem(
          id
        );

      console.log(
        "INVOICE ITEM RESULT:",
        item
      );

      console.log(
        "ITEM DATE:",
        item.itemDate
      );

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error(
        "GET INVOICE ITEM ERROR:",
        error
      );

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

      console.log(
        "\n========================================"
      );

      console.log(
        "UPDATE INVOICE ITEM"
      );

      console.log(
        "Invoice Item ID:",
        id
      );

      console.log(
        "RAW REQUEST BODY:",
        req.body
      );

      console.log(
        "RAW ITEM DATE:",
        req.body?.itemDate
      );

      /*
      =====================================
      Validate
      =====================================
      */

      const data =
        updateInvoiceItemSchema.parse(
          req.body
        );

      console.log(
        "VALIDATED UPDATE DATA:",
        data
      );

      console.log(
        "VALIDATED ITEM DATE:",
        data.itemDate
      );

      /*
      =====================================
      Update
      =====================================
      */

      const item =
        await invoiceItemService.updateItem(
          id,
          data
        );

      console.log(
        "UPDATED INVOICE ITEM:",
        item
      );

      console.log(
        "SAVED ITEM DATE:",
        item.itemDate
      );

      console.log(
        "========================================\n"
      );

      res.status(200).json({
        success: true,
        message:
          "Invoice item updated successfully.",
        data: item,
      });
    } catch (error) {
      console.error(
        "\n========================================"
      );

      console.error(
        "UPDATE INVOICE ITEM ERROR"
      );

      console.error(
        "========================================"
      );

      console.error(error);

      console.error(
        "========================================\n"
      );

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

      console.log(
        "DELETE INVOICE ITEM:",
        id
      );

      await invoiceItemService.deleteItem(
        id
      );

      console.log(
        "INVOICE ITEM DELETED:",
        id
      );

      res.status(200).json({
        success: true,
        message:
          "Invoice item deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE INVOICE ITEM ERROR:",
        error
      );

      next(error);
    }
  }
}

export default new InvoiceItemController();