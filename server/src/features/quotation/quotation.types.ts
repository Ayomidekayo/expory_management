import { QuoteDirection, QuoteMode } from "../../generated";

export type CalculateQuoteInput = {
  rateCardId: string;
  configurationId: string;
  weightKg?: number;
  customsValue?: number;
  freightAmount?: number;
  quantity?: number;
  goodsDescription?: string;
  hsCode?: string;
  optionIds?: string[];
  airlineId?: string;
  transportSelected?: boolean;
  nafdacSelected?: boolean;
};

export type PublicRateCardFilters = {
  mode?: QuoteMode;
  direction?: QuoteDirection;
};

export type SubmitQuoteInput = {
  selectedQuoteItemIds: string[];
  customerMessage?: string;
  customerName?: string;
  email?: string;
  phone?: string;

   customsChargeRequested?: boolean;
  /** Commercial invoice value used by operations for customs assessment. */
  invoiceValue?: number;
  invoiceCurrency?: string;
  transportChargeRequested?: boolean;
};

export type CalculatedLine = {
  componentId: string;
  componentName: string;
  componentCode: string | null;
  calculationType: string;
  calculationBasis: string | null;
  unit: string | null;
  quantity: number;
  rateApplied: number;
  lineTotal: number;
  isTaxable: boolean;
  isOptional: boolean;
  isEstimate: boolean;
  requiresReview: boolean;
  remarks: string | null;
};


export const QUOTATION_SUBMISSION_STATUSES = [
  "PENDING_REVIEW",
  "CHANGES_REQUESTED",
  "APPROVED",
  "REJECTED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
] as const;

export type QuotationSubmissionStatus =
  (typeof QUOTATION_SUBMISSION_STATUSES)[number];

