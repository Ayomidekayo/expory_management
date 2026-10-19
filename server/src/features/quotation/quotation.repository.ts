
import { prisma } from "../../config/prisma";
import type { PublicRateCardFilters } from "./quotation.types";

export async function listPublicRateCards(filters: PublicRateCardFilters) {
  const now = new Date();
  return prisma.rateCard.findMany({
    where: {
      status: "ACTIVE",
      effectiveFrom: { lte: now },
      OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }],
      ...(filters.mode ? { mode: filters.mode } : {}),
      ...(filters.direction ? { direction: filters.direction } : {}),
    },
    select: {
      id: true, name: true, mode: true, direction: true, currency: true,
      effectiveFrom: true, effectiveTo: true,
      configurations: {
        where: { isActive: true },
        select: { id: true, name: true, code: true, currency: true, routeCode: true, routeLabel: true, equipmentType: true, displayOrder: true },
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: [{ mode: "asc" }, { direction: "asc" }, { name: "asc" }],
  });
}

export async function findPublicRateCardConfiguration(rateCardId: string, configurationId?: string) {
  const now = new Date();
  return prisma.rateCard.findFirst({
    where: {
      id: rateCardId,
      status: "ACTIVE",
      effectiveFrom: { lte: now },
      OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }],
    },
    include: {
      configurations: {
        where: { isActive: true, ...(configurationId ? { id: configurationId } : {}) },
        orderBy: { displayOrder: "asc" },
        include: {
          options: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
          pricingSections: { where: { isActive: true }, include: { option: true }, orderBy: { displayOrder: "asc" } },
          airlines: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
          components: {
            where: { isActive: true },
            include: { option: true, pricingSection: { include: { option: true } }, weightSlabRates: { include: { weightSlab: true } } },
          },
          weightSlabs: {
            include: { rates: { include: { component: true } }, option: true, pricingSection: true },
            orderBy: [{ displayOrder: "asc" }, { minWeightKg: "asc" }],
          },
        },
      },
      components: {
        where: { isActive: true, configurationId: null },
        include: { weightSlabRates: { include: { weightSlab: true } } },
      },
      weightSlabs: {
        where: { configurationId: null },
        include: { rates: { include: { component: true } } },
        orderBy: [{ displayOrder: "asc" }, { minWeightKg: "asc" }],
      },
    },
  });
}

export async function createCalculatedQuote(data: {
  rateCardId: string;
  quoteNumber: string;
  source: "GUEST" | "ACCOUNT";
  customerName?: string;
  email?: string;
  phone?: string;
  weightKg?: number;
  goodsDescription?: string;
  hsCode?: string;
  customsValue?: number;
  freightAmount?: number;
  quantity?: number;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  requiresReview: boolean;
  inputSnapshot: unknown;
  pricingSnapshot: unknown;
  items: Array<{
    componentId: string;
    componentName: string;
    componentCode: string | null;
    calculationType: any;
    calculationBasis: any;
    unit: string | null;
    rateApplied: number;
    quantity: number;
    lineTotal: number;
    isEstimate: boolean;
    requiresReview: boolean;
    remarks: string | null;
  }>;

  
}) {

  
  return prisma.quote.create({
    data: {
      rateCardId: data.rateCardId,
      quoteNumber: data.quoteNumber,
      source: data.source,
      status: "CALCULATED",
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      weightKg: data.weightKg,
      goodsDescription: data.goodsDescription,
      hsCode: data.hsCode,
      customsValue: data.customsValue,
      freightAmount: data.freightAmount,
      quantity: data.quantity,
      currency: data.currency,
      subtotal: data.subtotal,
      totalAmount: data.totalAmount,
      requiresReview: data.requiresReview,
      inputSnapshot: data.inputSnapshot as any,
      pricingSnapshot: data.pricingSnapshot as any,
      items: { create: data.items.map((item) => ({ ...item })) },
    },
    include: { items: true },
  });
}

export async function findQuoteForSubmission(quoteId: string) {
  return prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true, rateCard: true } });
}


export async function createSubmission(data: {
  quoteId: string;
  exporterId: string;
  customerName?: string;
  email?: string;
  phone?: string;
  customerMessage?: string;
  selectedQuoteItemIds: string[];
  quoteItems: Array<{
    id: string;
    componentName: string;
    componentCode: string | null;
    quantity: any;
    rateApplied: any;
    lineTotal: any;
  }>;
  currency: string;
  subtotal: any;
  taxAmount: any;
  totalAmount: any;
}) {
  return prisma.$transaction(async (tx) => {
    const selected = new Set(data.selectedQuoteItemIds);
    const validIds = new Set(data.quoteItems.map((item) => item.id));

    if (selected.size === 0) {
      throw new Error("SELECT_AT_LEAST_ONE_SERVICE");
    }

    for (const id of selected) {
      if (!validIds.has(id)) {
        throw new Error("INVALID_SELECTED_QUOTE_ITEM");
      }
    }

    // Atomically claim the quote. Only one submission can transition
    // this quote from CALCULATED to PENDING_REVIEW.
    const claimedQuote = await tx.quote.updateMany({
      where: {
        id: data.quoteId,
        status: "CALCULATED",
      },
      data: {
        source: "ACCOUNT",
        status: "PENDING_REVIEW",
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
      },
    });

    if (claimedQuote.count !== 1) {
      throw new Error("QUOTE_NOT_SUBMITTABLE");
    }

    const submission = await tx.quoteSubmission.create({
      data: {
        quoteId: data.quoteId,
        exporterId: data.exporterId,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        customerMessage: data.customerMessage,
        currency: data.currency,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        totalAmount: data.totalAmount,
        status: "PENDING_REVIEW",

        // Preserve all available services, marking only the selected
        // ones as requested by the exporter.
        items: {
          create: data.quoteItems.map((item) => ({
            quoteItemId: item.id,
            componentName: item.componentName,
            componentCode: item.componentCode,
            quantity: item.quantity,
            rateApplied: item.rateApplied,
            lineTotal: item.lineTotal,
            isSelected: selected.has(item.id),
          })),
        },

        auditEvents: {
          create: {
            quoteId: data.quoteId,
            action: "SUBMITTED",
            actorUserId: data.exporterId,
            actorType: "EXPORTER",
            details: {
              selectedQuoteItemIds: [...selected],
              subtotal: data.subtotal,
              taxAmount: data.taxAmount,
              totalAmount: data.totalAmount,
              currency: data.currency,
            },
          },
        },
      },
      include: {
        items: true,
      },
    });

    await tx.quoteNotification.create({
      data: {
        quoteId: data.quoteId,
        title: "New quotation service request",
        message: `A customer submitted a request for ${selected.size} selected service(s).`,
      },
    });

    return submission;
  });
}

