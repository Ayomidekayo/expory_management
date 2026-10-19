import { prisma } from "../../../config/prisma";
import type {
  CreateRateCardConfigurationInput,
  UpdateRateCardConfigurationInput,
} from "./rate-card-configuration.types";

export async function findRateCard(rateCardId: string) {
  return prisma.rateCard.findUnique({
    where: { id: rateCardId },
    select: { id: true, name: true, status: true, mode: true, direction: true },
  });
}

export async function listConfigurations(rateCardId: string) {
  return prisma.rateCardConfiguration.findMany({
    where: { rateCardId },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    include: {
      _count: { select: { components: true, weightSlabs: true, airlines: true, options: true, pricingSections: true } },
    },
  });
}

export async function findConfigurationById(id: string) {
  return prisma.rateCardConfiguration.findUnique({
    where: { id },
    include: {
      rateCard: { select: { id: true, name: true, status: true, mode: true, direction: true } },
      options: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      pricingSections: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      components: { orderBy: [{ name: "asc" }, { createdAt: "asc" }] },
      weightSlabs: {
        orderBy: [{ minWeightKg: "asc" }],
        include: { rates: { include: { component: true } } },
      },
      airlines: { orderBy: [{ displayOrder: "asc" }, { name: "asc" }] },
    },
  });
}

export async function findConfiguration(id: string) {
  return prisma.rateCardConfiguration.findUnique({
    where: { id },
    select: {
      id: true,
      rateCardId: true,
      code: true,
      vatEnabled: true,
      vatPercentage: true,
      vatCalculationBasis: true,
      rateCard: { select: { status: true, mode: true, direction: true } },
    },
  });
}

export async function findConfigurationByCode(rateCardId: string, code: string) {
  return prisma.rateCardConfiguration.findFirst({
    where: { rateCardId, code },
    select: { id: true },
  });
}

export async function createConfiguration(
  rateCardId: string,
  input: CreateRateCardConfigurationInput,
) {
  return prisma.rateCardConfiguration.create({
    data: {
      rateCardId,
      name: input.name,
      code: input.code,
      currency: input.currency ?? "NGN",
      routeCode: input.routeCode ?? null,
      routeLabel: input.routeLabel ?? null,
      equipmentType: input.equipmentType ?? null,
      airlineSelectorEnabled: input.airlineSelectorEnabled ?? false,
      transportEnabled: input.transportEnabled ?? false,
      nafdacEnabled: input.nafdacEnabled ?? false,
      vatEnabled: input.vatEnabled ?? false,
      vatPercentage: input.vatPercentage ?? 7.5,
      vatCalculationBasis: input.vatCalculationBasis ?? null,
      weightEnabled: input.weightEnabled ?? false,
      freightAmountEnabled: input.freightAmountEnabled ?? false,
      customsValueEnabled: input.customsValueEnabled ?? false,
      quantityEnabled: input.quantityEnabled ?? false,
      isActive: input.isActive ?? true,
      displayOrder: input.displayOrder ?? 0,
    },
  });
}

export async function updateConfiguration(
  id: string,
  input: UpdateRateCardConfigurationInput,
) {
  return prisma.rateCardConfiguration.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.code !== undefined && { code: input.code }),
      ...(input.currency !== undefined && { currency: input.currency }),
      ...(input.routeCode !== undefined && { routeCode: input.routeCode }),
      ...(input.routeLabel !== undefined && { routeLabel: input.routeLabel }),
      ...(input.equipmentType !== undefined && { equipmentType: input.equipmentType }),
      ...(input.airlineSelectorEnabled !== undefined && { airlineSelectorEnabled: input.airlineSelectorEnabled }),
      ...(input.transportEnabled !== undefined && { transportEnabled: input.transportEnabled }),
      ...(input.nafdacEnabled !== undefined && { nafdacEnabled: input.nafdacEnabled }),
      ...(input.vatEnabled !== undefined && { vatEnabled: input.vatEnabled }),
      ...(input.vatPercentage !== undefined && { vatPercentage: input.vatPercentage }),
      ...(input.vatCalculationBasis !== undefined && { vatCalculationBasis: input.vatCalculationBasis }),
      ...(input.weightEnabled !== undefined && { weightEnabled: input.weightEnabled }),
      ...(input.freightAmountEnabled !== undefined && { freightAmountEnabled: input.freightAmountEnabled }),
      ...(input.customsValueEnabled !== undefined && { customsValueEnabled: input.customsValueEnabled }),
      ...(input.quantityEnabled !== undefined && { quantityEnabled: input.quantityEnabled }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
    },
  });
}
