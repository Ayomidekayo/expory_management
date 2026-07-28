export interface InvoiceItem {
  id: string;

  invoiceId: string;

  description: string;

  quantity: number;

  unitPrice: number;

  total: number;

  createdAt: string;
}