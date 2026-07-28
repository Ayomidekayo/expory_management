import type { Container } from "./container.type";
import type { Shipment, Document } from "./index";

export interface PackingListQuery {
  page?: number;

  limit?: number;

  search?: string;

  shipmentId?: string;

  sortBy?: "packingDate" | "packingListNumber" | "createdAt";

  sortOrder?: "asc" | "desc";
}
export interface PackingListItem {
  id: string;

  description: string;

  packageType?: string;

  packages?: number;

  grossWeight?: number;

  netWeight?: number;

  remarks?: string;

  createdAt: string;

  updatedAt: string;
}

export interface PackingList {
  id: string;

  shipmentId: string;

  shipment: Shipment;

  packingListNumber: string;

  packingDate: string;

  packageType?: string;

  totalPackages?: number;

  grossWeight: number;

  netWeight: number;

  marksAndNumbers?: string;

  remarks?: string;

  items: PackingListItem[];

  documents: Document[];

  containers: Container[];

  createdAt: string;

  updatedAt: string;

  _count?: {
    items: number;

    documents: number;

    containers: number;
  };
}
