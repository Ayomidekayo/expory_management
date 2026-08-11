/* ===========================================
   ENUMS
=========================================== */

import type { Document } from "./document";
import type { PackingList } from "./packing-list";
import type { Shipment } from "./shipment.types";
import type { Transit } from "./transit.type";

/* ===========================================
   CONTAINER TYPE
=========================================== */

export type ContainerType =
  | "DRY"
  | "REEFER"
  | "OPEN_TOP"
  | "FLAT_RACK"
  | "TANK";

/* ===========================================
   CONTAINER SIZE
=========================================== */

export type ContainerSize =
  | "FT20"
  | "FT40"
  | "FT40_HC"
  | "FT45";

/* ===========================================
   CONTAINER STATUS
=========================================== */

export type ContainerStatus =
  | "EMPTY"
  | "LOADED"
  | "IN_TRANSIT"
  | "DELIVERED";

/* ===========================================
   TERMINAL CHARGE STATUS
=========================================== */

export type TerminalChargeStatus =
  | "UNPAID"
  | "PAID";

/* ===========================================
   CONTAINER
=========================================== */

export interface Container {
  id: string;

  shipmentId: string;

  shipment: Shipment;

  packingListId?: string | null;

  packingList?: PackingList | null;

  containerNumber: string;

  sealNumber?: string | null;

  containerType: ContainerType;

  containerSize: ContainerSize;

  grossWeight?: number | null;

  netWeight?: number | null;

  tareWeight?: number | null;

  volume?: number | null;

  loadingLocation?: string | null;

  destination?: string | null;

  status: ContainerStatus;

  terminalChargeStatus: TerminalChargeStatus;
  terminalChargeAmount?: number | null;

  shippingLine?: string | null;

  bookingReference?: string | null;

  containerCondition?: string | null;

  transits: Transit[];

  documents: Document[];

  createdAt: string;

  updatedAt: string;

  _count?: {
    transits: number;
    documents: number;
  };
}

/* ===========================================
   CREATE DTO
=========================================== */

export interface CreateContainerDto {
  shipmentId: string;

  packingListId?: string;

  containerNumber: string;

  sealNumber?: string;

  containerType: ContainerType;

  containerSize: ContainerSize;

  grossWeight?: number;

  netWeight?: number;

  tareWeight?: number;

  volume?: number;

  loadingLocation?: string;

  destination?: string;

  status?: ContainerStatus;

  terminalChargeStatus?: TerminalChargeStatus;

  shippingLine?: string;

  bookingReference?: string;

  containerCondition?: string;
}

/* ===========================================
   UPDATE DTO
=========================================== */

export type UpdateContainerDto =
  Partial<CreateContainerDto>;

/* ===========================================
   QUERY
=========================================== */

export interface ContainerQuery {
  page?: number;

  limit?: number;

  search?: string;

  shipmentId?: string;

  packingListId?: string;

  status?: ContainerStatus;

  terminalChargeStatus?: TerminalChargeStatus;

  containerType?: ContainerType;

  containerSize?: ContainerSize;

  sortBy?:
    | "createdAt"
    | "containerNumber"
    | "grossWeight"
    | "status"
    | "terminalChargeStatus";

  sortOrder?: "asc" | "desc";
}