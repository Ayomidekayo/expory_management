export type QuoteMode = "AIR" | "LAND" | "SEA";

export type QuoteDirection = "IMPORT" | "EXPORT";

export type RateCardStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type RateCalculationType =
  | "FIXED"
  | "PER_UNIT"
  | "PERCENTAGE"
  | "WEIGHT_SLAB"
  | "VARIABLE";

export type CalculationBasis =
  | "WEIGHT"
  | "QUANTITY"
  | "CUSTOMS_VALUE"
  | "FREIGHT_AMOUNT"
  | "SUBTOTAL"
  | "CONTAINER"
  | "SHIPMENT"
  | "MANUAL";

export type PricingCurrency = "NGN" | "USD" | "EUR" | "GBP" | "CFA";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RateCardConfiguration {
  id: string;
  rateCardId: string;
  name: string;
  code: string;
  currency: string;

  routeCode?: string | null;
  routeLabel?: string | null;
  equipmentType?: string | null;

  // Configuration features
  weightEnabled: boolean;
  freightAmountEnabled: boolean;
  customsValueEnabled: boolean;
  quantityEnabled: boolean;

  airlineSelectorEnabled: boolean;
  transportEnabled: boolean;
  nafdacEnabled: boolean;

  // VAT configuration
  vatEnabled: boolean;
  vatPercentage: number | string;
  vatCalculationBasis?:
    | "SUBTOTAL"
    | "CUSTOMS_VALUE"
    | "FREIGHT_AMOUNT"
    | null;

  isActive: boolean;
  displayOrder: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface RateComponent {
  id: string;
  rateCardId: string;
  configurationId?: string | null;
  name: string;
  code?: string | null;
  calculationType: RateCalculationType;
  calculationBasis: CalculationBasis;
  unit?: string | null;
  value?: number | string | null;
  percentage?: number | string | null;
  isActive: boolean;
  isOptional: boolean;
  isTaxable: boolean;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeightSlabRate {
  id?: string;
  componentId: string;
  amount: number | string;
}

export interface WeightSlab {
  id: string;
  rateCardId: string;
  configurationId?: string | null;
  label: string;
  minWeight: number | string;
  maxWeight: number | string | null;
  displayOrder: number;
  rates?: WeightSlabRate[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RateCard {
  id: string;
  name: string;
  mode: QuoteMode;
  direction: QuoteDirection;
  status: RateCardStatus;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  configurations?: RateCardConfiguration[];
  components?: RateComponent[];
  weightSlabs?: WeightSlab[];
}

export interface CreateRateCardInput {
  name: string;
  mode: QuoteMode;
  direction: QuoteDirection;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export type UpdateRateCardInput = Partial<CreateRateCardInput>;

export interface CreateRateConfigurationInput {
  name: string;
  code: string;
  currency: string;
  routeCode?: string | null;
  routeLabel?: string | null;
  equipmentType?: string | null;
  airlineSelectorEnabled?: boolean;
  transportEnabled?: boolean;
  nafdacEnabled?: boolean;
  vatEnabled?: boolean;
  vatPercentage?: number;
  isActive?: boolean;
  displayOrder?: number;
  weightEnabled?: boolean;
freightAmountEnabled?: boolean;
customsValueEnabled?: boolean;
quantityEnabled?: boolean;

vatCalculationBasis?:
  | "SUBTOTAL"
  | "CUSTOMS_VALUE"
  | "FREIGHT_AMOUNT"
  | null;
}

export type UpdateRateConfigurationInput =
  Partial<CreateRateConfigurationInput>;

export interface CreateRateComponentInput {
  configurationId: string;
  name: string;
  code?: string;
  calculationType: RateCalculationType;
  calculationBasis: CalculationBasis;
  unit?: string;
  value?: number;
  percentage?: number;
  isActive?: boolean;
  isOptional?: boolean;
  isTaxable?: boolean;
  notes?: string;
}

export type UpdateRateComponentInput =
  Partial<CreateRateComponentInput>;

export interface CreateWeightSlabInput {
  configurationId: string;
  label: string;
  minWeight: number;
  maxWeight?: number | null;
  displayOrder?: number;
}

export interface UpdateWeightSlabInput {
  label?: string;
  minWeight?: number;
  maxWeight?: number | null;
  displayOrder?: number;
}

export interface UpdateWeightSlabRatesInput {
  rates: Array<{
    componentId: string;
    amount: number;
  }>;
}