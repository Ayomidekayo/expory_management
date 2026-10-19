import { prisma } from "../../../config/prisma";
import type {
  CreateRateCardOptionInput,
  UpdateRateCardOptionInput,
} from "./rate-card-option.types";

export const rateCardOptionRepository = {
  findConfiguration(configurationId: string) {
    return prisma.rateCardConfiguration.findUnique({
      where: { id: configurationId },
      include: { rateCard: { select: { id: true, status: true, mode: true, direction: true } } },
    });
  },

  list(configurationId: string) {
    return prisma.rateCardOption.findMany({
      where: { configurationId },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { components: true, weightSlabs: true, pricingSections: true } } },
    });
  },

  findById(id: string) {
    return prisma.rateCardOption.findUnique({
      where: { id },
      include: { configuration: { include: { rateCard: { select: { id: true, status: true } } } } },
    });
  },

  findByCode(configurationId: string, code: string) {
    return prisma.rateCardOption.findFirst({ where: { configurationId, code } });
  },

  create(configurationId: string, input: CreateRateCardOptionInput) {
    const { configurationId: _ignored, ...data } = input;
    return prisma.rateCardOption.create({
      data: {
        configurationId,
        code: data.code.trim().toUpperCase().replace(/\s+/g, "_"),
        name: data.name.trim(),
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  update(id: string, input: UpdateRateCardOptionInput) {
    return prisma.rateCardOption.update({
      where: { id },
      data: {
        ...(input.code !== undefined && { code: input.code.trim().toUpperCase().replace(/\s+/g, "_") }),
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.displayOrder !== undefined && { displayOrder: input.displayOrder }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });
  },
};
