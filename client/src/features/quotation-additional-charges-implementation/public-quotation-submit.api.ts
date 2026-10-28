import api from "../../../lib/axios";

export type AdditionalChargeRequestPayload = {
  selectedQuoteItemIds: string[];
  customsChargeRequested: boolean;
  invoiceValue?: number;
  invoiceCurrency?: string;
  transportChargeRequested: boolean;
  customerMessage?: string;
};

export type CreatedQuotationSubmission = {
  id: string;
  quoteId: string;
  status: string;
  submittedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/** Submit the already-calculated quote. The API recalculates the prices itself. */
export async function submitPublicQuoteRequest(
  quoteId: string,
  payload: AdditionalChargeRequestPayload,
): Promise<CreatedQuotationSubmission> {
  const response = await api.post<ApiResponse<CreatedQuotationSubmission>>(
    `/quotations/${encodeURIComponent(quoteId)}/submissions`,
    payload,
  );

  if (!response.data?.success || !response.data.data?.id) {
    throw new Error(response.data?.message || "The quotation request could not be submitted.");
  }

  return response.data.data;
}
