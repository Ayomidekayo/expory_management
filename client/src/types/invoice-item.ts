/* ===========================================
   INVOICE ITEM
=========================================== */

export interface InvoiceItem {
  id: string;

  invoiceId: string;

  /**
   * Date associated with this specific
   * invoice item.
   *
   * Stored by the backend as a DateTime
   * and returned as an ISO string.
   */
  itemDate: string;

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

/* ===========================================
   CREATE INVOICE ITEM
=========================================== */

export interface CreateInvoiceItemDto {
  /**
   * Date entered from the invoice item form.
   *
   * Example:
   * "2026-09-22"
   */
  itemDate: string;

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