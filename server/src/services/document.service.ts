import fs from "fs";
import path from "path";

import documentRepository from "../Repository/document.repository";
import shipmentRepository from "../Repository/shipment.repository";
import containerRepository from "../Repository/container.repository";
import packingListRepository from "../Repository/packing-list.repository";
import invoiceRepository from "../Repository/invoice.repository";
import transitRepository from "../Repository/transit.repository";

import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from "../validations/document.validation";

import {
  DocumentQuery,
} from "../validations/document-query.validation";
import allocationRepository from "../Repository/allocation.repository";

class DocumentService {
  /*
  =====================================
  Create
  =====================================
  */

  async create(
    file: Express.Multer.File,
    data: CreateDocumentDto
  ) {
    if (!file) {
      throw new Error("Please upload a document.");
    }

    /*
    =====================================
    Validate Parent Record
    =====================================
    */
if (data.allocationId) {

  const allocation =
    await allocationRepository.findById(
      data.allocationId
    );

  if (!allocation) {

    throw new Error(
      "Allocation not found."
    );

  }

}
    if (data.shipmentId) {
      const shipment =
        await shipmentRepository.findById(
          data.shipmentId
        );

      if (!shipment) {
        throw new Error(
          "Shipment not found."
        );
      }
    }

    if (data.containerId) {
      const container =
        await containerRepository.findById(
          data.containerId
        );

      if (!container) {
        throw new Error(
          "Container not found."
        );
      }
    }

    if (data.packingListId) {
      const packingList =
        await packingListRepository.findById(
          data.packingListId
        );

      if (!packingList) {
        throw new Error(
          "Packing List not found."
        );
      }
    }

    if (data.invoiceId) {
      const invoice =
        await invoiceRepository.findById(
          data.invoiceId
        );

      if (!invoice) {
        throw new Error(
          "Invoice not found."
        );
      }
    }

    if (data.transitId) {
      const transit =
        await transitRepository.findById(
          data.transitId
        );

      if (!transit) {
        throw new Error(
          "Transit not found."
        );
      }
    }

    return documentRepository.create({
      ...data,

      fileName: file.filename,

      fileUrl: `/uploads/documents/${file.filename}`,

      mimeType: file.mimetype,

      fileSize: file.size,
    });
  }

  /*
  =====================================
  Find All
  =====================================
  */

  async findAll(
    query: DocumentQuery
  ) {
    return documentRepository.findAll(
      query
    );
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(
    id: string
  ) {
    const document =
      await documentRepository.findById(
        id
      );

    if (!document) {
      throw new Error(
        "Document not found."
      );
    }

    return document;
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    id: string,
    data: UpdateDocumentDto
  ) {
    await this.findById(id);

    return documentRepository.update(
      id,
      data
    );
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(
    id: string
  ) {
    const document =
      await this.findById(id);

    /*
    =====================================
    Delete Physical File
    =====================================
    */

    const filePath = path.join(
      process.cwd(),
      document.fileUrl.replace(
        "/uploads/",
        "uploads/"
      )
    );

    if (
      fs.existsSync(filePath)
    ) {
      fs.unlinkSync(filePath);
    }

    return documentRepository.delete(
      id
    );
  }
}

export default new DocumentService();