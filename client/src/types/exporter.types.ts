// export interface Exporter {
//   id: string;

//   name: string;

//   address?: string;

//   phone?: string;

//   email?: string;

//   contactPerson?: string;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface CreateExporterDto {
//   name: string;

//   address?: string;

//   phone?: string;

//   email?: string;

//   contactPerson?: string;
// }

// export interface UpdateExporterDto
//   extends Partial<CreateExporterDto> {}


export interface Exporter {
  id: string;

  name: string;

  address?: string;

  phone?: string;

  email?: string;

  contactPerson?: string;

  createdAt: string;

  updatedAt: string;

  _count: {
    allocations: number;
    shipments: number;
  };

  allocations?: any[];

  shipments?: any[];
}

export interface CreateExporterDto {
  name: string;

  address?: string;

  phone?: string;

  email?: string;

  contactPerson?: string;
}

export interface UpdateExporterDto
  extends Partial<CreateExporterDto> {}

export interface ExporterQuery {
  search?: string;

  page?: number;

  limit?: number;
}