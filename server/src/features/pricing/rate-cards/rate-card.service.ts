import {
  CalculationBasis,
  QuoteMode,
  RateCalculationType,
  RateCardStatus,
} from "../../../generated";

import { rateCardRepository } from "./rate-card.repository";

import type {
  CreateRateCardInput,
  UpdateRateCardInput,
  ListRateCardsFilters,
} from "./rate-card.types";

type ActivationComponent = {
  id: string;
  name: string;
  calculationType: RateCalculationType;
  calculationBasis: CalculationBasis | null;
  value: unknown;
  percentage: unknown;
  weightSlabRates: Array<{
    weightSlabId: string;
  }>;
};

type ActivationSlab = {
  id: string;
  label: string;
  minWeightKg: unknown;
  maxWeightKg: unknown | null;
  rates: Array<{
    componentId: string;
    amount: unknown;
  }>;
};

type ActivationConfiguration = {
  id: string;
  name: string;
  isActive: boolean;
  components: ActivationComponent[];
  weightSlabs: ActivationSlab[];
};

export class RateCardService {
  async list(filters: ListRateCardsFilters) {
    return rateCardRepository.findMany(filters);
  }

  async getById(id: string) {
    const rateCard = await rateCardRepository.findById(id);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    return rateCard;
  }

  private validateEffectiveDates(
    effectiveFrom: Date,
    effectiveTo: Date | null,
  ) {
    if (
      effectiveTo !== null &&
      effectiveTo.getTime() < effectiveFrom.getTime()
    ) {
      throw new Error("INVALID_EFFECTIVE_DATE_RANGE");
    }
  }

  async create(
    input: CreateRateCardInput,
    createdById: string,
  ) {
    if (!createdById.trim()) {
      throw new Error("RATE_CARD_CREATOR_REQUIRED");
    }

    const effectiveFrom = input.effectiveFrom
      ? new Date(input.effectiveFrom)
      : new Date();

    const effectiveTo =
      input.effectiveTo === undefined ||
      input.effectiveTo === null
        ? null
        : new Date(input.effectiveTo);

    this.validateEffectiveDates(
      effectiveFrom,
      effectiveTo,
    );

    return rateCardRepository.create(
      input,
      createdById,
    );
  }

  async update(
    id: string,
    input: UpdateRateCardInput,
  ) {
    const existing = await rateCardRepository.findById(id);

    if (!existing) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    if (existing.status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_NOT_EDITABLE");
    }

    const effectiveFrom =
      input.effectiveFrom !== undefined
        ? new Date(input.effectiveFrom)
        : existing.effectiveFrom;

    const effectiveTo =
      input.effectiveTo !== undefined
        ? input.effectiveTo === null
          ? null
          : new Date(input.effectiveTo)
        : existing.effectiveTo;

    this.validateEffectiveDates(
      effectiveFrom,
      effectiveTo,
    );

    return rateCardRepository.update(id, input);
  }

  private validateConfiguration(
    configuration: ActivationConfiguration,
  ) {
    const components = configuration.components;

    if (components.length === 0) {
      throw new Error(
        `CONFIGURATION_REQUIRES_COMPONENTS:${configuration.name}`,
      );
    }

    for (const component of components) {
      const value =
        component.value === null ||
        component.value === undefined
          ? null
          : Number(component.value);

      const percentage =
        component.percentage === null ||
        component.percentage === undefined
          ? null
          : Number(component.percentage);

      if (
        component.calculationType ===
          RateCalculationType.FIXED ||
        component.calculationType ===
          RateCalculationType.PER_UNIT
      ) {
        if (
          value === null ||
          !Number.isFinite(value) ||
          value < 0
        ) {
          throw new Error(
            `RATE_COMPONENT_VALUE_REQUIRED:${configuration.name}:${component.name}`,
          );
        }
      }

      if (
        component.calculationType ===
        RateCalculationType.PERCENTAGE
      ) {
        if (
          percentage === null ||
          !Number.isFinite(percentage) ||
          percentage < 0 ||
          percentage > 100
        ) {
          throw new Error(
            `RATE_COMPONENT_PERCENTAGE_INVALID:${configuration.name}:${component.name}`,
          );
        }

        if (!component.calculationBasis) {
          throw new Error(
            `RATE_COMPONENT_BASIS_REQUIRED:${configuration.name}:${component.name}`,
          );
        }
      }

      if (
        component.calculationType ===
        RateCalculationType.WEIGHT_SLAB
      ) {
        this.validateWeightComponent(
          configuration,
          component,
        );
      }
    }
  }

  private validateWeightComponent(
    configuration: ActivationConfiguration,
    component: ActivationComponent,
  ) {
    if (configuration.weightSlabs.length === 0) {
      throw new Error(
        `CONFIGURATION_REQUIRES_WEIGHT_SLABS:${configuration.name}`,
      );
    }

    const componentSlabIds = new Set(
      component.weightSlabRates.map(
        (rate) => rate.weightSlabId,
      ),
    );

    for (const slab of configuration.weightSlabs) {
      const slabRate = slab.rates.find(
        (rate) => rate.componentId === component.id,
      );

      if (
        !slabRate ||
        !Number.isFinite(Number(slabRate.amount)) ||
        Number(slabRate.amount) < 0
      ) {
        throw new Error(
          `RATE_CARD_MISSING_SLAB_RATE:${configuration.name}:${component.name}:${slab.label}`,
        );
      }

      if (!componentSlabIds.has(slab.id)) {
        throw new Error(
          `RATE_CARD_MISSING_SLAB_RATE:${configuration.name}:${component.name}:${slab.label}`,
        );
      }
    }
  }

  private validateWeightSlabs(
    configuration: ActivationConfiguration,
  ) {
    const slabs = [...configuration.weightSlabs].sort(
      (a, b) =>
        Number(a.minWeightKg) -
        Number(b.minWeightKg),
    );

    for (let index = 0; index < slabs.length; index++) {
      const current = slabs[index];

      const min = Number(current.minWeightKg);

      const max =
        current.maxWeightKg === null ||
        current.maxWeightKg === undefined
          ? null
          : Number(current.maxWeightKg);

      if (
        !Number.isFinite(min) ||
        min < 0 ||
        (max !== null &&
          (!Number.isFinite(max) || max <= min))
      ) {
        throw new Error("RATE_CARD_INVALID_WEIGHT_SLAB");
      }

      if (
        max === null &&
        index !== slabs.length - 1
      ) {
        throw new Error(
          "RATE_CARD_OPEN_ENDED_SLAB_MUST_BE_LAST",
        );
      }

      if (index < slabs.length - 1) {
        const nextMin = Number(
          slabs[index + 1].minWeightKg,
        );

        if (
          max === null ||
          nextMin < max
        ) {
          throw new Error(
            "RATE_CARD_OVERLAPPING_WEIGHT_SLABS",
          );
        }
      }
    }
  }

  private validateActivationPricing(
    configurations: ActivationConfiguration[],
  ) {
    const activeConfigurations =
      configurations.filter(
        (configuration) => configuration.isActive,
      );

    if (activeConfigurations.length === 0) {
      throw new Error(
        "RATE_CARD_REQUIRES_ACTIVE_CONFIGURATION",
      );
    }

    for (const configuration of activeConfigurations) {
      this.validateConfiguration(configuration);
      this.validateWeightSlabs(configuration);
    }
  }

  async activate(id: string) {
    const rateCard =
      await rateCardRepository.findForActivation(id);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    if (rateCard.status !== RateCardStatus.DRAFT) {
      throw new Error("RATE_CARD_NOT_ACTIVATABLE");
    }

    const now = new Date();

    if (
      rateCard.effectiveTo !== null &&
      rateCard.effectiveTo < now
    ) {
      throw new Error("RATE_CARD_EFFECTIVE_PERIOD_EXPIRED");
    }

    this.validateEffectiveDates(
      rateCard.effectiveFrom,
      rateCard.effectiveTo,
    );

    this.validateActivationPricing(
      rateCard.configurations as ActivationConfiguration[],
    );

    const result = await rateCardRepository.activate(id);

    if (result.count === 0) {
      throw new Error("RATE_CARD_NOT_ACTIVATABLE");
    }

    return this.getById(id);
  }
}

export const rateCardService = new RateCardService();