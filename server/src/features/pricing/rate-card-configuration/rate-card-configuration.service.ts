import { RateCardStatus, QuoteMode } from "../../../generated";
import * as repository from "./rate-card-configuration.repository";

import type {
  CreateRateCardConfigurationInput,
  UpdateRateCardConfigurationInput,
} from "./rate-card-configuration.types";

const DEFAULT_VAT_PERCENTAGE = 7.5;
const DEFAULT_VAT_BASIS = "SUBTOTAL" as const;

const SUPPORTED_CURRENCIES = new Set(["NGN", "CFA"]);

type ConfigurationRulesInput = {
  routeCode?: string | null;
  routeLabel?: string | null;
  equipmentType?: string | null;
  airlineSelectorEnabled?: boolean;
  vatEnabled?: boolean;
  vatPercentage?: number;
  vatCalculationBasis?:
    | "SUBTOTAL"
    | "CUSTOMS_VALUE"
    | "FREIGHT_AMOUNT"
    | null;
  currency?: string;
};

export class RateCardConfigurationService {
  async list(rateCardId: string) {
    const rateCard = await repository.findRateCard(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    return repository.listConfigurations(rateCardId);
  }

  async getById(id: string) {
    const configuration =
      await repository.findConfigurationById(id);

    if (!configuration) {
      throw new Error("CONFIGURATION_NOT_FOUND");
    }

    return configuration;
  }

  private assertDraftRateCard(status: RateCardStatus) {
    if (status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_MUST_BE_DRAFT");
    }
  }

  private assertConfigurationRules(
    mode: QuoteMode,
    input: ConfigurationRulesInput,
  ) {
    const hasRouteCode = Boolean(input.routeCode?.trim());
    const hasRouteLabel = Boolean(input.routeLabel?.trim());

    if (
      mode !== QuoteMode.LAND &&
      (hasRouteCode || hasRouteLabel)
    ) {
      throw new Error("ROUTE_CONFIGURATION_ONLY_FOR_LAND");
    }

    if (hasRouteCode !== hasRouteLabel) {
      throw new Error("ROUTE_CODE_AND_LABEL_REQUIRED_TOGETHER");
    }

    if (
      mode !== QuoteMode.AIR &&
      input.airlineSelectorEnabled === true
    ) {
      throw new Error("AIRLINE_SELECTOR_ONLY_FOR_AIR");
    }

    const currency = input.currency?.trim().toUpperCase();

    if (
      currency &&
      !SUPPORTED_CURRENCIES.has(currency)
    ) {
      throw new Error("UNSUPPORTED_CURRENCY");
    }

    if (
      input.vatPercentage !== undefined &&
      (
        !Number.isFinite(input.vatPercentage) ||
        input.vatPercentage < 0 ||
        input.vatPercentage > 100
      )
    ) {
      throw new Error("INVALID_VAT_PERCENTAGE");
    }

    if (input.vatEnabled) {
      if (input.vatPercentage === undefined) {
        throw new Error("VAT_PERCENTAGE_REQUIRED");
      }

      if (input.vatCalculationBasis == null) {
        throw new Error("VAT_CALCULATION_BASIS_REQUIRED");
      }
    }
  }

  async create(
    rateCardId: string,
    input: CreateRateCardConfigurationInput,
  ) {
    const rateCard =
      await repository.findRateCard(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    this.assertDraftRateCard(rateCard.status);

    const code = input.code.trim().toUpperCase();

    const existingConfiguration =
      await repository.findConfigurationByCode(
        rateCardId,
        code,
      );

    if (existingConfiguration) {
      throw new Error("CONFIGURATION_CODE_ALREADY_EXISTS");
    }

    const currency = (
      input.currency ?? "NGN"
    ).trim().toUpperCase();

    const vatEnabled = input.vatEnabled ?? false;

    // VAT defaults to 7.5% when enabled.
    const vatPercentage = vatEnabled
      ? input.vatPercentage ?? DEFAULT_VAT_PERCENTAGE
      : input.vatPercentage ?? DEFAULT_VAT_PERCENTAGE;

    // When VAT is enabled, default its basis to SUBTOTAL.
    const vatCalculationBasis = vatEnabled
      ? input.vatCalculationBasis ?? DEFAULT_VAT_BASIS
      : input.vatCalculationBasis ?? null;

    const normalized: CreateRateCardConfigurationInput = {
      ...input,
      code,
      currency,
      vatEnabled,
      vatPercentage,
      vatCalculationBasis,
      isActive: input.isActive ?? true,
      displayOrder: input.displayOrder ?? 0,
    };

    this.assertConfigurationRules(
      rateCard.mode,
      normalized,
    );

    return repository.createConfiguration(
      rateCardId,
      normalized,
    );
  }

  async update(
    id: string,
    input: UpdateRateCardConfigurationInput,
  ) {
    const existing =
      await repository.findConfiguration(id);

    if (!existing) {
      throw new Error("CONFIGURATION_NOT_FOUND");
    }

    this.assertDraftRateCard(existing.rateCard.status);

    const rateCard =
      await repository.findRateCard(existing.rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    const current =
      await repository.findConfigurationById(id);

    if (!current) {
      throw new Error("CONFIGURATION_NOT_FOUND");
    }

    const code = input.code?.trim().toUpperCase();

    if (code && code !== current.code) {
      const duplicate =
        await repository.findConfigurationByCode(
          existing.rateCardId,
          code,
        );

      if (duplicate) {
        throw new Error("CONFIGURATION_CODE_ALREADY_EXISTS");
      }
    }

    const effectiveVatEnabled =
      input.vatEnabled ?? current.vatEnabled;

    const effectiveVatPercentage =
      input.vatPercentage ??
      Number(current.vatPercentage) ??
      DEFAULT_VAT_PERCENTAGE;

    const effectiveVatCalculationBasis =
      effectiveVatEnabled
        ? input.vatCalculationBasis ??
          current.vatCalculationBasis ??
          DEFAULT_VAT_BASIS
        : input.vatCalculationBasis ?? null;

    const effective: ConfigurationRulesInput = {
      routeCode:
        input.routeCode !== undefined
          ? input.routeCode
          : current.routeCode,

      routeLabel:
        input.routeLabel !== undefined
          ? input.routeLabel
          : current.routeLabel,

      equipmentType:
        input.equipmentType !== undefined
          ? input.equipmentType
          : current.equipmentType,

      airlineSelectorEnabled:
        input.airlineSelectorEnabled ??
        current.airlineSelectorEnabled,

      vatEnabled: effectiveVatEnabled,
      vatPercentage: effectiveVatPercentage,
      vatCalculationBasis:
        effectiveVatCalculationBasis,

      currency: (
        input.currency ?? current.currency
      ).trim().toUpperCase(),
    };

    this.assertConfigurationRules(
      rateCard.mode,
      effective,
    );

    const normalized: UpdateRateCardConfigurationInput = {
      ...input,

      ...(code ? { code } : {}),

      ...(input.currency !== undefined
        ? {
            currency: input.currency.trim().toUpperCase(),
          }
        : {}),

      // Persist the defaults when VAT is enabled.
      ...(effectiveVatEnabled
        ? {
            vatPercentage: effectiveVatPercentage,
            vatCalculationBasis:
              effectiveVatCalculationBasis,
          }
        : {}),
    };

    return repository.updateConfiguration(
      id,
      normalized,
    );
  }
}

export const rateCardConfigurationService =
  new RateCardConfigurationService();