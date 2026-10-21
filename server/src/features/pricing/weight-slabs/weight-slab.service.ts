
import { RateCardStatus } from "../../../generated";
import * as repository from "./weight-slab.repository";

import type {
  CreateWeightSlabInput,
  CreateWeightSlabMatrixInput,
  UpdateWeightSlabInput,
  UpsertSlabRatesInput,
} from "./weight-slab.schema";

function assertValidRange(
  minWeightKg: number,
  maxWeightKg: number | null,
) {
  if (maxWeightKg !== null && maxWeightKg <= minWeightKg) {
    throw new Error(
      "MAX_WEIGHT_MUST_EXCEED_MIN_WEIGHT",
    );
  }
}

function assertSameConfiguration(
  expectedConfigurationId: string,
  actualConfigurationId: string | null | undefined,
  message: string,
) {
  if (actualConfigurationId !== expectedConfigurationId) {
    throw new Error(message);
  }
}

export class WeightSlabService {
  async list(rateCardId: string, filters?: {
    configurationId?: string;
    optionId?: string;
    pricingSectionId?: string;
  }) {
    const rateCard = await repository.findRateCard(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    return repository.listWeightSlabs(rateCardId, filters);
  }

  async getById(weightSlabId: string) {
    const slab = await repository.findWeightSlabById(weightSlabId);

    if (!slab) {
      throw new Error("WEIGHT_SLAB_NOT_FOUND");
    }

    return slab;
  }

  async create(
    rateCardId: string,
    input: CreateWeightSlabInput,
  ) {
    const rateCard = await repository.findRateCard(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    if (rateCard.status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_MUST_BE_DRAFT");
    }

    const configurationId = input.configurationId ?? null;
    const optionId = input.optionId ?? null;
    const pricingSectionId = input.pricingSectionId ?? null;

    await this.validateRelationships(
      rateCardId,
      configurationId,
      optionId,
      pricingSectionId,
    );

    const maxWeightKg = input.maxWeightKg ?? null;

    assertValidRange(input.minWeightKg, maxWeightKg);

 
const overlap = await repository.findOverlappingSlab(
  rateCardId,
  input.minWeightKg,
  maxWeightKg,
  {
    configurationId,
    optionId,
    pricingSectionId,
  },
);

if (overlap) {
  throw new Error("WEIGHT_SLAB_RANGE_OVERLAP");
}


    return repository.createWeightSlab({
      rateCardId,
      ...input,
      configurationId,
      optionId,
      pricingSectionId,
      maxWeightKg,
    });
  }

  async update(
    weightSlabId: string,
    input: UpdateWeightSlabInput,
  ) {
    const existing =
      await repository.findWeightSlabById(weightSlabId);

    if (!existing) {
      throw new Error("WEIGHT_SLAB_NOT_FOUND");
    }

    if (existing.rateCard.status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_MUST_BE_DRAFT");
    }

    const minWeightKg =
      input.minWeightKg ?? Number(existing.minWeightKg);

    const maxWeightKg =
      input.maxWeightKg !== undefined
        ? input.maxWeightKg
        : existing.maxWeightKg === null
          ? null
          : Number(existing.maxWeightKg);

    assertValidRange(minWeightKg, maxWeightKg);

    const configurationId =
      input.configurationId !== undefined
        ? input.configurationId
        : existing.configurationId;

    const optionId =
      input.optionId !== undefined
        ? input.optionId
        : existing.optionId;

    const pricingSectionId =
      input.pricingSectionId !== undefined
        ? input.pricingSectionId
        : existing.pricingSectionId;

    await this.validateRelationships(
      existing.rateCardId,
      configurationId,
      optionId,
      pricingSectionId,
    );

   
const overlap = await repository.findOverlappingSlab(
  existing.rateCardId,
  minWeightKg,
  maxWeightKg,
  {
    configurationId,
    optionId,
    pricingSectionId,
  },
  weightSlabId,
);

if (overlap) {
  throw new Error("WEIGHT_SLAB_RANGE_OVERLAP");
}


    return repository.updateWeightSlab(weightSlabId, {
      ...input,
      configurationId,
      optionId,
      pricingSectionId,
      minWeightKg,
      maxWeightKg,
    });
  }

  async delete(weightSlabId: string) {
    const existing =
      await repository.findWeightSlabById(weightSlabId);

    if (!existing) {
      throw new Error("WEIGHT_SLAB_NOT_FOUND");
    }

    if (existing.rateCard.status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_MUST_BE_DRAFT");
    }

    return repository.deleteWeightSlab(weightSlabId);
  }


async setRates(
  weightSlabId: string,
  input: UpsertSlabRatesInput,
) {
  const slab = await repository.findWeightSlabById(weightSlabId);

  if (!slab) {
    throw new Error("WEIGHT_SLAB_NOT_FOUND");
  }

  if (slab.rateCard.status !== RateCardStatus.DRAFT) {
    throw new Error("RATE_CARD_MUST_BE_DRAFT");
  }

  const componentIds = input.rates.map(
    (rate) => rate.componentId,
  );

  if (new Set(componentIds).size !== componentIds.length) {
    throw new Error("DUPLICATE_SLAB_RATE_COMPONENT");
  }

  const components =
    await repository.findComponentsForSlabRates(
      slab.rateCardId,
      componentIds,
    );

  if (components.length !== componentIds.length) {
    throw new Error(
      "INVALID_OR_INACTIVE_WEIGHT_SLAB_COMPONENT",
    );
  }

 for (const component of components) {
  if (
    (component.configurationId ?? null) !==
    (slab.configurationId ?? null)
  ) {
    console.error("[Weight Slab Rates] Configuration mismatch", {
      weightSlabId,
      componentId: component.id,
      componentConfigurationId: component.configurationId,
      slabConfigurationId: slab.configurationId,
    });

    throw new Error("COMPONENT_CONFIGURATION_MISMATCH");
  }

  if (
    (component.optionId ?? null) !==
    (slab.optionId ?? null)
  ) {
    console.error("[Weight Slab Rates] Option mismatch", {
      weightSlabId,
      componentId: component.id,
      componentOptionId: component.optionId,
      slabOptionId: slab.optionId,
    });

    throw new Error("COMPONENT_OPTION_MISMATCH");
  }

  // if (
  //   (component.pricingSectionId ?? null) !==
  //   (slab.pricingSectionId ?? null)
  // ) {
  //   console.error("[Weight Slab Rates] Pricing section mismatch", {
  //     weightSlabId,
  //     componentId: component.id,
  //     componentPricingSectionId: component.pricingSectionId,
  //     slabPricingSectionId: slab.pricingSectionId,
  //   });

  //   throw new Error("COMPONENT_PRICING_SECTION_MISMATCH");
  // }
}

  return repository.replaceSlabRates(
    weightSlabId,
    input.rates,
  );
}
async createMatrixRow(
  rateCardId: string,
  input: CreateWeightSlabMatrixInput,
) {
  const rateCard = await repository.findRateCard(rateCardId);

  if (!rateCard) {
    throw new Error("RATE_CARD_NOT_FOUND");
  }

  if (rateCard.status !== RateCardStatus.DRAFT) {
    throw new Error("RATE_CARD_MUST_BE_DRAFT");
  }

  const configurationId = input.configurationId ?? null;
  const optionId = input.optionId ?? null;
  const pricingSectionId = input.pricingSectionId ?? null;
  const maxWeightKg = input.maxWeightKg ?? null;

  assertValidRange(input.minWeightKg, maxWeightKg);

  await this.validateRelationships(
    rateCardId,
    configurationId,
    optionId,
    pricingSectionId,
  );

  const overlap = await repository.findOverlappingSlab(
    rateCardId,
    input.minWeightKg,
    maxWeightKg,
    {
      configurationId,
      optionId,
      pricingSectionId,
    },
  );

  if (overlap) {
    throw new Error("WEIGHT_SLAB_RANGE_OVERLAP");
  }

  const componentIds = input.rates.map(
    (rate) => rate.componentId,
  );

  if (new Set(componentIds).size !== componentIds.length) {
    throw new Error("DUPLICATE_SLAB_RATE_COMPONENT");
  }

  const components =
    await repository.findComponentsForSlabRates(
      rateCardId,
      componentIds,
    );

  if (components.length !== componentIds.length) {
    throw new Error(
      "INVALID_OR_INACTIVE_WEIGHT_SLAB_COMPONENT",
    );
  }

  for (const component of components) {
    if (
      (component.configurationId ?? null) !== configurationId
    ) {
      throw new Error("COMPONENT_CONFIGURATION_MISMATCH");
    }

    if ((component.optionId ?? null) !== optionId) {
      throw new Error("COMPONENT_OPTION_MISMATCH");
    }

  }

  return repository.createWeightSlabWithRates({
    rateCardId,
    configurationId,
    optionId,
    pricingSectionId,
    label: input.label,
    minWeightKg: input.minWeightKg,
    maxWeightKg,
    displayOrder: input.displayOrder,
    rates: input.rates,
  });
}

  private async validateRelationships(
    rateCardId: string,
    configurationId: string | null,
    optionId: string | null,
    pricingSectionId: string | null,
  ) {
    if (configurationId) {
      const configuration =
        await repository.findConfiguration(configurationId);

      if (!configuration) {
        throw new Error("CONFIGURATION_NOT_FOUND");
      }

      assertSameConfiguration(
        rateCardId,
        configuration.rateCardId,
        "CONFIGURATION_RATE_CARD_MISMATCH",
      );
    }

    if (optionId) {
      const option = await repository.findOption(optionId);

      if (!option) {
        throw new Error("OPTION_NOT_FOUND");
      }

      const optionConfigurationId = option.configurationId;

      if (
        configurationId &&
        optionConfigurationId !== configurationId
      ) {
        throw new Error("OPTION_CONFIGURATION_MISMATCH");
      }

      const configuration =
        await repository.findConfiguration(optionConfigurationId);

      if (!configuration || configuration.rateCardId !== rateCardId) {
        throw new Error("OPTION_RATE_CARD_MISMATCH");
      }
    }

    if (pricingSectionId) {
      const section =
        await repository.findPricingSection(pricingSectionId);

      if (!section) {
        throw new Error("PRICING_SECTION_NOT_FOUND");
      }

      if (section.configurationId !== configurationId) {
        throw new Error(
          "PRICING_SECTION_CONFIGURATION_MISMATCH",
        );
      }

      if (optionId && section.optionId && section.optionId !== optionId) {
        throw new Error("PRICING_SECTION_OPTION_MISMATCH");
      }

      if (!optionId && section.optionId) {
        throw new Error(
          "PRICING_SECTION_REQUIRES_ITS_OPTION",
        );
      }

      const configuration =
        await repository.findConfiguration(section.configurationId);

      if (!configuration || configuration.rateCardId !== rateCardId) {
        throw new Error(
          "PRICING_SECTION_RATE_CARD_MISMATCH",
        );
      }
    }
  }
}