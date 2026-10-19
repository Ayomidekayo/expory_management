
import { RateCardStatus } from "../../../generated";
import * as repository from "./rate-component.repository";

import type {
  CreateRateComponentInput,
  UpdateRateComponentInput,
} from "./rate-component.types";

export class RateComponentService {
  private assertDraft(status: RateCardStatus) {
    if (status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_MUST_BE_DRAFT");
    }
  }

  private async resolveConfigurationId(
    rateCardId: string,
    input: {
      configurationId?: string | null;
      optionId?: string | null;
      pricingSectionId?: string | null;
    },
  ): Promise<string | null> {
    let configurationId = input.configurationId ?? null;

    if (input.pricingSectionId) {
      const section = await repository.findPricingSection(
        input.pricingSectionId,
      );

      if (!section) {
        throw new Error("PRICING_SECTION_NOT_FOUND");
      }

      if (section.configuration.rateCardId !== rateCardId) {
        throw new Error("PRICING_SECTION_RATE_CARD_MISMATCH");
      }

      if (
        configurationId &&
        section.configurationId !== configurationId
      ) {
        throw new Error("PRICING_SECTION_CONFIGURATION_MISMATCH");
      }

      configurationId = section.configurationId;
    }

    if (input.optionId) {
      const option = await repository.findOption(input.optionId);

      if (!option) {
        throw new Error("RATE_CARD_OPTION_NOT_FOUND");
      }

      if (option.configuration.rateCardId !== rateCardId) {
        throw new Error("OPTION_RATE_CARD_MISMATCH");
      }

      if (
        configurationId &&
        option.configurationId !== configurationId
      ) {
        throw new Error("OPTION_CONFIGURATION_MISMATCH");
      }

      configurationId = option.configurationId;
    }

    if (
      input.optionId &&
      input.pricingSectionId
    ) {
      const section = await repository.findPricingSection(
        input.pricingSectionId,
      );

      if (section?.optionId !== input.optionId) {
        throw new Error("PRICING_SECTION_OPTION_MISMATCH");
      }
    }

    return configurationId;
  }

  async list(
    rateCardId: string,
    filters: {
      activeOnly?: boolean;
      pricingSectionId?: string;
      optionId?: string;
    },
  ) {
    const rateCard = await repository.findRateCard(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    return repository.listComponents(rateCardId, filters);
  }

  async getById(componentId: string) {
    const component = await repository.findComponent(componentId);

    if (!component) {
      throw new Error("RATE_COMPONENT_NOT_FOUND");
    }

    return component;
  }

  async create(
    rateCardId: string,
    input: CreateRateComponentInput,
  ) {
    const rateCard = await repository.findRateCard(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    this.assertDraft(rateCard.status);

    const configurationId =
      await this.resolveConfigurationId(rateCardId, input);

    if (input.code?.trim()) {
      const code = input.code.trim().toUpperCase();
      const existing = await repository.findComponentByCode(
        rateCardId,
        code,
      );

      if (existing) {
        throw new Error("RATE_COMPONENT_CODE_ALREADY_EXISTS");
      }

      input = { ...input, code };
    }

    return repository.createComponent(
      rateCardId,
      configurationId,
      input,
    );
  }

  async update(
    componentId: string,
    input: UpdateRateComponentInput,
  ) {
    const existing = await repository.findComponent(componentId);

    if (!existing) {
      throw new Error("RATE_COMPONENT_NOT_FOUND");
    }

    this.assertDraft(existing.rateCard.status);

    const nextOptionId =
      input.optionId !== undefined
        ? input.optionId
        : existing.optionId;

    const nextPricingSectionId =
      input.pricingSectionId !== undefined
        ? input.pricingSectionId
        : existing.pricingSectionId;

    // Preserve the current configuration unless the component is
    // explicitly moved to another section or option.
    const explicitlyReassigned =
      input.optionId !== undefined ||
      input.pricingSectionId !== undefined;

    const configurationId = explicitlyReassigned
      ? await this.resolveConfigurationId(existing.rateCardId, {
          optionId: nextOptionId,
          pricingSectionId: nextPricingSectionId,
        })
      : existing.configurationId;

    // Prevent a section or option from being detached while the
    // other relationship still requires its configuration.
    if (
      nextPricingSectionId &&
      nextOptionId
    ) {
      const section = await repository.findPricingSection(
        nextPricingSectionId,
      );

      if (!section) {
        throw new Error("PRICING_SECTION_NOT_FOUND");
      }

      if (section.optionId !== nextOptionId) {
        throw new Error("PRICING_SECTION_OPTION_MISMATCH");
      }
    }

  if (input.code !== undefined && input.code !== null) {
  const code = input.code.trim().toUpperCase();

  if (!code) {
    throw new Error("INVALID_RATE_COMPONENT_CODE");
  }

  const duplicate = await repository.findComponentByCode(
    existing.rateCardId,
    code,
  );

  if (duplicate && duplicate.id !== existing.id) {
    throw new Error("RATE_COMPONENT_CODE_ALREADY_EXISTS");
  }

  input = { ...input, code };
}
    // If the repository update function doesn't accept configurationId,
    // add it to the repository update data as shown below.
    return repository.updateComponent(componentId, {
      ...input,
      ...(explicitlyReassigned ? { configurationId } : {}),
    });
  }
}

export const rateComponentService = new RateComponentService();
