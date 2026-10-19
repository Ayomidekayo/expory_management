

import { prisma } from "../../../config/prisma";
import type {
  CreateRateComponentInput,
  UpdateRateComponentInput,
} from "./rate-component.types";

export async function findRateCard(rateCardId: string) {
  return prisma.rateCard.findUnique({
    where: { id: rateCardId },
    select: {
      id: true,
      status: true,
      mode: true,
      direction: true,
    },
  });
}

export async function findComponent(componentId: string) {
  return prisma.rateComponent.findUnique({
    where: { id: componentId },
    include: {
      rateCard: {
        select: {
          id: true,
          status: true,
          mode: true,
          direction: true,
        },
      },
      configuration: true,
      option: true,
      pricingSection: true,
      weightSlabRates: {
        include: {
          weightSlab: true,
        },
      },
    },
  });
}

export async function listComponents(
  rateCardId: string,
  filters: {
    activeOnly?: boolean;
    pricingSectionId?: string;
    optionId?: string;
  } = {},
) {
  return prisma.rateComponent.findMany({
    where: {
      rateCardId,
      ...(filters.activeOnly ? { isActive: true } : {}),
      ...(filters.pricingSectionId
        ? { pricingSectionId: filters.pricingSectionId }
        : {}),
      ...(filters.optionId
        ? { optionId: filters.optionId }
        : {}),
    },
    orderBy: [
      { name: "asc" },
      { createdAt: "asc" },
    ],
    include: {
      configuration: true,
      option: true,
      pricingSection: true,
      weightSlabRates: true,
    },
  });
}

export async function findConfiguration(
  configurationId: string,
) {
  return prisma.rateCardConfiguration.findUnique({
    where: { id: configurationId },
    include: {
      rateCard: {
        select: {
          id: true,
          status: true,
          mode: true,
          direction: true,
        },
      },
    },
  });
}


export async function findOption(optionId: string) {
  return prisma.rateCardOption.findUnique({
    where: { id: optionId },
    include: {
      configuration: {
        select: {
          id: true,
          rateCardId: true,
        },
      },
    },
  });
}

export async function findPricingSection(
  pricingSectionId: string,
) {
  return prisma.rateCardPricingSection.findUnique({
    where: { id: pricingSectionId },
    include: {
      configuration: {
        select: {
          id: true,
          rateCardId: true,
        },
      },
    },
  });
}

export async function findComponentByCode(
  rateCardId: string,
  code: string,
) {
  return prisma.rateComponent.findFirst({
    where: {
      rateCardId,
      code,
    },
  });
}

export async function createComponent(
  rateCardId: string,
  configurationId: string | null,
  input: CreateRateComponentInput,
) {
  return prisma.rateComponent.create({
    data: {
      rateCardId,
      configurationId,
      name: input.name,
      code: input.code,
      calculationType: input.calculationType,
      calculationBasis: input.calculationBasis ?? null,
      unit: input.unit ?? null,
      value: input.value ?? null,
      percentage: input.percentage ?? null,
      isActive: input.isActive,
      isOptional: input.isOptional,
      isTaxable: input.isTaxable,
      notes: input.notes ?? null,
      optionId: input.optionId ?? null,
      pricingSectionId: input.pricingSectionId ?? null,
    },
    include: {
      configuration: true,
      option: true,
      pricingSection: true,
    },
  });
}


export async function updateComponent(
  componentId: string,
  input: UpdateRateComponentInput & {
    configurationId?: string | null;
  },
) {
  return prisma.rateComponent.update({
    where: { id: componentId },
    data: {
      ...(input.configurationId !== undefined && {
        configurationId: input.configurationId,
      }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.code !== undefined && { code: input.code }),
      ...(input.calculationType !== undefined && {
        calculationType: input.calculationType,
      }),
      ...(input.calculationBasis !== undefined && {
        calculationBasis: input.calculationBasis,
      }),
      ...(input.unit !== undefined && { unit: input.unit }),
      ...(input.value !== undefined && { value: input.value }),
      ...(input.percentage !== undefined && {
        percentage: input.percentage,
      }),
      ...(input.isActive !== undefined && {
        isActive: input.isActive,
      }),
      ...(input.isOptional !== undefined && {
        isOptional: input.isOptional,
      }),
      ...(input.isTaxable !== undefined && {
        isTaxable: input.isTaxable,
      }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.optionId !== undefined && {
        optionId: input.optionId,
      }),
      ...(input.pricingSectionId !== undefined && {
        pricingSectionId: input.pricingSectionId,
      }),
    },
    include: {
      configuration: true,
      option: true,
      pricingSection: true,
    },
  });
}
