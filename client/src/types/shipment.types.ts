import type { Allocation } from "./allocation.types";
import type { Client } from "./client.types";
import type { Consignee } from "./consignee";
import type { Container } from "./container.type";
import type { Exporter } from "./exporter.types";
import type { Invoice } from "./invoice";
import type { PackingList } from "./packing-list";
import type { Transit } from "./transit.type";
import type { User } from "./user";

/*
=====================================
Enums
=====================================
*/

export type ShipmentStatus =
  | "DRAFT"
  | "READY"
  | "BOOKED"
  | "LOADED"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "CUSTOMS_CLEARANCE"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type TransportMode =
  | "ROAD"
  | "SEA"
  | "AIR"
  | "RAIL";

/*
=====================================
Shipment
=====================================
*/

export interface Shipment {
  id: string;

  shipmentNumber: string;

  shipmentDate: string;

  clientId: string;
  exporterId: string;
  consigneeId: string;
  allocationId?: string;

  createdById: string;

  transportMode: TransportMode;

  status: ShipmentStatus;

  xfNumber?: string;
  nxpNumber?: string;
  cciNumber?: string;
  eNumber?: string;

  bookingNumber?: string;

  shippingLine?: string;
  vesselName?: string;
  voyageNumber?: string;

  portOfLoading?: string;
  portOfDischarge?: string;

  expectedDeparture?: string;
  expectedArrival?: string;

  actualDeparture?: string;
  actualArrival?: string;

  remarks?: string;

  client: Client;
  exporter: Exporter;
  consignee: Consignee;
  allocation?: Allocation;

  invoice?: Invoice;
  packingList?: PackingList;

  containers: Container[];

  transits: Transit[];

  documents: Document[];

  createdBy: User;

  createdAt: string;

  updatedAt: string;

  _count: {
    containers: number;
    documents: number;
    transits: number;
  };
}

/*
=====================================
Queries
=====================================
*/

export interface ShipmentQuery {
  page?: number;

  limit?: number;

  search?: string;

  status?: ShipmentStatus;

  transportMode?: TransportMode;

  clientId?: string;

  exporterId?: string;

  consigneeId?: string;

  allocationId?: string;

  sortBy?:
    | "shipmentDate"
    | "shipmentNumber"
    | "createdAt";

  sortOrder?: "asc" | "desc";
}

/*
=====================================
Create
=====================================
*/

export interface CreateShipmentDto {
  shipmentDate: string;

  clientId: string;

  exporterId: string;

  consigneeId: string;

  allocationId?: string;

  transportMode: TransportMode;

  status?: ShipmentStatus;

  xfNumber?: string;

  nxpNumber?: string;

  cciNumber?: string;

  eNumber?: string;

  bookingNumber?: string;

  shippingLine?: string;

  vesselName?: string;

  voyageNumber?: string;

  portOfLoading?: string;

  portOfDischarge?: string;

  expectedDeparture?: string;

  expectedArrival?: string;

  actualDeparture?: string;

  actualArrival?: string;

  remarks?: string;
}

/*
=====================================
Update
=====================================
*/

export type UpdateShipmentDto =
  Partial<CreateShipmentDto>;