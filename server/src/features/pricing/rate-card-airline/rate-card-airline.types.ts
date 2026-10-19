export type CreateRateCardAirlineInput = {
  configurationId: string;
  code: string;
  name: string;
  ratePerKg: number;
  displayOrder?: number;
  isActive?: boolean;
};

export type UpdateRateCardAirlineInput = {
  code?: string;
  name?: string;
  ratePerKg?: number;
  displayOrder?: number;
  isActive?: boolean;
};