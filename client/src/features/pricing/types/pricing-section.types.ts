export type PricingSectionCurrency = "NGN" | "CFA";

export interface PricingSectionOption {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface PricingSection {
  id: string;
  configurationId: string;
  optionId: string | null;
  code: string;
  name: string;
  currency: PricingSectionCurrency;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  option?: PricingSectionOption | null;
  _count?: {
    components: number;
    weightSlabs: number;
  };
}

export interface CreatePricingSectionInput {
  code: string;
  name: string;
  currency: PricingSectionCurrency;
  optionId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdatePricingSectionInput {
  name?: string;
  currency?: PricingSectionCurrency;
  optionId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}
