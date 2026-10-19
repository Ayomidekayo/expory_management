export interface RateCardOption {
  id: string;
  configurationId: string;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    components: number;
    weightSlabs: number;
    pricingSections: number;
  };
}

export interface CreateRateCardOptionInput {
  code: string;
  name: string;
  displayOrder?: number;
  isActive?: boolean;
}

export type UpdateRateCardOptionInput = Partial<CreateRateCardOptionInput>;
