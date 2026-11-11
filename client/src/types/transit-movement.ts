
export type Currency = "NGN" | "USD" | "EUR" | "CFA";

export type TransitDirection = "IN" | "OUT";

export type TransitMovementItemType = "TRUCK" | "CONTAINER";

export type PaymentStatus =
  | "UNPAID"
  | "ADVANCE"
  | "PARTIALLY_PAID"
  | "PAID";

export type ItemPaymentType = "ADVANCE" | "REGULAR";

export interface TransitMovementQuery {
  page?: number;
  limit?: number;
  search?: string;
  direction?: TransitDirection;
  shipmentId?: string;
  sortBy?:
    | "transitDate"
    | "transitNumber"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export type TransitMovementColumnKey =
  | "itemDate"
  | "itemType"
  | "name"
  | "clientName"
  | "frontPlateNumber"
  | "backPlateNumber"
  | "containerName"
  | "containerNumber"
  | "chargeAmount"
  | "chargeCurrency"
  | "remarks";

export interface CreateTransitMovementItemPayload {
  itemDate: string;
  itemType: TransitMovementItemType;
  name?: string;
  clientName: string;

  frontPlateNumber?: string;
  backPlateNumber?: string;

  containerName?: string;
  containerNumber?: string;

  chargeAmount: number;
  chargeCurrency: Currency;
  remarks?: string;
}

export interface UpdateTransitMovementItemPayload
  extends CreateTransitMovementItemPayload {
  id?: string;
}

export interface CreateTransitMovementPayload {
  transitDate: string;
  direction: TransitDirection;
  shipmentId?: string | null;
  remarks?: string;
  items: CreateTransitMovementItemPayload[];
}

export interface UpdateTransitMovementPayload {
  transitDate?: string;
  shipmentId?: string | null;
  remarks?: string;
  items?: UpdateTransitMovementItemPayload[];
}

export interface TransitMovementPayment {
  id: string;
  transitMovementItemId: string;
  recordedById?: string | null;
  amount: number | string;
  paymentType: ItemPaymentType;
  paymentDate: string;
  paymentMethod?: string | null;
  reference?: string | null;
  description?: string | null;
  notes?: string | null;
  recordedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransitMovementPaymentPayload {
  amount: number;
  paymentType: ItemPaymentType;
  paymentDate?: string;
  paymentMethod?: string;
  reference?: string;
  description?: string;
  notes?: string;
}

export interface TransitMovementItem {
  id: string;
  transitMovementId: string;
  itemDate: string;
  itemType: TransitMovementItemType;
  name?: string | null;
  clientName: string;

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

  payments: TransitMovementPayment[];

  createdAt: string;
  updatedAt: string;
}

export interface TransitMovement {
  id: string;
  transitNumber: string;
  transitDate: string;
  direction: TransitDirection;

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

  items: TransitMovementItem[];

  _count?: {
    items: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface TransitMovementPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransitMovementListResponse {
  success: boolean;
  message: string;
  data: TransitMovement[];
  pagination: TransitMovementPagination;
}

export interface TransitMovementColumnLock {
  id: string;
  columnKey: TransitMovementColumnKey;
  isLocked: boolean;
  lockedAt?: string | null;
  lockReason?: string | null;
  lockedById?: string | null;
}




export interface TransitMovementQuery {
  page?: number;
  limit?: number;
  search?: string;
  direction?: TransitDirection;
  clientName?: string;
  shipmentId?: string;
  association?: "LINKED" | "INDEPENDENT";
  fromDate?: string;
  toDate?: string;
  isLocked?: "true" | "false";
  sortBy?:
    | "transitDate"
    | "transitNumber"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "asc" | "desc";
}

