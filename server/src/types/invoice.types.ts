export interface CreateInvoiceItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
}

export type UpdateInvoiceItemDto = CreateInvoiceItemDto;

export interface CreateInvoiceDto {
  shipmentId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  currency: string;
  numberOfTrucks: number;
  freight: number;
  items: CreateInvoiceItemDto[];
}

export interface UpdateInvoiceDto {
  invoiceNumber?: string;
  invoiceDate?: Date;
  currency?: string;
  numberOfTrucks?: number;
  freight?: number;
  items?: UpdateInvoiceItemDto[];
}