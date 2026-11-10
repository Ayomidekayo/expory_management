
export type Currency = "NGN" | "USD" | "EUR" | "CFA";

export type TransportItemType =
  | "TRUCK"
  | "CONTAINER";

export type PaymentStatus =
  | "UNPAID"
  | "ADVANCE"
  | "PARTIALLY_PAID"
  | "PAID";

export interface TransportQuery {
  page?: number;
  limit?: number;
  search?: string;
  shipmentId?: string;
  sortBy?:
    | "transportDate"
    | "transportNumber"
    | "createdAt";
  sortOrder?: "asc" | "desc";
}

export type TransportColumnKey =
  | "itemDate"
  | "itemType"
  | "name"
  | "ownerName"
  | "frontPlateNumber"
  | "backPlateNumber"
  | "containerName"
  | "containerNumber"
  | "chargeAmount"
  | "chargeCurrency"
  | "paymentStatus"
  | "remarks";

export interface CreateTransportItemPayload {
  itemDate: string;
  itemType: TransportItemType;
  name?: string;
  ownerName: string;

  frontPlateNumber?: string;
  backPlateNumber?: string;

  containerName?: string;
  containerNumber?: string;

  chargeAmount: number;
  chargeCurrency: Currency;
  remarks?: string;
  
}

export interface UpdateTransportItemPayload
  extends CreateTransportItemPayload {
  id?: string;
}

export interface CreateTransportPayload {
  shipmentId?: string | null;
  transportDate: string;
  remarks?: string;
  items: CreateTransportItemPayload[];
}

export interface UpdateTransportPayload {
  shipmentId?: string | null;
  transportDate?: string;
  remarks?: string;
  items?: UpdateTransportItemPayload[];
}

export interface TransportPayment {
  id: string;
  amount: number | string;
  paymentType: "ADVANCE" | "REGULAR";
  paymentDate: string;
  paymentMethod?: string | null;
  reference?: string | null;
  description?: string | null;
  notes?: string | null;
}

export interface TransportItem {
  id: string;
  transportId: string;
  itemDate: string;
  itemType: TransportItemType;
  name?: string | null;
  ownerName: string;

  frontPlateNumber?: string | null;
  backPlateNumber?: string | null;

  containerName?: string | null;
  containerNumber?: string | null;

  chargeAmount: number | string;
  chargeCurrency: Currency;
  paymentStatus: PaymentStatus;

  remarks?: string | null;

  isLocked: boolean;
  lockedFields: string[];
  lockedAt?: string | null;

  payments: TransportPayment[];

  createdAt: string;
  updatedAt: string;
}

export interface Transport {
  id: string;
  transportNumber: string;
  transportDate: string;

  shipmentId?: string | null;

  shipment?: {
    id: string;
    shipmentNumber: string;
    shipmentDate: string;
    client?: {
      id: string;
      companyName: string;
    } | null;
  } | null;

  remarks?: string | null;

  isLocked: boolean;
  lockedAt?: string | null;

  items: TransportItem[];
_count?: {
  items: number;
};
  createdAt: string;
  updatedAt: string;
}
