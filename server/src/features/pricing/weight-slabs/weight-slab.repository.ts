import { prisma } from "../../../config/prisma";



export async function findRateCard(rateCardId: string) {
  return prisma.rateCard.findUnique({
    where: { id: rateCardId },
  });
}

export async function findConfiguration(configurationId: string) {
  return prisma.rateCardConfiguration.findUnique({
    where: { id: configurationId },
    include: {
      rateCard: true,
    },
  });
}

export async function findOption(optionId: string) {
  return prisma.rateCardOption.findUnique({
    where: { id: optionId },
  });
}

export async function findPricingSection(pricingSectionId: string) {
  return prisma.rateCardPricingSection.findUnique({
    where: { id: pricingSectionId },
  });
}

export async function findWeightSlabById(weightSlabId: string) {
  return prisma.weightSlab.findUnique({
    where: { id: weightSlabId },
    include: {
      rateCard: true,
      configuration: true,
      option: true,
      pricingSection: true,
      rates: {
        include: {
          component: true,
        },
        orderBy: {
          component: {
            name: "asc",
          },
        },
      },
    },
  });
}

export async function listWeightSlabs(
  rateCardId: string,
  filters?: {
    configurationId?: string;
    optionId?: string;
    pricingSectionId?: string;
  },
) {
  return prisma.weightSlab.findMany({
    where: {
      rateCardId,
      ...(filters?.configurationId
        ? { configurationId: filters.configurationId }
        : {}),
      ...(filters?.optionId ? { optionId: filters.optionId } : {}),
      ...(filters?.pricingSectionId
        ? { pricingSectionId: filters.pricingSectionId }
        : {}),
    },
    include: {
      configuration: true,
      option: true,
      pricingSection: true,
      rates: {
        include: {
          component: true,
        },
      },
      _count: {
        select: {
          rates: true,
        },
      },
    },
    orderBy: [
      { minWeightKg: "asc" },
      { displayOrder: "asc" },
    ],
  });
}



export async function createWeightSlabWithRates(data: {
  rateCardId: string;
  configurationId?: string | null;
  optionId?: string | null;
  pricingSectionId?: string | null;
  label: string;
  minWeightKg: number;
  maxWeightKg?: number | null;
  displayOrder: number;
  rates: Array<{
    componentId: string;
    amount: number;
  }>;
}) {
  return prisma.$transaction(async (tx) => {
    const slab = await tx.weightSlab.create({
      data: {
        rateCardId: data.rateCardId,
        configurationId: data.configurationId ?? null,
        optionId: data.optionId ?? null,
        pricingSectionId: data.pricingSectionId ?? null,
        label: data.label,
        minWeightKg: data.minWeightKg,
        maxWeightKg: data.maxWeightKg ?? null,
        displayOrder: data.displayOrder,
      },
    });

    await tx.weightSlabRate.createMany({
      data: data.rates.map((rate) => ({
        weightSlabId: slab.id,
        componentId: rate.componentId,
        amount: rate.amount,
      })),
    });

    return tx.weightSlab.findUniqueOrThrow({
      where: { id: slab.id },
      include: {
        configuration: true,
        option: true,
        pricingSection: true,
        rates: {
          include: {
            component: true,
          },
          orderBy: {
            component: {
              name: "asc",
            },
          },
        },
      },
    });
  });
}

export async function findOverlappingSlab(
  rateCardId: string,
  minWeightKg: number,
  maxWeightKg: number | null,
  scope: {
    configurationId: string | null;
    optionId: string | null;
    pricingSectionId: string | null;
  },
  excludeId?: string,
) {
  const existingSlabs = await prisma.weightSlab.findMany({
    where: {
      rateCardId,
      configurationId: scope.configurationId,
      optionId: scope.optionId,
      pricingSectionId: scope.pricingSectionId,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: {
      id: true,
      label: true,
      minWeightKg: true,
      maxWeightKg: true,
    },
  });

  const newMax =
    maxWeightKg === null ? Infinity : maxWeightKg;

  return existingSlabs.find((slab) => {
    const existingMin = Number(slab.minWeightKg);
    const existingMax =
      slab.maxWeightKg === null
        ? Infinity
        : Number(slab.maxWeightKg);

    // Weight ranges are half-open: [min, max).
    // Therefore, 0–100 and 100–200 are allowed.
    return (
      minWeightKg < existingMax &&
      existingMin < newMax
    );
  });
}


export async function createWeightSlab(data: {
  rateCardId: string;
  configurationId?: string | null;
  optionId?: string | null;
  pricingSectionId?: string | null;
  label: string;
  minWeightKg: number;
  maxWeightKg?: number | null;
  displayOrder: number;
}) {
  return prisma.weightSlab.create({
    data: {
      rateCardId: data.rateCardId,
      configurationId: data.configurationId ?? null,
      optionId: data.optionId ?? null,
      pricingSectionId: data.pricingSectionId ?? null,
      label: data.label,
      minWeightKg: data.minWeightKg,
      maxWeightKg: data.maxWeightKg ?? null,
      displayOrder: data.displayOrder,
    },
    include: {
      configuration: true,
      option: true,
      pricingSection: true,
      rates: true,
    },
  });
}

export async function updateWeightSlab(
  weightSlabId: string,
  data: {
    configurationId?: string | null;
    optionId?: string | null;
    pricingSectionId?: string | null;
    label?: string;
    minWeightKg?: number;
    maxWeightKg?: number | null;
    displayOrder?: number;
  },
) {
  return prisma.weightSlab.update({
    where: { id: weightSlabId },
    data,
    include: {
      configuration: true,
      option: true,
      pricingSection: true,
      rates: {
        include: {
          component: true,
        },
      },
    },
  });
}

export async function deleteWeightSlab(weightSlabId: string) {
  return prisma.weightSlab.delete({
    where: { id: weightSlabId },
  });
}

export async function findComponentsForSlabRates(
  rateCardId: string,
  componentIds: string[],
) {
  return prisma.rateComponent.findMany({
    where: {
      rateCardId,
      id: { in: componentIds },
      isActive: true,
      calculationType: "WEIGHT_SLAB",
    },
    select: {
      id: true,
      name: true,
      configurationId: true,
      optionId: true,
      pricingSectionId: true,
      rateCardId: true,
      isActive: true,
      calculationType: true,
    },
  });
}


export async function replaceSlabRates(
  weightSlabId: string,
  rates: Array<{
    componentId: string;
    amount: number;
  }>,
) {
  return prisma.$transaction(async (tx) => {
    const submittedIds = rates.map(
      (rate) => rate.componentId,
    );

    // Remove rates omitted from the submitted complete list.
    await tx.weightSlabRate.deleteMany({
      where: {
        weightSlabId,
        ...(submittedIds.length > 0
          ? { componentId: { notIn: submittedIds } }
          : {}),
      },
    });

    for (const rate of rates) {
      await tx.weightSlabRate.upsert({
        where: {
          weightSlabId_componentId: {
            weightSlabId,
            componentId: rate.componentId,
          },
        },
        create: {
          weightSlabId,
          componentId: rate.componentId,
          amount: rate.amount,
        },
        update: {
          amount: rate.amount,
        },
      });
    }

    return tx.weightSlab.findUniqueOrThrow({
      where: { id: weightSlabId },
      include: {
        rates: {
          include: {
            component: true,
          },
          orderBy: {
            component: {
              name: "asc",
            },
          },
        },
      },
    });
  });
}
