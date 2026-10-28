import api from "../../../lib/axios";

export type QuotationStatus =
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ARCHIVED";

export interface AdminQuotationItem {
  id: string;
  componentName: string;
  componentCode: string | null;
  quantity: number | string;
  rateApplied: number | string;
  lineTotal: number | string;
  isSelected: boolean;
  /** SERVICE for original quote lines; other types are priced by operations. */
  itemType?: "SERVICE" | "CUSTOMS_CHARGE" | "TRANSPORT_CHARGE";
}

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

export interface AdminQuotationMessage {
  id: string;
  senderType: "ADMIN" | "EXPORTER";
  message: string;
  createdAt: string;
  attachments?: AdminQuotationAttachment[];
}

/**
 * Nested quote/exporter values are optional because older records or API
 * responses may not contain every related object. The UI should remain usable
 * and report incomplete details instead of crashing.
 */
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
  customsChargeRequested?: boolean;
  invoiceValue?: number | string | null;
  invoiceCurrency?: string | null;
  transportChargeRequested?: boolean;
  vatEnabled?: boolean;
  vatPercentage?: number | string;
  customerMessage: string | null;
  adminMessage: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  exporter?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  quote?: {
    id: string;
    quoteNumber: string;
    goodsDescription: string | null;
    hsCode: string | null;
    weightKg: number | string | null;
    quantity: number | string | null;
    requiresReview: boolean;
    inputSnapshot?: unknown;
    rateCard: {
      name: string;
      mode: string;
      direction: string;
      configurations?: Array<{
        id: string;
        name: string;
        code: string;
        routeLabel: string | null;
        routeCode: string | null;
        equipmentType: string | null;
        options: Array<{ id: string; name: string; code: string }>;
      }>;
    } | null;
  } | null;
  items?: AdminQuotationItem[];
  messages?: AdminQuotationMessage[];
  attachments?: AdminQuotationAttachment[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export async function getAdminQuotations(): Promise<AdminQuotation[]> {
  const response = await api.get<ApiResponse<AdminQuotation[]>>(
    "/admin/quotations/submissions",
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function updateAdminQuotationStatus(
  submissionId: string,
  status: QuotationStatus,
  note?: string,
): Promise<void> {
  await api.patch(
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/status`,
    { status, note: note?.trim() || undefined },
  );
}

export type UpdateQuotationChargesInput = {
  customsChargeAmount?: number | null;
  transportChargeAmount?: number | null;
};

export async function updateAdminQuotationCharges(
  submissionId: string,
  payload: UpdateQuotationChargesInput,
): Promise<void> {
  await api.patch(
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/charges`,
    payload,
  );
}

export async function sendAdminQuotationMessage(
  submissionId: string,
  message: string,
): Promise<void> {
  await api.post(
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/messages`,
    { message: message.trim() },
  );
}

export async function uploadAdminQuotationAttachment(
  submissionId: string,
  file: File,
  remarks?: string,
): Promise<AdminQuotationAttachment> {
  const formData = new FormData();
  // Must match quotationUpload.single("file") in Express.
  formData.append("file", file);
  if (remarks?.trim()) formData.append("remarks", remarks.trim());

  const response = await api.post<ApiResponse<AdminQuotationAttachment>>(
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/attachments`,
    formData,
  );

  return response.data.data;
}
