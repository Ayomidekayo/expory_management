export type QuoteMode = "AIR" | "LAND" | "SEA";
export type QuoteDirection = "IMPORT" | "EXPORT";

export interface PublicRateCard {
  id: string;
  name: string;
  mode: QuoteMode;
  direction: QuoteDirection;
}

export interface PublicOption {
  id: string;
  code: string;
  name: string;
  isActive?: boolean;
}

export interface PublicAirline {
  id: string;
  code: string;
  name: string;
  isActive?: boolean;
  ratePerKg: string | number;
}

export interface PublicConfiguration {
  id: string;
  name: string;
  code: string;
  currency: string;
  routeLabel?: string | null;
  equipmentType?: string | null;
  weightEnabled: boolean;
  quantityEnabled: boolean;
  customsValueEnabled: boolean;
  freightAmountEnabled: boolean;
  airlineSelectorEnabled: boolean;
  transportEnabled: boolean;
  nafdacEnabled: boolean;
  vatEnabled: boolean;
  vatPercentage?: string | number;
  options: PublicOption[];
  airlines: PublicAirline[];
  services: Array<{
    id: string;
    name: string;
    code?: string | null;
    calculationType: string;
    isOptional?: boolean;
    isTaxable?: boolean;
    optionId?: string | null;
    pricingSectionId?: string | null;
    unit?: string | null;
  }>;
}

export interface PublicConfigurationsResponse {
  id: string;
  name: string;
  mode: QuoteMode;
  direction: QuoteDirection;
  configurations: PublicConfiguration[];
}

export interface CalculateQuoteInput {
  rateCardId: string;
  configurationId: string;
  optionIds: string[];
  airlineId?: string;
  weightKg?: number;
  quantity?: number;
  customsValue?: number;
  freightAmount?: number;
  goodsDescription?: string;
  hsCode?: string;
  nafdacRequired?: boolean;
  transportRequired?: boolean;
}

export interface CalculatedQuoteLine {
  quoteItemId: string;
  componentName: string;
  componentCode?: string | null;
  quantity: number;
  unit?: string | null;
  lineTotal: number;
  remarks?: string | null;
  isEstimate: boolean;
  requiresReview: boolean;
}

export interface CalculatedQuote {
  quoteId: string;
  quoteNumber: string;
  status: string;
  rateCard: { id: string; name: string; mode: QuoteMode; direction: QuoteDirection };
  configuration: { id: string; name: string; currency: string };
  lines: CalculatedQuoteLine[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  requiresReview: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}
