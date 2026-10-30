import api from "../../../lib/axios";


export type QuotationNotification = {
  id: string;
  quoteId: string;
  submissionId: string | null;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export type QuotationHistoryEvent = {
  id: string;
  action: string;
  actorUserId: string | null;
  actorType: string;
  details: unknown;
  createdAt: string;
};

export type QuotationHistoryResponse = {
  submissionId: string;
  quoteId: string;
  quoteNumber: string;
  events: QuotationHistoryEvent[];
};

type ApiResponse<T> = { success: boolean; message?: string; data: T };

export async function getQuotationNotifications() {
  const response = await api.get<ApiResponse<{ notifications: QuotationNotification[]; unreadCount: number }>>(
    "/quotations/notifications",
  );
  return response.data.data;
}

export async function markQuotationNotificationRead(notificationId: string) {
  const response = await api.patch<ApiResponse<QuotationNotification>>(
    `/quotations/notifications/${encodeURIComponent(notificationId)}/read`,
  );
  return response.data.data;
}

export async function getQuotationHistory(
  submissionId: string,
  audience: "admin" | "exporter",
) {
  const base = audience === "admin"
    ? `/admin/quotations/submissions/${encodeURIComponent(submissionId)}/history`
    : `/quotations/mine/${encodeURIComponent(submissionId)}/history`;
  const response = await api.get<ApiResponse<QuotationHistoryResponse>>(base);
  return response.data.data;
}
