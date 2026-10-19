
import {
  RateCalculationType,
  RateCardStatus,
} from "../../../generated";

import * as repository from "./rate-card-activation.repository";

type ValidationIssue = {
  code: string;
  message: string;
  severity: "ERROR" | "WARNING";
  configurationId?: string;
  componentId?: string;
  weightSlabId?: string;
};

export class RateCardActivationService {
  async validate(rateCardId: string) {
    const rateCard =
      await repository.findRateCardForValidation(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    const addError = (
      code: string,
      message: string,
      extra: Partial<ValidationIssue> = {},
    ) => {
      errors.push({ code, message, severity: "ERROR", ...extra });
    };

    const addWarning = (
      code: string,
      message: string,
      extra: Partial<ValidationIssue> = {},
    ) => {
      warnings.push({ code, message, severity: "WARNING", ...extra });
    };

    if (rateCard.status !== RateCardStatus.DRAFT) {
      addError(
        "RATE_CARD_NOT_DRAFT",
        "Only draft rate cards can be validated for activation.",
      );
    }

    if (
      rateCard.effectiveTo &&
      rateCard.effectiveTo <= rateCard.effectiveFrom
    ) {
      addError(
        "INVALID_EFFECTIVE_DATES",
        "The effective end date must be later than the effective start date.",
      );
    }

    const activeConfigurations =
      rateCard.configurations.filter((configuration) => configuration.isActive);

    if (activeConfigurations.length === 0) {
      addError(
        "NO_ACTIVE_CONFIGURATIONS",
        "Activate at least one pricing configuration before activating this rate card.",
      );
    }

    for (const configuration of activeConfigurations) {
      const configInfo = { configurationId: configuration.id };

      if (!configuration.name.trim() || !configuration.code.trim()) {
        addError(
          "INVALID_CONFIGURATION_DETAILS",
          "Every active configuration must have a name and code.",
          configInfo,
        );
      }

      if (!["NGN", "CFA"].includes(configuration.currency)) {
        addError(
          "UNSUPPORTED_CONFIGURATION_CURRENCY",
          `Configuration "${configuration.name}" must use NGN or CFA.`,
          configInfo,
        );
      }

      const components = configuration.components;
      const slabs = configuration.weightSlabs;

      if (components.length === 0) {
        addError(
          "NO_ACTIVE_CONFIGURATION_COMPONENTS",
          `Configuration "${configuration.name}" requires at least one active charge.`,
          configInfo,
        );
      }

      if (
        configuration.vatEnabled &&
        (!Number.isFinite(Number(configuration.vatPercentage)) ||
          Number(configuration.vatPercentage) < 0 ||
          Number(configuration.vatPercentage) > 100)
      ) {
        addError(
          "INVALID_VAT_PERCENTAGE",
          `Configuration "${configuration.name}" has an invalid VAT percentage.`,
          configInfo,
        );
      }

      if (
        configuration.airlineSelectorEnabled &&
        configuration.airlines.length === 0
      ) {
        addError(
          "NO_ACTIVE_AIRLINES",
          `Configuration "${configuration.name}" enables airline selection but has no active airlines.`,
          configInfo,
        );
      }

      for (const airline of configuration.airlines) {
        if (
          !airline.name.trim() ||
          !Number.isFinite(Number(airline.ratePerKg)) ||
          Number(airline.ratePerKg) < 0
        ) {
          addError(
            "INVALID_AIRLINE_RATE",
            `An active airline in "${configuration.name}" has an invalid name or rate.`,
            configInfo,
          );
        }
      }

      for (const component of components) {
        const componentInfo = {
          ...configInfo,
          componentId: component.id,
        };

        if (!component.name.trim()) {
          addError(
            "COMPONENT_NAME_REQUIRED",
            "An active charge must have a name.",
            componentInfo,
          );
        }

        if (
          component.calculationType === RateCalculationType.FIXED &&
          (component.value === null ||
            !Number.isFinite(Number(component.value)) ||
            Number(component.value) < 0)
        ) {
          addError(
            "INVALID_FIXED_COMPONENT_VALUE",
            `Charge "${component.name}" requires a valid non-negative fixed amount.`,
            componentInfo,
          );
        }

        if (
          component.calculationType === RateCalculationType.PER_UNIT &&
          (component.value === null ||
            !Number.isFinite(Number(component.value)) ||
            Number(component.value) < 0)
        ) {
          addError(
            "INVALID_PER_UNIT_COMPONENT",
            `Charge "${component.name}" requires a valid non-negative unit rate.`,
            componentInfo,
          );
        }

        if (
          component.calculationType === RateCalculationType.PERCENTAGE &&
          (component.percentage === null ||
            !Number.isFinite(Number(component.percentage)) ||
            Number(component.percentage) < 0 ||
            !component.calculationBasis)
        ) {
          addError(
            "INVALID_PERCENTAGE_COMPONENT",
            `Percentage charge "${component.name}" requires a valid percentage and calculation basis.`,
            componentInfo,
          );
        }

        if (
          component.optionId &&
          component.option?.configurationId !== configuration.id
        ) {
          addError(
            "COMPONENT_OPTION_MISMATCH",
            `Charge "${component.name}" references an option from another configuration.`,
            componentInfo,
          );
        }

        if (
          component.pricingSectionId &&
          component.pricingSection?.configurationId !== configuration.id
        ) {
          addError(
            "COMPONENT_SECTION_MISMATCH",
            `Charge "${component.name}" references a section from another configuration.`,
            componentInfo,
          );
        }

        if (
          component.pricingSection?.optionId &&
          component.optionId !== component.pricingSection.optionId
        ) {
          addError(
            "COMPONENT_SECTION_OPTION_MISMATCH",
            `Charge "${component.name}" does not match its section's assigned option.`,
            componentInfo,
          );
        }

        if (component.calculationType === RateCalculationType.VARIABLE) {
          addWarning(
            "VARIABLE_COMPONENT_REQUIRES_REVIEW",
            `Charge "${component.name}" may require manual quotation review.`,
            componentInfo,
          );
        }

        if (component.calculationType === RateCalculationType.WEIGHT_SLAB) {
          const applicableSlabs = slabs.filter((slab) => {
            if (
              slab.optionId !== component.optionId ||
              slab.pricingSectionId !== component.pricingSectionId
            ) {
              return false;
            }

            return true;
          });

          if (applicableSlabs.length === 0) {
            addError(
              "WEIGHT_SLAB_REQUIRED",
              `Weight-based charge "${component.name}" requires an applicable weight slab.`,
              componentInfo,
            );
          }

          for (const slab of applicableSlabs) {
            const rate = slab.rates.find(
              (item) => item.componentId === component.id,
            );

            if (
              !rate ||
              !Number.isFinite(Number(rate.amount)) ||
              Number(rate.amount) < 0
            ) {
              addError(
                "MISSING_OR_INVALID_SLAB_RATE",
                `Weight slab "${slab.label}" requires a valid rate for "${component.name}".`,
                { ...componentInfo, weightSlabId: slab.id },
              );
            }
          }
        }
      }

      for (const section of configuration.pricingSections) {
        if (
          section.optionId &&
          section.option?.configurationId !== configuration.id
        ) {
          addError(
            "SECTION_OPTION_MISMATCH",
            `Pricing section "${section.name}" references an option from another configuration.`,
            configInfo,
          );
        }

        if (!["NGN", "CFA"].includes(section.currency)) {
          addError(
            "UNSUPPORTED_SECTION_CURRENCY",
            `Pricing section "${section.name}" must use NGN or CFA.`,
            configInfo,
          );
        }
      }

      for (const slab of slabs) {
        const min = Number(slab.minWeightKg);
        const max =
          slab.maxWeightKg === null
            ? Infinity
            : Number(slab.maxWeightKg);

        if (
          !Number.isFinite(min) ||
          min < 0 ||
          max <= min
        ) {
          addError(
            "INVALID_WEIGHT_RANGE",
            `Weight slab "${slab.label}" has an invalid weight range.`,
            { ...configInfo, weightSlabId: slab.id },
          );
        }

        if (
          slab.optionId &&
          slab.option?.configurationId !== configuration.id
        ) {
          addError(
            "SLAB_OPTION_MISMATCH",
            `Weight slab "${slab.label}" references an option from another configuration.`,
            configInfo,
          );
        }

        if (
          slab.pricingSectionId &&
          slab.pricingSection?.configurationId !== configuration.id
        ) {
          addError(
            "SLAB_SECTION_MISMATCH",
            `Weight slab "${slab.label}" references a section from another configuration.`,
            configInfo,
          );
        }
      }

      for (let i = 0; i < slabs.length; i++) {
        for (let j = i + 1; j < slabs.length; j++) {
          const first = slabs[i];
          const second = slabs[j];

          if (
            first.optionId !== second.optionId ||
            first.pricingSectionId !== second.pricingSectionId
          ) {
            continue;
          }

          const firstMin = Number(first.minWeightKg);
          const firstMax =
            first.maxWeightKg === null
              ? Infinity
              : Number(first.maxWeightKg);
          const secondMin = Number(second.minWeightKg);
          const secondMax =
            second.maxWeightKg === null
              ? Infinity
              : Number(second.maxWeightKg);

          if (firstMin < secondMax && secondMin < firstMax) {
            addError(
              "OVERLAPPING_WEIGHT_SLABS",
              `Weight slabs "${first.label}" and "${second.label}" overlap.`,
              configInfo,
            );
          }
        }
      }
    }

    return {
      rateCardId: rateCard.id,
      rateCardName: rateCard.name,
      status: rateCard.status,
      isValid: errors.length === 0,
      canActivate:
        rateCard.status === RateCardStatus.DRAFT &&
        errors.length === 0,
      summary: {
        errors: errors.length,
        warnings: warnings.length,
      },
      errors,
      warnings,
    };
  }

  async activate(rateCardId: string) {
    const validation = await this.validate(rateCardId);

    if (!validation.canActivate) {
      throw new Error("RATE_CARD_VALIDATION_FAILED");
    }

    return repository.activateRateCard(rateCardId);
  }

  async archive(rateCardId: string) {
    const rateCard =
      await repository.findRateCardForValidation(rateCardId);

    if (!rateCard) {
      throw new Error("RATE_CARD_NOT_FOUND");
    }

    if (rateCard.status !== RateCardStatus.ACTIVE) {
      throw new Error("RATE_CARD_NOT_ACTIVE");
    }

    return repository.archiveRateCard(rateCardId);
  }
}

export const rateCardActivationService =
  new RateCardActivationService();
