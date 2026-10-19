

import { prisma } from "../../../config/prisma";
import type {
  CreatePricingSectionInput,
  UpdatePricingSectionInput,
} from "./rate-card-pricing-section.types";

export async function findConfiguration(
  configurationId: string,
) {
  return prisma.rateCardConfiguration.findUnique({
    where: {
      id: configurationId,
    },
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

export async function findSection(
  sectionId: string,
) {
  return prisma.rateCardPricingSection.findUnique({
    where: {
      id: sectionId,
    },
    include: {
      configuration: {
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
      },
      option: true,
      components: {
        orderBy: {
          name: "asc",
        },
      },
      weightSlabs: {
        orderBy: {
          minWeightKg: "asc",
        },
        include: {
          rates: {
            include: {
              component: true,
            },
          },
        },
      },
    },
  });
}

export async function listSections(
  configurationId: string,
  activeOnly = false,
) {
  return prisma.rateCardPricingSection.findMany({
    where: {
      configurationId,
      ...(activeOnly ? { isActive: true } : {}),
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    include: {
      option: true,
      _count: {
        select: {
          components: true,
          weightSlabs: true,
        },
      },
    },
  });
}

export async function findOption(
  optionId: string,
) {
  return prisma.rateCardOption.findUnique({
    where: {
      id: optionId,
    },
  });
}

export async function findSectionByCode(
  configurationId: string,
  code: string,
) {
  return prisma.rateCardPricingSection.findUnique({
    where: {
      configurationId_code: {
        configurationId,
        code,
      },
    },
  });
}

export async function createSection(
  configurationId: string,
  input: CreatePricingSectionInput,
) {
  return prisma.rateCardPricingSection.create({
    data: {
      configurationId,
      code: input.code,
      name: input.name,
      currency: input.currency,
      optionId: input.optionId ?? null,
      displayOrder: input.displayOrder,
      isActive: input.isActive,
    },
    include: {
      option: true,
      components: true,
      weightSlabs: true,
    },
  });
}

export async function updateSection(
  sectionId: string,
  input: UpdatePricingSectionInput,
) {
  return prisma.rateCardPricingSection.update({
    where: {
      id: sectionId,
    },
    data: {
      ...(input.name !== undefined && {
        name: input.name,
      }),
      ...(input.currency !== undefined && {
        currency: input.currency,
      }),
      ...(input.optionId !== undefined && {
        optionId: input.optionId,
      }),
      ...(input.displayOrder !== undefined && {
        displayOrder: input.displayOrder,
      }),
      ...(input.isActive !== undefined && {
        isActive: input.isActive,
      }),
    },
    include: {
      option: true,
      components: true,
      weightSlabs: true,
    },
  });
}


export async function countWeightSlabsForSection(
  sectionId: string,
) {
  return prisma.weightSlab.count({
    where: {
      pricingSectionId: sectionId,
    },
  });
}
