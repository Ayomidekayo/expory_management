import { InvoiceStatus } from "../generated";

import invoiceRepository from "../Repository/invoice.repository";

import shipmentRepository from "../Repository/shipment.repository";

import { ApiError } from "../utils/ApiError";

import { InvoiceQuery } from "../validations/invoice-query.validation";

import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from "../validations/invoice.validation";

class InvoiceService {
  /*
  =====================================
  Generate Invoice Number
  =====================================
  */

  private async generateInvoiceNumber() {
    const year = new Date().getFullYear();

    const latest =
      await invoiceRepository.findLatestInvoice();

    if (!latest) {
      return `INV-${year}-00001`;
    }

    const sequence = Number(
      latest.invoiceNumber.split("-")[2]
    );

    return `INV-${year}-${String(
      sequence + 1
    ).padStart(5, "0")}`;
  }

  /*
  =====================================
  Create Invoice
  =====================================
  */

  async create(
    data: CreateInvoiceDto
  ) {
    /*
    =====================================
    Ensure Shipment Exists
    =====================================
    */

    const shipment =
      await shipmentRepository.findById(
        data.shipmentId
      );

    if (!shipment) {
      throw new ApiError(
        404,
        "Shipment not found."
      );
    }

    /*
    =====================================
    IMPORTANT:
    DO NOT CHECK WHETHER THE SHIPMENT
    ALREADY HAS AN INVOICE.

    One shipment can now have MANY invoices.
    =====================================
    */

    const invoiceNumber =
      await this.generateInvoiceNumber();

    /*
    =====================================
    Create Invoice
    =====================================
    */

    return invoiceRepository.create({
      ...data,
      invoiceNumber,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: InvoiceQuery
  ) {
    return invoiceRepository.findAll(
      query
    );
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(id: string) {
    const invoice =
      await invoiceRepository.findById(
        id
      );

    if (!invoice) {
      throw new ApiError(
        404,
        "Invoice not found."
      );
    }

    return invoice;
  }

  /*
  =====================================
  Update Status
  =====================================
  */

  async updateStatus(
    id: string,
    status: InvoiceStatus
  ) {
    /*
    Make sure invoice exists.
    */

    await this.findById(id);

    return invoiceRepository.updateStatus(
      id,
      status
    );
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateInvoiceDto
  ) {
    /*
    Make sure invoice exists.
    */

    await this.findById(id);

    return invoiceRepository.update(
      id,
      data
    );
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    /*
    Make sure invoice exists.
    */

    await this.findById(id);

    return invoiceRepository.delete(id);
  }
}

export default new InvoiceService();