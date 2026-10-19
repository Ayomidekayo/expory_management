
import { Prisma } from "../../../generated";

export interface CreateWeightSlabInput {
  configurationId: string;
  label: string;
  minWeightKg: number;
  maxWeightKg?: number | null;
  displayOrder?: number;
}

export interface UpdateWeightSlabInput {
  label?: string;
  minWeightKg?: number;
  maxWeightKg?: number | null;
  displayOrder?: number;
}

export interface WeightSlabRateInput {
  componentId: string;
  amount: number;
}

export interface UpdateWeightSlabRatesInput {
  rates: WeightSlabRateInput[];
}

export interface WeightSlabParams {
  id: string;
  slabId?: string;
}

export interface WeightSlabFilters {
  rateCardId: string;
  configurationId: string;
}

export type WeightSlabWithRates =
  Prisma.WeightSlabGetPayload<{
    include: {
      configuration: true;
      rates: {
        include: {
          component: true;
        };
      };
    };
  }>;

