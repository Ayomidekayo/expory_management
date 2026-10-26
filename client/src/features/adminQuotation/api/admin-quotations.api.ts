import api from "../../../lib/axios";

/* =========================================================
   STATUS
========================================================= */

export type QuotationStatus =
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ARCHIVED";

/* =========================================================
   ATTACHMENTS
========================================================= */

export interface AdminQuotationAttachment {
  id: string;
  fileName: string;
  originalName: string | null;
  fileUrl: string;
  mimeType: string | null;
  fileSize: number | null;
  remarks: string | null;
  uploadedByType: "ADMIN" | "EXPORTER";
  createdAt: string;
}

/* =========================================================
   MESSAGES
========================================================= */

export interface AdminQuotationMessage {
  id: string;
  senderType: "ADMIN" | "EXPORTER";
  message: string;
  createdAt: string;
  attachments?: AdminQuotationAttachment[];
}

/* =========================================================
   SHIPMENT OPTIONS AND CONFIGURATIONS
========================================================= */

export interface AdminQuotationOption {
  id: string;
  name: string;
  code: string;
}

export interface AdminQuotationConfiguration {
  id: string;
  name: string;
  code: string;
  routeLabel: string | null;
  routeCode: string | null;
  equipmentType: string | null;
  options: AdminQuotationOption[];
}

export interface AdminQuotationShipmentDetails {
  mode: string | null;
  direction: string | null;

  configurationId: string | null;
  configurationName: string | null;
  shipmentOption: string | null;

  routeLabel: string | null;
  routeCode: string | null;
  equipmentType: string | null;

  selectedOptions: AdminQuotationOption[];
}

/* =========================================================
   EXPORTER
========================================================= */

export interface AdminQuotationExporter {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

/* =========================================================
   RATE CARD
========================================================= */

export interface AdminQuotationRateCard {
  id?: string;
  name: string;
  mode: string;
  direction: string;
  configurations?: AdminQuotationConfiguration[];
}

/* =========================================================
   ORIGINAL QUOTE

   Keep all quote-related properties in this single interface.
========================================================= */

export interface AdminQuotationQuote {
  id: string;
  quoteNumber: string;

  goodsDescription: string | null;
  hsCode: string | null;

  weightKg: number | string | null;
  quantity: number | string | null;

  customsValue?: number | string | null;
  freightAmount?: number | string | null;

  /**
   * Optional because the current backend query may not
   * retrieve a validity date.
   */
  validUntil?: string | null;

  notes?: string | null;

  requiresReview: boolean;

  inputSnapshot?: unknown;
  pricingSnapshot?: unknown;

  rateCard: AdminQuotationRateCard | null;
}

/* =========================================================
   QUOTATION SERVICE ITEMS
========================================================= */

export interface AdminQuotationItem {
  id: string;
  componentName: string;
  componentCode: string | null;

  quantity: number | string;
  rateApplied: number | string;
  lineTotal: number | string;

  isSelected: boolean;
}

/* =========================================================
   ADMIN QUOTATION SUBMISSION

   IMPORTANT:
   The quote property is declared exactly once here.
========================================================= */

export interface AdminQuotation {
  id: string;
  quoteId: string;
  status: QuotationStatus;

  customerName: string | null;
  email: string | null;
  phone: string | null;

  currency: string;

  subtotal: number | string;
  taxAmount: number | string;
  totalAmount: number | string;

  customerMessage: string | null;
  adminMessage: string | null;

  submittedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;

  createdAt: string;
  updatedAt: string;

  exporter?: AdminQuotationExporter | null;

  quote?: AdminQuotationQuote | null;

  items?: AdminQuotationItem[];

  messages?: AdminQuotationMessage[];

  attachments?: AdminQuotationAttachment[];

  shipmentDetails?: AdminQuotationShipmentDetails;
}

/* =========================================================
   API RESPONSE
========================================================= */

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* =========================================================
   GET ADMIN QUOTATIONS
========================================================= */

export async function getAdminQuotations(): Promise<AdminQuotation[]> {
  const response = await api.get<ApiResponse<AdminQuotation[]>>(
    "/admin/quotations/submissions",
  );

  return Array.isArray(response.data.data)
    ? response.data.data
    : [];
}

/* =========================================================
   UPDATE QUOTATION STATUS
========================================================= */

export async function updateAdminQuotationStatus(
  submissionId: string,
  status: QuotationStatus,
  note?: string,
): Promise<void> {
  await api.patch(
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/status`,
    {
      status,
      note: note?.trim() || undefined,
    },
  );
}

/* =========================================================
   SEND ADMIN MESSAGE
========================================================= */

export async function sendAdminQuotationMessage(
  submissionId: string,
  message: string,
): Promise<void> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error("Message cannot be empty.");
  }

  await api.post(
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/messages`,
    {
      message: trimmedMessage,
    },
  );
}

/* =========================================================
   UPLOAD QUOTATION ATTACHMENT
========================================================= */

export async function uploadAdminQuotationAttachment(
  submissionId: string,
  file: File,
  remarks?: string,
): Promise<AdminQuotationAttachment> {
  if (!submissionId.trim()) {
    throw new Error("A quotation submission ID is required.");
  }

  if (!(file instanceof File)) {
    throw new Error("Please select a valid document.");
  }

  const formData = new FormData();

  // Must match quotationUpload.single("file") in Express.
  formData.append("file", file, file.name);

  if (remarks?.trim()) {
    formData.append("remarks", remarks.trim());
  }

  const endpoint =
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/attachments`;

  const response = await api.post<
    ApiResponse<AdminQuotationAttachment>
  >(endpoint, formData);

  return response.data.data;
}