/* ===========================================
   INVOICE ITEM
=========================================== */

export interface InvoiceItem {
  id: string;

  invoiceId: string;

  description: string;

  hsCode?: string;

  packageType?: string;

  packages?: number;

  grossWeight?: number;

  netWeight?: number;

  quantity: number;

  unit?: string;

  unitPrice: number;

  total: number;

  remarks?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreateInvoiceItemDto {
  description: string;

  hsCode?: string;

  packageType?: string;

  packages?: number;

  grossWeight?: number;

  netWeight?: number;

  quantity: number;

  unit?: string;

  unitPrice: number;

  remarks?: string;
}