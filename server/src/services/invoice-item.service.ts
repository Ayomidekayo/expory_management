import { prisma } from "../config/prisma";

import invoiceItemRepository from "../Repository/invoice-item.repository";

import {
  CreateInvoiceItemDto,
  UpdateInvoiceItemDto,
} from "../validations/invoice-item.validation";

class InvoiceItemService {
  /*
  =====================================
  Create Invoice Item
  =====================================
  */

  async createItem(
    invoiceId: string,
    data: CreateInvoiceItemDto
  ) {
    /*
    =====================================
    Ensure Invoice Exists
    =====================================
    */

    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id: invoiceId,
        },
      });

    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    /*
    =====================================
    Calculate Total
    =====================================
    */

    const total =
      Number(data.quantity) *
      Number(data.unitPrice);

    /*
    =====================================
    Create Item
    =====================================
    */

    const item =
      await invoiceItemRepository.create(
        invoiceId,
        data,
        total
      );

    /*
    =====================================
    Recalculate Invoice Total
    =====================================
    */

    await invoiceItemRepository.updateInvoiceTotal(
      invoiceId
    );

    return item;
  }

  /*
  =====================================
  Get Invoice Items
  =====================================
  */

  async getInvoiceItems(
    invoiceId: string
  ) {
    return invoiceItemRepository.findByInvoice(
      invoiceId
    );
  }

  /*
  =====================================
  Get Invoice Item
  =====================================
  */

  async getInvoiceItem(id: string) {
    const item =
      await invoiceItemRepository.findById(
        id
      );

    if (!item) {
      throw new Error(
        "Invoice item not found."
      );
    }

    return item;
  }

  /*
  =====================================
  Update Invoice Item
  =====================================
  */

  async updateItem(
    id: string,
    data: UpdateInvoiceItemDto
  ) {
    const existing =
      await this.getInvoiceItem(id);

    const quantity =
      Number(
        data.quantity ??
          existing.quantity
      );

    const unitPrice =
      Number(
        data.unitPrice ??
          existing.unitPrice
      );

    const total =
      quantity * unitPrice;

    const item =
      await invoiceItemRepository.update(
        id,
        data,
        total
      );

    await invoiceItemRepository.updateInvoiceTotal(
      existing.invoiceId
    );

    return item;
  }

  /*
  =====================================
  Delete Invoice Item
  =====================================
  */

  async deleteItem(id: string) {
    const item =
      await this.getInvoiceItem(id);

    await invoiceItemRepository.delete(id);

    await invoiceItemRepository.updateInvoiceTotal(
      item.invoiceId
    );

    return {
      message:
        "Invoice item deleted successfully.",
    };
  }
}

export default new InvoiceItemService();