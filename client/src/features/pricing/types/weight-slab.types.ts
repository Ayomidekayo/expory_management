export interface WeightSlab {
  id: string;
  rateCardId: string;
  configurationId: string | null;
  optionId: string | null;
  pricingSectionId: string | null;
  label: string;
  minWeightKg: number | string;
  maxWeightKg: number | string | null;
  displayOrder: number;
  rates?: WeightSlabRate[];
  _count?: { rates: number };
}

export interface WeightSlabRate {
  id?: string;
  weightSlabId?: string;
  componentId: string;
  amount: number | string;
  component?: {
    id: string;
    name: string;
    code?: string | null;
    calculationType: string;
    isOptional?: boolean;
    isTaxable?: boolean;
  };
}

export interface WeightSlabFilters {
  configurationId?: string;
  optionId?: string;
  pricingSectionId?: string;
}

export interface WeightSlabInput {
  configurationId?: string | null;
  optionId?: string | null;
  pricingSectionId?: string | null;
  label: string;
  minWeightKg: number;
  maxWeightKg?: number | null;
  displayOrder?: number;
}

export interface SlabRatesInput {
  rates: Array<{ componentId: string; amount: number }>;
}


export interface WeightSlabMatrixInput extends WeightSlabInput {
  rates: Array<{
    componentId: string;
    amount: number;
  }>;
}

export type WeightPricingSection = {
  id: string;
  name: string;
  code: string;
  currency?: string | null;
  isActive: boolean;
  displayOrder: number;
  optionId?: string | null;
  option?: { id: string; name: string; code?: string } | null;
 configurationId?: string | null;
};