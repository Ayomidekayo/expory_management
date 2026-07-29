import type { TransportMode } from "../enums";



export interface Consignee {
  id: string;

  name: string;

  contactPerson?: string;

  address?: string;

  phone?: string;

  email?: string;

  transporter?: string;

  placeOfLoading: string;

  transitRoute: string;

  portOfDischarge: string;

  transportMode?: TransportMode;

  createdAt: string;

  updatedAt: string;
}
export interface ConsigneeQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
export interface CreateConsigneeDto {
  name: string;

  contactPerson?: string;

  address?: string;

  phone?: string;

  email?: string;

  transporter?: string;

  placeOfLoading: string;

  transitRoute: string;

  portOfDischarge: string;

  transportMode:
    | "ROAD"
    | "SEA"
    | "AIR";
}

export type UpdateConsigneeDto =
  Partial<CreateConsigneeDto>;