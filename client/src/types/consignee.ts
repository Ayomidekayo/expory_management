import type { TransportMode } from "../enums";


import type { Allocation } from "./allocation.types";
import type { Shipment } from "./shipment.types";

export interface Consignee {
  id: string;

  name: string;

  contactPerson?: string;

  address?: string;

  phone?: string;

  email?: string;

  transporter?: string;

  placeOfLoading: string;

  transitRoute: string;

  portOfDischarge: string;

  transportMode?: TransportMode;

  createdAt: string;

  updatedAt: string;

  allocations?: Allocation[];

  shipments?: Shipment[];

  _count?: {
    allocations: number;
    shipments: number;
  };
}

export interface ConsigneeQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateConsigneeDto {
  name: string;

  contactPerson?: string;

  address?: string;

  phone?: string;

  email?: string;

  transporter?: string;

  placeOfLoading: string;

  transitRoute: string;

  portOfDischarge: string;

  transportMode: "ROAD" | "SEA" | "AIR";
}

export type UpdateConsigneeDto =
  Partial<CreateConsigneeDto>;