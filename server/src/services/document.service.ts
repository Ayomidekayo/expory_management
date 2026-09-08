import documentRepository from "../Repository/document.repository";
import shipmentRepository from "../Repository/shipment.repository";
import containerRepository from "../Repository/container.repository";
import packingListRepository from "../Repository/packing-list.repository";
import invoiceRepository from "../Repository/invoice.repository";
import transitRepository from "../Repository/transit.repository";
import allocationRepository from "../Repository/allocation.repository";

import {
  CreateDocumentDto,
  UpdateDocumentDto,
} from "../validations/document.validation";

import {
  DocumentQuery,
} from "../validations/document-query.validation";

import {
  uploadToSupabase,
  deleteFromSupabase,
} from "./supabase-storage.service";
import exporterRepository from "../Repository/exporter.repository";
import clientRepository from "../Repository/client.repository";
import consigneeRepository from "../Repository/consignee.repository";

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
      throw new Error(
        "Please upload a document."
      );
    }

    /*
    =====================================
    Debug Parent IDs
    =====================================
    */

    console.log(
      "Creating document with parent IDs:",
      {
        allocationId:
          data.allocationId,

        shipmentId:
          data.shipmentId,

        containerId:
          data.containerId,

        packingListId:
          data.packingListId,

        invoiceId:
          data.invoiceId,

        transitId:
          data.transitId,

           exporterId: 
        data.exporterId,

       clientId: data.clientId,
       consigneeId: data.consigneeId,
      }

     
    );

    /*
    =====================================
    Validate Parent
    =====================================
    */

    await this.validateParentRecord(data);

    /*
    =====================================
    Upload To Supabase
    =====================================
    */

    const uploaded =
      await uploadToSupabase(file);

    /*
    =====================================
    Create Document
    =====================================
    */

    return documentRepository.create({
      ...data,

      fileName:
        file.originalname,

      originalName:
        file.originalname,

      fileUrl:
        uploaded.fileUrl,

      publicId:
        uploaded.publicId,

      mimeType:
        file.mimetype,

      fileSize:
        file.size,
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

    if (document.publicId) {
      await deleteFromSupabase(
        document.publicId
      );
    }

    return documentRepository.delete(
      id
    );
  }

  /*
  =====================================
  Validate Parent Record
  =====================================
  */

  private async validateParentRecord(
  data: CreateDocumentDto
) {
  /*
  =====================================
  Allocation
  =====================================
  */

  if (data.allocationId) {
    console.log(
      "Checking allocation:",
      data.allocationId
    );

    const allocation =
      await allocationRepository.findById(
        data.allocationId
      );

    console.log(
      "Allocation result:",
      allocation
        ? {
            id: allocation.id,
            allocationNumber:
              allocation.allocationNumber,
          }
        : null
    );

    if (!allocation) {
      throw new Error(
        `Allocation not found: ${data.allocationId}`
      );
    }
  }

  /*
  =====================================
  Shipment
  =====================================
  */

  if (data.shipmentId) {
    const shipment =
      await shipmentRepository.findById(
        data.shipmentId
      );

    if (!shipment) {
      throw new Error(
        `Shipment not found: ${data.shipmentId}`
      );
    }
  }

  /*
  =====================================
  Container
  =====================================
  */

  if (data.containerId) {
    const container =
      await containerRepository.findById(
        data.containerId
      );

    if (!container) {
      throw new Error(
        `Container not found: ${data.containerId}`
      );
    }
  }

  /*
  =====================================
  Packing List
  =====================================
  */

  if (data.packingListId) {
    const packingList =
      await packingListRepository.findById(
        data.packingListId
      );

    if (!packingList) {
      throw new Error(
        `Packing List not found: ${data.packingListId}`
      );
    }
  }

  /*
  =====================================
  Invoice
  =====================================
  */

  if (data.invoiceId) {
    const invoice =
      await invoiceRepository.findById(
        data.invoiceId
      );

    if (!invoice) {
      throw new Error(
        `Invoice not found: ${data.invoiceId}`
      );
    }
  }

  /*
  =====================================
  Transit
  =====================================
  */

  if (data.transitId) {
    const transit =
      await transitRepository.findById(
        data.transitId
      );

    if (!transit) {
      throw new Error(
        `Transit not found: ${data.transitId}`
      );
    }
  }

  /*
  =====================================
  Exporter
  =====================================
  */

  if (data.exporterId) {
    const exporter =
      await exporterRepository.findById(
        data.exporterId
      );

    if (!exporter) {
      throw new Error(
        `Exporter not found: ${data.exporterId}`
      );
    }
  }

  /*
  =====================================
  Client
  =====================================
  */

  if (data.clientId) {
    const client =
      await clientRepository.findById(
        data.clientId
      );

    if (!client) {
      throw new Error(
        `Client not found: ${data.clientId}`
      );
    }
  }

  /*
  =====================================
  Consignee
  =====================================
  */

  if (data.consigneeId) {
    const consignee =
      await consigneeRepository.findById(
        data.consigneeId
      );

    if (!consignee) {
      throw new Error(
        `Consignee not found: ${data.consigneeId}`
      );
    }
  }
}
}

export default new DocumentService();