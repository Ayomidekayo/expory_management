import axios from "axios";
import type {
  ApiEnvelope,
  CalculateQuoteInput,
  CalculatedQuote,
  PublicConfigurationsResponse,
  PublicRateCard,
  QuoteDirection,
  QuoteMode,
} from "../types/public-quotation.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  if (!response.data?.success) {
    throw new Error(response.data?.message ?? "Unable to load quotation data.");
  }
  return response.data.data;
}

/**
 * Attach the active session only to protected submission requests.
 * Public rate-card/configuration/calculation requests remain public.
 */
function getSubmissionAuthConfig() {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")
      : null;

  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
}

export const publicQuotationApi = {
  async listRateCards(mode: QuoteMode, direction: QuoteDirection) {
    const response = await api.get<ApiEnvelope<PublicRateCard[]>>(
      "/public/quotations/rate-cards",
      { params: { mode, direction } },
    );
    return unwrap(response);
  },

  async getConfigurations(rateCardId: string) {
    const response = await api.get<ApiEnvelope<PublicConfigurationsResponse>>(
      `/public/quotations/rate-cards/${encodeURIComponent(rateCardId)}/configurations`,
    );
    return unwrap(response);
  },

  async calculate(input: CalculateQuoteInput) {
    const response = await api.post<ApiEnvelope<CalculatedQuote>>(
      "/public/quotations/calculate",
      input,
    );
    return unwrap(response);
  },
};

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

export async function submitPublicQuoteRequest(
  quoteId: string,
  payload: AdditionalChargeRequestPayload,
): Promise<CreatedQuotationSubmission> {
  const response = await api.post<ApiResponse<CreatedQuotationSubmission>>(
    `/quotations/${encodeURIComponent(quoteId)}/submissions`,
    payload,
    getSubmissionAuthConfig(),
  );

  if (!response.data?.success || !response.data.data?.id) {
    throw new Error(
      response.data?.message || "The quotation request could not be submitted.",
    );
  }

  return response.data.data;
}
