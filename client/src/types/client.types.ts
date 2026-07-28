export type ClientType =
  | "COMPANY"
  | "INDIVIDUAL";

export interface Client {
  id: string;

  clientCode: string;

  companyName: string;

  clientType: ClientType;

  contactPerson?: string;

  email?: string;

  phone?: string;

  alternatePhone?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  website?: string;

  taxNumber?: string;

  remarks?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  _count: {
    allocations: number;
    shipments: number;
  };

  allocations?: any[];

  shipments?: any[];
}

export interface CreateClientDto {
  companyName: string;

  clientType: ClientType;

  contactPerson?: string;

  email?: string;

  phone?: string;

  alternatePhone?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  website?: string;

  taxNumber?: string;

  remarks?: string;
}

export interface UpdateClientDto
  extends Partial<CreateClientDto> {}

export interface ClientQuery {
  page?: number;

  limit?: number;

  search?: string;

  clientType?: ClientType;

  country?: string;

  isActive?: boolean;
}