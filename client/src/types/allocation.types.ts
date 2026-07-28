import type {
  Client,
} from "./client.types";
import type { Consignee } from "./consignee";

import type {
  Exporter,
} from "./exporter.types";
import type { User } from "./user";


/* ===========================================
   ENUMS
=========================================== */

export type AllocationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type AllocationPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export type ServiceType =
  | "EXPORT_DOCUMENTATION"
  | "CUSTOMS_CLEARANCE"
  | "FREIGHT_FORWARDING"
  | "HAULAGE"
  | "CONTAINER_BOOKING"
  | "INSPECTION"
  | "WAREHOUSING"
  | "INSURANCE"
  | "OTHER";

export type TransportMode =
  | "ROAD"
  | "SEA"
  | "AIR"
  | "RAIL";

/* ===========================================
   ALLOCATION
=========================================== */

export interface Allocation {
  id: string;

  allocationNumber: string;

  clientId: string;
  exporterId?: string | null;
  consigneeId?: string | null;

  serviceType: ServiceType;

  priority: AllocationPriority;

  status: AllocationStatus;

  cargoDescription: string;
  cargoType?: string;
  commodityCode?: string;
  commodityName?: string;

  quantity?: number;
  packageType?: string;
  numberOfPackages?: number;

  grossWeight?: number;
  netWeight?: number;
  volume?: number;

  originCountry?: string;
  originCity?: string;

  pickupAddress?: string;
  pickupDate?: string;

  destinationCountry: string;
  destinationCity?: string;

  portOfLoading?: string;
  portOfDischarge?: string;

  transportMode?: TransportMode;

  shippingLine?: string;

  incoterm?: string;

  deliveryAddress?: string;

  expectedShipmentDate?: string;

  estimatedValue?: number;

  currency?: string;

  paymentTerms?: string;

  freightType?: string;

  insuranceRequired: boolean;

  specialInstruction?: string;

  internalRemark?: string;

  destinationPort?: string;

  createdById: string;

  assignedToId?: string;

  approvedById?: string;

  assignedAt?: string;

  approvedAt?: string;

  completedAt?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  client: Client;

  exporter?: Exporter;

  consignee?: Consignee;

  createdBy: User;

  assignedTo?: User;

  approvedBy?: User;

  shipment?: any;

  documents?: any[];

  _count: {
    documents: number;
  };
}

/* ===========================================
   CREATE DTO
=========================================== */

export interface CreateAllocationDto {
  clientId: string;

  exporterId?: string;

  consigneeId?: string;

  serviceType: ServiceType;

  priority: AllocationPriority;

  cargoDescription: string;

  cargoType?: string;

  commodityCode?: string;

  commodityName?: string;

  quantity?: number;

  packageType?: string;

  numberOfPackages?: number;

  grossWeight?: number;

  netWeight?: number;

  volume?: number;

  originCountry?: string;

  originCity?: string;

  pickupAddress?: string;

  pickupDate?: string;

  destinationCountry: string;

  destinationCity?: string;

  portOfLoading?: string;

  portOfDischarge?: string;

  transportMode?: TransportMode;

  shippingLine?: string;

  incoterm?: string;

  deliveryAddress?: string;

  expectedShipmentDate?: string;

  estimatedValue?: number;

  currency?: string;

  paymentTerms?: string;

  freightType?: string;

  insuranceRequired?: boolean;

  specialInstruction?: string;

  internalRemark?: string;

  destinationPort?: string;

  assignedToId?: string;
}

/* ===========================================
   UPDATE DTO
=========================================== */

export type UpdateAllocationDto =
  Partial<CreateAllocationDto>;

/* ===========================================
   QUERY
=========================================== */

export interface AllocationQuery {
  page?: number;

  limit?: number;

  search?: string;

  status?: AllocationStatus;

  priority?: AllocationPriority;

  serviceType?: ServiceType;

  clientId?: string;

  exporterId?: string;

  consigneeId?: string;

  assignedToId?: string;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}