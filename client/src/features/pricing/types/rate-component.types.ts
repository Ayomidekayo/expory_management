export type RateCalculationType = "FIXED" | "WEIGHT_SLAB" | "PERCENTAGE" | "PER_UNIT" | "VARIABLE";
export type CalculationBasis = "SUBTOTAL" | "CUSTOMS_VALUE" | "FREIGHT_AMOUNT";

export interface RateComponent {
  id: string;
  rateCardId: string;
  configurationId?: string | null;
  name: string;
  code?: string | null;
  calculationType: RateCalculationType;
  calculationBasis?: CalculationBasis | null;
  unit?: string | null;
  value?: string | number | null;
  percentage?: string | number | null;
  isActive: boolean;
  isOptional: boolean;
  isTaxable: boolean;
  notes?: string | null;
  optionId?: string | null;
  pricingSectionId?: string | null;
  option?: { id: string; name: string; code: string } | null;
  pricingSection?: { id: string; name: string; code: string; currency: string } | null;
}

export interface RateComponentInput {
  name: string;
  code?: string;

  calculationType: RateCalculationType;
  calculationBasis?: CalculationBasis | null;

  unit?: string | null;
  value?: number | null;
  percentage?: number | null;

  isActive: boolean;
  isOptional: boolean;
  isTaxable: boolean;

  notes?: string | null;
  optionId?: string | null;
  pricingSectionId?: string | null;
}

export interface PricingSectionOption {
  id: string;
  name: string;
  code: string;
  currency?: string;
  optionId?: string | null;
  isActive: boolean;
}
