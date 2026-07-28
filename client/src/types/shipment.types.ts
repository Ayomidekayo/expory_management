import type {
  Allocation,
  Client,
  Consignee,
  Exporter,
  Invoice,
  PackingList,
  Container,
  Transit,
  Document,
  User,
} from ".";

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

export interface Shipment {
  id: string;

  shipmentNumber: string;

  shipmentDate: string;

  xfNumber?: string;

  nxpNumber?: string;

  cciNumber?: string;

  eNumber?: string;

  bookingNumber?: string;

  transportMode: TransportMode;

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

  status: ShipmentStatus;

  clientId: string;

  exporterId: string;

  consigneeId: string;

  allocationId?: string;

  createdById: string;

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

export interface CreateShipmentDto {
  shipmentDate: string;

  xfNumber?: string;

  nxpNumber?: string;

  cciNumber?: string;

  eNumber?: string;

  bookingNumber?: string;

  transportMode: TransportMode;

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

  status?: ShipmentStatus;

  clientId: string;

  exporterId: string;

  consigneeId: string;

  allocationId?: string;
}

export interface UpdateShipmentDto
  extends Partial<CreateShipmentDto> {}