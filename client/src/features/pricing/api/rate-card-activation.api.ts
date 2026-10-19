import api from "../../../lib/axios";

export type ValidationIssue = {
  code: string;
  message: string;
  severity: "ERROR" | "WARNING";
  configurationId?: string;
  componentId?: string;
  weightSlabId?: string;
};

export type RateCardValidationResult = {
  rateCardId: string;
  rateCardName: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isValid: boolean;
  canActivate: boolean;
  summary: { errors: number; warnings: number };
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export async function validateRateCard(rateCardId: string) {
  const response = await api.post<ApiResponse<RateCardValidationResult>>(
    `/rate-cards/${rateCardId}/validate`,
  );
  return unwrap(response);
}

export async function activateRateCard(rateCardId: string) {
  const response = await api.post<ApiResponse<unknown>>(
    `/rate-cards/${rateCardId}/activate`,
  );
  return unwrap(response);
}

export async function archiveRateCard(rateCardId: string) {
  const response = await api.post<ApiResponse<unknown>>(
    `/rate-cards/${rateCardId}/archive`,
  );
  return unwrap(response);
}
