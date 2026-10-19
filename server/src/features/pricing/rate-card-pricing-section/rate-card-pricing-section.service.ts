
import { RateCardStatus } from "../../../generated";
import * as repository from "./rate-card-pricing-section.repository";

import type {
  CreatePricingSectionInput,
  UpdatePricingSectionInput,
} from "./rate-card-pricing-section.types";

const SUPPORTED_CURRENCIES = new Set(["NGN", "CFA"]);

type SupportedCurrency = "NGN" | "CFA";

function normalizeCurrency(currency: string): SupportedCurrency {
  const normalized = currency.trim().toUpperCase();

  if (!SUPPORTED_CURRENCIES.has(normalized)) {
    throw new Error("UNSUPPORTED_CURRENCY");
  }

  return normalized as SupportedCurrency;
}

export class RateCardPricingSectionService {
  private assertDraft(status: RateCardStatus) {
    if (status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_MUST_BE_DRAFT");
    }
  }

  private assertCurrency(currency: string) {
    normalizeCurrency(currency);
  }

  private async assertOptionBelongsToConfiguration(
    optionId: string | null | undefined,
    configurationId: string,
  ) {
    if (optionId == null) return;

    const option = await repository.findOption(optionId);

    if (!option) {
      throw new Error("RATE_CARD_OPTION_NOT_FOUND");
    }

    if (option.configurationId !== configurationId) {
      throw new Error("OPTION_DOES_NOT_BELONG_TO_CONFIGURATION");
    }
  }

  async list(configurationId: string, activeOnly = false) {
    const configuration =
      await repository.findConfiguration(configurationId);

    if (!configuration) {
      throw new Error("CONFIGURATION_NOT_FOUND");
    }

    return repository.listSections(configurationId, activeOnly);
  }

  async getById(sectionId: string) {
    const section = await repository.findSection(sectionId);

    if (!section) {
      throw new Error("PRICING_SECTION_NOT_FOUND");
    }

    return section;
  }

  async create(
    configurationId: string,
    input: CreatePricingSectionInput,
  ) {
    const configuration =
      await repository.findConfiguration(configurationId);

    if (!configuration) {
      throw new Error("CONFIGURATION_NOT_FOUND");
    }

    this.assertDraft(configuration.rateCard.status);

    const currency = normalizeCurrency(input.currency);

    await this.assertOptionBelongsToConfiguration(
      input.optionId,
      configurationId,
    );

    const code = input.code.trim().toUpperCase();

    if (!code) {
      throw new Error("INVALID_PRICING_SECTION_CODE");
    }

    const existingSection =
      await repository.findSectionByCode(configurationId, code);

    if (existingSection) {
      throw new Error("PRICING_SECTION_CODE_ALREADY_EXISTS");
    }

    return repository.createSection(configurationId, {
      ...input,
      code,
      currency,
    });
  }

  async update(
    sectionId: string,
    input: UpdatePricingSectionInput,
  ) {
    const existing = await repository.findSection(sectionId);

    if (!existing) {
      throw new Error("PRICING_SECTION_NOT_FOUND");
    }

    this.assertDraft(existing.configuration.rateCard.status);

    const currency =
      input.currency !== undefined
        ? normalizeCurrency(input.currency)
        : undefined;

    if (input.optionId !== undefined) {
      await this.assertOptionBelongsToConfiguration(
        input.optionId,
        existing.configurationId,
      );

      if (
        input.optionId === null &&
        existing.optionId !== null
      ) {
        const dependentSlabs =
          await repository.countWeightSlabsForSection(sectionId);

        if (dependentSlabs > 0) {
          throw new Error(
            "CANNOT_REMOVE_OPTION_WITH_EXISTING_WEIGHT_SLABS",
          );
        }
      }
    }

    return repository.updateSection(sectionId, {
      ...input,
      ...(currency !== undefined ? { currency } : {}),
    });
  }
}

export const rateCardPricingSectionService =
  new RateCardPricingSectionService();
