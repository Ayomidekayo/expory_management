import type { QuoteDirection, QuoteMode } from "../../../generated";

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
