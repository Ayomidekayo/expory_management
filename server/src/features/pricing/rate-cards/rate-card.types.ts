import {
  QuoteDirection,
  QuoteMode,
  RateCardStatus,
} from "../../../generated";

export interface CreateRateCardInput {
  name: string;

  mode: QuoteMode;

  direction: QuoteDirection;

  currency?: string;

  effectiveFrom?: string;

  effectiveTo?: string | null;
}

export interface UpdateRateCardInput {
  name?: string;

  currency?: string;

  effectiveFrom?: string;

  effectiveTo?: string | null;
}

export interface ListRateCardsFilters {
  mode?: QuoteMode;

  direction?: QuoteDirection;

  status?: RateCardStatus;
}

export interface RateCardIdParams {
  id: string;
}