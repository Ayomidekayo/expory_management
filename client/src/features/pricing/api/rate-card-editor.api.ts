import api from "../../../lib/axios";

export interface WeightSlabRate {
  id: string;
  componentId: string;
  amount: string | number;
}

export interface WeightSlab {
  id: string;
  label: string;
  minWeightKg: string | number;
  maxWeightKg: string | number | null;
  displayOrder: number;
  rates: Array<
    WeightSlabRate & {
      component: {
        id: string;
        name: string;
        code: string | null;
      };
    }
  >;
}

export interface RateComponent {
  id: string;
  name: string;
  code: string | null;
  calculationType:
    | "FIXED"
    | "WEIGHT_SLAB"
    | "PERCENTAGE"
    | "PER_UNIT"
    | "VARIABLE";
  calculationBasis: string | null;
  unit: string | null;
  value: string | number | null;
  percentage: string | number | null;
  isActive: boolean;
  isOptional: boolean;
  isTaxable: boolean;
}

export interface PricingSection {
  id: string;
  code: string;
  name: string;
  currency: string;
  displayOrder: number;
  isActive: boolean;
  optionId: string | null;
}

export interface RateCardOption {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

export interface RateCardConfiguration {
  id: string;
  name: string;
  code: string;
  currency: string;
  isActive: boolean;
  vatEnabled: boolean;
  vatPercentage: string | number;
  options: RateCardOption[];
  pricingSections: PricingSection[];
  components: RateComponent[];
  weightSlabs: WeightSlab[];
}

export interface RateCard {
  id: string;
  name: string;
  mode: "AIR" | "LAND" | "SEA";
  direction: "IMPORT" | "EXPORT";
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  currency: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  configurations: RateCardConfiguration[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const rateCardEditorApi = {
  async getRateCard(rateCardId: string): Promise<RateCard> {
    const response = await api.get<ApiResponse<RateCard>>(
      `/rate-card/rate-cards/${rateCardId}`,
    );

    return response.data.data;
  },
};