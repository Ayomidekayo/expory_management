import { prisma } from "../../../config/prisma";

import type {
  CreateRateCardAirlineInput,
  UpdateRateCardAirlineInput,
} from "./rate-card-airline.types";

export async function findRateCard(rateCardId: string) {
  return prisma.rateCard.findUnique({
    where: {
      id: rateCardId,
    },
    select: {
      id: true,
      name: true,
      status: true,
      mode: true,
      direction: true,
    },
  });
}

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

export async function listAirlines(
  configurationId: string,
  activeOnly = false,
) {
  return prisma.rateCardAirline.findMany({
    where: {
      configurationId,
      ...(activeOnly ? { isActive: true } : {}),
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function findAirlineById(id: string) {
  return prisma.rateCardAirline.findUnique({
    where: {
      id,
    },
  });
}

export async function findAirlineByCode(
  configurationId: string,
  code: string,
) {
  return prisma.rateCardAirline.findUnique({
    where: {
      configurationId_code: {
        configurationId,
        code,
      },
    },
  });
}

export async function createAirline(
  input: CreateRateCardAirlineInput,
) {
  return prisma.rateCardAirline.create({
    data: {
      configurationId: input.configurationId,
      code: input.code,
      name: input.name,
      ratePerKg: input.ratePerKg,
      displayOrder: input.displayOrder ?? 0,
      isActive: input.isActive ?? true,
    },
  });
}

export async function updateAirline(
  id: string,
  input: UpdateRateCardAirlineInput,
) {
  return prisma.rateCardAirline.update({
    where: {
      id,
    },
    data: {
      ...(input.code !== undefined && {
        code: input.code,
      }),

      ...(input.name !== undefined && {
        name: input.name,
      }),

      ...(input.ratePerKg !== undefined && {
        ratePerKg: input.ratePerKg,
      }),

      ...(input.displayOrder !== undefined && {
        displayOrder: input.displayOrder,
      }),

      ...(input.isActive !== undefined && {
        isActive: input.isActive,
      }),
    },
  });
}