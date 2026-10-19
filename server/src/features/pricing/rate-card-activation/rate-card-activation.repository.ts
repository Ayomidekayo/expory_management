import { prisma } from "../../../config/prisma";


export async function findRateCardForValidation(rateCardId: string) {
  return prisma.rateCard.findUnique({
    where: { id: rateCardId },
    include: {
      configurations: {
        include: {
          options: {
            orderBy: { displayOrder: "asc" },
          },
          pricingSections: {
            include: {
              option: true,
            },
            orderBy: { displayOrder: "asc" },
          },
          airlines: {
            where: { isActive: true },
          },
          components: {
            where: { isActive: true },
            include: {
              option: true,
              pricingSection: {
                include: {
                  option: true,
                },
              },
              weightSlabRates: {
                include: {
                  weightSlab: true,
                },
              },
            },
          },
          weightSlabs: {
            include: {
              rates: {
                include: {
                  component: true,
                },
              },
              option: true,
              pricingSection: {
                include: {
                  option: true,
                },
              },
            },
            orderBy: {
              minWeightKg: "asc",
            },
          },
        },
      },
      components: {
        where: { isActive: true },
        include: {
          option: true,
          pricingSection: {
            include: {
              option: true,
            },
          },
          weightSlabRates: {
            include: {
              weightSlab: true,
            },
          },
        },
      },
      weightSlabs: {
        include: {
          rates: {
            include: {
              component: true,
            },
          },
        },
        orderBy: {
          minWeightKg: "asc",
        },
      },
    },
  });
}

export async function activateRateCard(rateCardId: string) {
  return prisma.$transaction(
    async (tx) => {
      const result = await tx.rateCard.updateMany({
        where: {
          id: rateCardId,
          status: "DRAFT",
        },
        data: {
          status: "ACTIVE",
        },
      });

      if (result.count !== 1) {
        throw new Error("RATE_CARD_STATUS_CHANGED");
      }

      return tx.rateCard.findUniqueOrThrow({
        where: { id: rateCardId },
        include: {
          configurations: true,
        },
      });
    },
    {
      isolationLevel: "Serializable",
    },
  );
}

export async function archiveRateCard(rateCardId: string) {
  return prisma.$transaction(
    async (tx) => {
      const result = await tx.rateCard.updateMany({
        where: {
          id: rateCardId,
          status: "ACTIVE",
        },
        data: {
          status: "ARCHIVED",
        },
      });

      if (result.count !== 1) {
        throw new Error("RATE_CARD_NOT_ACTIVE");
      }

      return tx.rateCard.findUniqueOrThrow({
        where: { id: rateCardId },
      });
    },
    {
      isolationLevel: "Serializable",
    },
  );
}