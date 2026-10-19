import { prisma } from "../../../config/prisma";

import {
  RateCardStatus,
} from "../../../generated";

import {
  CreateRateCardInput,
  UpdateRateCardInput,
  ListRateCardsFilters,
} from "./rate-card.types";

export const rateCardRepository = {
  /**
   * List rate cards with optional filters.
   */
  findMany(filters: ListRateCardsFilters) {
    return prisma.rateCard.findMany({
      where: {
        ...(filters.mode !== undefined && {
          mode: filters.mode,
        }),

        ...(filters.direction !== undefined && {
          direction: filters.direction,
        }),

        ...(filters.status !== undefined && {
          status: filters.status,
        }),
      },

      include: {
        _count: {
          select: {
            components: true,
            weightSlabs: true,
            notes: true,
            quotes: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Retrieve a single rate card with its components,
   * weight slabs, slab rates, notes, and counts.
   */
  findById(id: string) {
    return prisma.rateCard.findUnique({
      where: {
        id,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        components: {
          orderBy: {
            createdAt: "asc",
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

        notes: {
          orderBy: {
            createdAt: "asc",
          },
        },

        _count: {
          select: {
            quotes: true,
          },
        },
      },
    });
  },

  /**
   * Retrieve a rate card with the relationships
   * required to validate activation.
   */
  /**
   * Retrieve a rate card with configuration-specific
   * pricing relationships required for activation.
   */
  findForActivation(id: string) {
    return prisma.rateCard.findUnique({
      where: {
        id,
      },

      include: {
        configurations: {
          orderBy: [
            {
              displayOrder: "asc",
            },
            {
              name: "asc",
            },
          ],

          include: {
            components: {
              where: {
                isActive: true,
              },

              include: {
                weightSlabRates: true,
              },

              orderBy: {
                createdAt: "asc",
              },
            },

            weightSlabs: {
              orderBy: {
                minWeightKg: "asc",
              },

              include: {
                rates: true,
              },
            },
          },
        },
      },
    });
  },

  /**
   * Check whether another active rate card overlaps
   * the requested effective date range.
   */
  /**
   * Retrieve a rate card with configuration-specific
   * pricing relationships required for activation.
   */
 

  /**
   * Create a draft rate card.
   */
  create(
    input: CreateRateCardInput,
    createdById: string,
  ) {
    return prisma.rateCard.create({
      data: {
        name: input.name.trim(),

        mode: input.mode,

        direction: input.direction,

        currency: (
          input.currency ?? "NGN"
        ).toUpperCase(),

        effectiveFrom: input.effectiveFrom
          ? new Date(input.effectiveFrom)
          : new Date(),

        effectiveTo:
          input.effectiveTo === undefined ||
          input.effectiveTo === null
            ? null
            : new Date(input.effectiveTo),

        createdById,

        status: RateCardStatus.DRAFT,
      },
    });
  },

  /**
   * Update the editable details of a draft rate card.
   */
  update(
    id: string,
    input: UpdateRateCardInput,
  ) {
    return prisma.rateCard.update({
      where: {
        id,
      },

      data: {
        ...(input.name !== undefined && {
          name: input.name.trim(),
        }),

        ...(input.currency !== undefined && {
          currency: input.currency.toUpperCase(),
        }),

        ...(input.effectiveFrom !== undefined && {
          effectiveFrom: new Date(
            input.effectiveFrom,
          ),
        }),

        ...(input.effectiveTo !== undefined && {
          effectiveTo:
            input.effectiveTo === null
              ? null
              : new Date(input.effectiveTo),
        }),
      },
    });
  },

  /**
   * Activate a rate card only if it is still a draft.
   *
   * The conditional update prevents an ordinary
   * concurrent request from activating an already
   * changed rate card.
   */
  activate(id: string) {
    return prisma.rateCard.updateMany({
      where: {
        id,
        status: RateCardStatus.DRAFT,
      },

      data: {
        status: RateCardStatus.ACTIVE,
      },
    });
  },
    /**
   * Retrieve a rate card with configuration-specific
   * pricing relationships required for activation.
   */

};