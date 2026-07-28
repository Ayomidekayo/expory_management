import type { TransportMode } from "./enums";
import type { Shipment } from "./shipment.types";
import type { Container } from "./container.type";

export interface Transit {
  id: string;

  transitNumber: string;

  shipmentId: string;
  shipment: Shipment;

  containerId: string;
  container: Container;

  origin: string;

  destination: string;

  transportMode: TransportMode;

  transporter?: string;

  transitInvoice?: string;

  agentNumber?: string;

  exporterNumber?: string;

  wibNumber?: string;

  quantity?: number;

  description?: string;

  unitPrice?: number;

  totalPrice?: number;

  documents: Document[];

  createdAt: string;

  updatedAt: string;

  _count?: {
    documents: number;
  };
}

export interface CreateTransitDto {
  shipmentId: string;

  containerId: string;

  origin: string;

  destination: string;

  transportMode: TransportMode;

  transporter?: string;

  transitInvoice?: string;

  agentNumber?: string;

  exporterNumber?: string;

  wibNumber?: string;

  quantity?: number;

  description?: string;

  unitPrice?: number;

  totalPrice?: number;
}
export interface TransitQuery {
  page?: number;

  limit?: number;

  search?: string;

  shipmentId?: string;

  containerId?: string;

  transportMode?: "ROAD" | "SEA" | "AIR";

  sortBy?:
    | "createdAt"
    | "origin"
    | "destination"
    | "transportMode"
    | "quantity"
    | "totalPrice";

  sortOrder?: "asc" | "desc";
}
export type UpdateTransitDto =
  Partial<CreateTransitDto>;