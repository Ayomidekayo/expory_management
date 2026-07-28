export interface Exporter {
  id: string;

  name: string;

  address?: string;

  phone?: string;

  email?: string;

  contactPerson?: string;

  createdAt: string;

  updatedAt: string;
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