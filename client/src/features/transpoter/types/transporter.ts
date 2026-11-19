export type Currency = "NGN" | "USD" | "EUR" | "CFA";
export type TransportItemType = "TRUCK" | "CONTAINER";
export type PaymentStatus = "UNPAID" | "ADVANCE" | "PARTIALLY_PAID" | "PAID";
export type ItemPaymentType = "ADVANCE" | "REGULAR";
export type TransporterStatus =
  | "PENDING"
  | "LOADING"
  | "IN_TRANSIT"
  | "OFFLOADING"
  | "COMPLETED"
  | "CANCELLED";

export interface TransporterPayment {
  id: string;
  transportItemId: string;
  recordedById?: string | null;
  amount: number | string;
  paymentType: ItemPaymentType;
  paymentDate: string;
  paymentMethod?: string | null;
  reference?: string | null;
  description?: string | null;
  notes?: string | null;
  recordedBy?: { id: string; name?: string | null; email?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransporterItem {
  id: string;
  transporterId: string;
  itemDate: string;
  itemType: TransportItemType;
  name?: string | null;
  frontPlateNumber?: string | null;
  backPlateNumber?: string | null;
  containerName?: string | null;
  containerNumber?: string | null;
  status: TransporterStatus;
  chargeAmount: number | string;
  chargeCurrency: Currency;
  paymentStatus: PaymentStatus;
  remarks?: string | null;
  isLocked: boolean;
  lockedFields: string[];
  lockedAt?: string | null;
  payments: TransporterPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface Transporter {
  id: string;
  transportNumber: string;
  transportDate: string;
  truckOwnerName: string;
  shipmentId?: string | null;
  shipment?: { id: string; shipmentNumber: string } | null;
  remarks?: string | null;
  isLocked: boolean;
  lockedAt?: string | null;
  updatedById?: string | null;
  createdAt: string;
  updatedAt: string;
  items: TransporterItem[];
  _count?: { items: number };
}

export interface TransporterItemInput {
  itemDate: string;
  itemType: TransportItemType;
  name?: string;
  frontPlateNumber?: string;
  backPlateNumber?: string;
  containerName?: string;
  containerNumber?: string;
  status: TransporterStatus;
  chargeAmount: number;
  chargeCurrency: Currency;
  paymentStatus?: PaymentStatus;
  remarks?: string;
}

export interface CreateTransporterPayload {
  transportDate: string;
  truckOwnerName: string;
  shipmentId?: string | null;
  remarks?: string;
  items: TransporterItemInput[];
}

export interface UpdateTransporterPayload {
  transportNumber?: string;
  transportDate?: string;
  truckOwnerName?: string;
  shipmentId?: string | null;
  remarks?: string | null;
}

export interface UpdateTransporterItemPayload {
  itemDate?: string;
  itemType?: TransportItemType;
  name?: string | null;
  frontPlateNumber?: string | null;
  backPlateNumber?: string | null;
  containerName?: string | null;
  containerNumber?: string | null;
  status?: TransporterStatus;
  chargeAmount?: number;
  chargeCurrency?: Currency;
  paymentStatus?: PaymentStatus;
  remarks?: string | null;
}

export interface TransporterPaymentPayload {
  amount: number;
  paymentType: ItemPaymentType;
  paymentDate?: string;
  paymentMethod?: string;
  reference?: string;
  description?: string;
  notes?: string;
}

export interface TransporterQuery {
  page: number;
  limit: number;
  search?: string;
  shipmentId?: string;
  status?: TransporterStatus;
  itemType?: TransportItemType;
  sortBy?: "transportDate" | "transportNumber" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransporterListResponse {
  success: boolean;
  data: Transporter[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
