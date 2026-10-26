import api from "../../lib/axios";

// ==============================
// USER TYPES
// ==============================

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: string[];
  phone?: string | null;
}

// ==============================
// LOGIN
// ==============================

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface LoginApiResponse {
  success: boolean;
  message?: string;
  data: AuthResponse;
}

export const login = async (
  data: LoginDto
): Promise<AuthResponse> => {
  const response = await api.post<LoginApiResponse>(
    "/auth/login",
    data
  );

  return response.data.data;
};

// ==============================
// GENERAL REGISTRATION
// ==============================

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

interface RegisterApiResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
}

export const register = async (
  data: RegisterDto
): Promise<RegisterApiResponse> => {
  const response = await api.post<RegisterApiResponse>(
    "/auth/register",
    data
  );

  return response.data;
};

// ==============================
// EXPORTER REGISTRATION
// ==============================

export interface RegisterExporterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const registerExporter = async (
  data: RegisterExporterDto
): Promise<RegisterApiResponse> => {
  const response = await api.post<RegisterApiResponse>(
    "/auth/register/exporter",
    data
  );

  return response.data;
};
export const loginExporter = async (
  data: LoginDto
): Promise<AuthResponse> => {
  const response = await api.post<LoginApiResponse>(
    "/auth/login/exporter",
    data
  );

  return response.data.data;
};
// ==============================
// CURRENT USER
// ==============================

interface CurrentUserResponse {
  success: boolean;
  message?: string;
  data: User;
}

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await api.get<CurrentUserResponse>(
    "/auth/me"
  );

  return response.data;
};




///sub quotation 

export interface SubmitExporterQuoteDto {
  selectedQuoteItemIds: string[];
  customerName?: string;
  email?: string;
  phone?: string;
  customerMessage?: string;
}

export interface SubmitExporterQuoteResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    quoteId: string;
    status: string;
  };
}

export const submitExporterQuote = async (
  quoteId: string,
  data: SubmitExporterQuoteDto,
): Promise<SubmitExporterQuoteResponse> => {
  const response = await api.post<SubmitExporterQuoteResponse>(
    `/quotations/${encodeURIComponent(quoteId)}/submissions`,
    data,
  );

  return response.data;
};