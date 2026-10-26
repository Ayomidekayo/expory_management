
import api from "../../../lib/axios";

export type QuotationStatus =
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ARCHIVED";

export interface ExporterQuoteItem {
  id: string;
  componentName: string;
  componentCode: string | null;
  quantity: string | number;
  rateApplied: string | number;
  lineTotal: string | number;
  isSelected: boolean;
}

export interface QuotationMessage {
  id: string;
  message: string;
  senderType: "ADMIN" | "EXPORTER";
  senderUserId: string | null;
  createdAt: string;
}

export interface QuotationAttachment {
  id: string;
  fileName: string;
  originalName: string | null;
  fileUrl: string;
  mimeType: string | null;
  fileSize: number | null;
  remarks: string | null;
  createdAt: string;
  uploadedByType?: "ADMIN" | "EXPORTER";
}

export interface ExporterSubmission {
  id: string;
  quoteId: string;
  status: QuotationStatus;
  customerName: string | null;
  currency: string;
  subtotal: string | number;
  totalAmount: string | number;
  customerMessage: string | null;
  adminMessage: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  approvedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;

  quote: {
    quoteNumber: string;
    goodsDescription: string | null;
    hsCode: string | null;
    weightKg: string | number | null;
    rateCard: {
      name: string;
      mode: string;
      direction: string;
    };
  };

  items: ExporterQuoteItem[];
  messages?: QuotationMessage[];
  attachments?: QuotationAttachment[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function getMySubmissions(): Promise<ExporterSubmission[]> {
  const response = await api.get<ApiResponse<ExporterSubmission[]>>(
    "/quotations/mine",
  );

  return response.data.data;
}

export async function getMySubmission(
  id: string,
): Promise<ExporterSubmission> {
  const response = await api.get<ApiResponse<ExporterSubmission>>(
    `/quotations/mine/${encodeURIComponent(id)}`,
  );

  return response.data.data;
}

export async function sendExporterMessage(
  submissionId: string,
  message: string,
): Promise<QuotationMessage> {
  const response = await api.post<ApiResponse<QuotationMessage>>(
    `/quotations/mine/${encodeURIComponent(submissionId)}/messages`,
    { message },
  );

  return response.data.data;
}

export async function uploadExporterAttachment(
  submissionId: string,
  file: File,
  remarks?: string,
): Promise<QuotationAttachment> {
  const formData = new FormData();

  formData.append("file", file);

  if (remarks?.trim()) {
    formData.append("remarks", remarks.trim());
  }

  const response = await api.post<ApiResponse<QuotationAttachment>>(
    `/quotations/mine/${encodeURIComponent(submissionId)}/attachments`,
    formData,
  );

  return response.data.data;
}

export interface QuotationAttachment {
  id: string;
  fileName: string;
  originalName: string | null;
  fileUrl: string;
  mimeType: string | null;
  fileSize: number | null;
  remarks: string | null;
  createdAt: string;
  uploadedByType?: "EXPORTER" | "ADMIN";
}

export interface QuotationMessage {
  id: string;
  senderType: "EXPORTER" | "ADMIN";
  message: string;
  createdAt: string;
  attachments: QuotationAttachment[];
}



export async function sendExporterSubmissionMessage(
  submissionId: string,
  message: string,
) {
  const response = await api.post(
    `/quotations/mine/${encodeURIComponent(submissionId)}/messages`,
    { message },
  );

  return response.data.data;
}

export async function uploadExporterSubmissionAttachment(
  submissionId: string,
  file: File,
  remarks?: string,
) {
  const formData = new FormData();
  formData.append("file", file);

  if (remarks?.trim()) {
    formData.append("remarks", remarks.trim());
  }

  const response = await api.post(
    `/quotations/mine/${encodeURIComponent(submissionId)}/attachments`,
    formData,
  );

  return response.data.data;
}

export async function uploadAdminSubmissionAttachment(
  submissionId: string,
  file: File,
  remarks?: string,
) {
  const formData = new FormData();
  formData.append("file", file);

  if (remarks?.trim()) {
    formData.append("remarks", remarks.trim());
  }

  const response = await api.post(
    `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/attachments`,
    formData,
  );

  return response.data.data;
}