import type { DocumentType } from "./enums";

import type { Shipment } from "./shipment.types";

import type { Container } from "./container.type";

import type { PackingList } from "./packing-list";

import type { Invoice } from "./invoice";
import type { Allocation } from "./allocation.types";
import type { Transit } from "./transit.type";

/*
===========================================
QUERY
===========================================
*/

export interface DocumentQuery {
  page?: number;

  limit?: number;

  search?: string;

  allocationId?: string;

  shipmentId?: string;

  containerId?: string;

  packingListId?: string;

  invoiceId?: string;

  transitId?: string;

  type?: DocumentType;

  sortBy?: "uploadedAt" | "fileName" | "type";

  sortOrder?: "asc" | "desc";
}
// export enum DocumentType {
//   INVOICE = "INVOICE",
//   PACKING_LIST = "PACKING_LIST",
//   NXP = "NXP",
//   XF = "XF",
//   CCI = "CCI",
//   E_NUMBER = "E_NUMBER",
//   TRANSIT_INVOICE = "TRANSIT_INVOICE",
//   OTHER = "OTHER",
// }
/*
===========================================
DOCUMENT
===========================================
*/
export interface Document {
  id: string;
  documentType: DocumentType;
  
  type: DocumentType;

  fileName: string;

  fileUrl: string;

  mimeType?: string;

  fileSize?: number;

  remarks?: string;

  shipmentId?: string;

  allocationId?: string;

  containerId?: string;

  packingListId?: string;

  invoiceId?: string;

  transitId?: string;

  shipment?: Shipment;

  allocation?: Allocation;

  container?: Container;

  packingList?: PackingList;

  invoice?: Invoice;

  transit?: Transit;

  uploadedAt: string;
createdAt: string;
  updatedAt: string;
}

/*
===========================================
CREATE
===========================================
*/

export interface CreateDocumentDto {
  type: DocumentType;

  attachTo:
    | "SHIPMENT"
    | "ALLOCATION"
    | "CONTAINER"
    | "PACKING_LIST"
    | "TRANSIT"
    | "INVOICE";

  remarks?: string;

  shipmentId?: string;

  allocationId?: string;

  containerId?: string;

  packingListId?: string;

  invoiceId?: string;

  transitId?: string;

  file: File;
}

/*
===========================================
UPDATE
===========================================
*/

export type UpdateDocumentDto = Partial<CreateDocumentDto>;
