import type { CalculationBasis } from "../../../generated";

export interface CreateRateCardConfigurationInput {
  name: string;
  code: string;
  currency?: string;
  routeCode?: string | null;
  routeLabel?: string | null;
  equipmentType?: string | null;
  airlineSelectorEnabled?: boolean;
  transportEnabled?: boolean;
  nafdacEnabled?: boolean;
  vatEnabled?: boolean;
  vatPercentage?: number;
  vatCalculationBasis?: CalculationBasis | null;
  weightEnabled?: boolean;
  freightAmountEnabled?: boolean;
  customsValueEnabled?: boolean;
  quantityEnabled?: boolean;
  isActive?: boolean;
  displayOrder?: number;
}

export type UpdateRateCardConfigurationInput =
  Partial<CreateRateCardConfigurationInput>;
