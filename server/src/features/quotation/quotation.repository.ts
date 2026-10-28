
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
  return prisma.$transaction(async (tx) => {
    const created = await tx.quote.create({
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

    // Persist the QuoteItem ID alongside each pricing line. This gives the
    // submission flow an unambiguous link between a selected checkbox and the
    // exact saved calculation metadata (including percentage basis/rate).
    const rawSnapshot = (data.pricingSnapshot ?? {}) as Record<string, any>;
    const snapshotLines: Array<Record<string, any>> = Array.isArray(rawSnapshot.lines)
      ? rawSnapshot.lines
      : [];
    const usedItemIndexes = new Set<number>();
    const linesWithItemIds = snapshotLines.map((line, lineIndex) => {
      let itemIndex = -1;

      if (line.componentId && !String(line.componentId).startsWith("airline:")) {
        itemIndex = created.items.findIndex(
          (item, index) =>
            !usedItemIndexes.has(index) && item.componentId === line.componentId,
        );
      }

      if (itemIndex < 0) {
        itemIndex = created.items.findIndex(
          (item, index) =>
            !usedItemIndexes.has(index) &&
            item.componentName === line.componentName &&
            (item.componentCode ?? null) === (line.componentCode ?? null) &&
            String(item.calculationType) === String(line.calculationType) &&
            Number(item.quantity) === Number(line.quantity) &&
            Number(item.lineTotal) === Number(line.lineTotal),
        );
      }

      // The service constructs QuoteItem inputs and snapshot lines from the
      // same `lines` array. Use the matching position only as a final fallback.
      if (
        itemIndex < 0 &&
        lineIndex < created.items.length &&
        !usedItemIndexes.has(lineIndex)
      ) {
        itemIndex = lineIndex;
      }

      if (itemIndex < 0) return line;
      usedItemIndexes.add(itemIndex);
      return { ...line, quoteItemId: created.items[itemIndex].id };
    });

    return tx.quote.update({
      where: { id: created.id },
      data: {
        pricingSnapshot: {
          ...rawSnapshot,
          lines: linesWithItemIds,
          selectionRecalculationVersion: 1,
        } as any,
      },
      include: { items: true },
    });
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
  selectedQuoteItems: Array<{
    id: string;
    componentName: string;
    componentCode: string | null;
    quantity: number;
    rateApplied: number;
    lineTotal: number;
  }>;
  currency: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  customsChargeRequested: boolean;
  invoiceValue?: number;
  invoiceCurrency?: string;
  transportChargeRequested: boolean;
  vatEnabled: boolean;
  vatPercentage: number;
}) {
  return prisma.$transaction(async (tx) => {
    const selected = new Set(data.selectedQuoteItemIds);
    const suppliedSelectedItems = new Map(
      data.selectedQuoteItems.map((item) => [item.id, item] as const),
    );

    if (selected.size === 0) throw new Error("SELECT_AT_LEAST_ONE_SERVICE");
    if (
      selected.size !== data.selectedQuoteItemIds.length ||
      suppliedSelectedItems.size !== selected.size ||
      [...selected].some((id) => !suppliedSelectedItems.has(id))
    ) {
      throw new Error("INVALID_SELECTED_QUOTE_ITEM");
    }

    // Atomically claim the quote. Only one submission can transition
    // this quote from CALCULATED to PENDING_REVIEW.
    const claimedQuote = await tx.quote.updateMany({
      where: { id: data.quoteId, status: "CALCULATED" },
      data: {
        source: "ACCOUNT",
        status: "PENDING_REVIEW",
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
      },
    });

    if (claimedQuote.count !== 1) throw new Error("QUOTE_NOT_SUBMITTABLE");

    // Only selected services become request items. The full original quote
    // remains immutable on Quote/QuoteItem for audit and comparison.
    const selectedItems = [...selected].map((id) => suppliedSelectedItems.get(id)!);
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
        customsChargeRequested: data.customsChargeRequested,
        invoiceValue: data.invoiceValue,
        invoiceCurrency: data.invoiceCurrency,
        transportChargeRequested: data.transportChargeRequested,
        vatEnabled: data.vatEnabled,
        vatPercentage: data.vatPercentage,
        status: "PENDING_REVIEW",
        items: {
          create: selectedItems.map((item) => ({
            itemType: "SERVICE",
            quoteItemId: item.id,
            componentName: item.componentName,
            componentCode: item.componentCode,
            quantity: item.quantity,
            rateApplied: item.rateApplied,
            lineTotal: item.lineTotal,
            isSelected: true,
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
              selectionRecalculationVersion: 1,
              customsChargeRequested: data.customsChargeRequested,
              invoiceValue: data.invoiceValue ?? null,
              invoiceCurrency: data.invoiceCurrency ?? null,
              transportChargeRequested: data.transportChargeRequested,
              vatEnabled: data.vatEnabled,
              vatPercentage: data.vatPercentage,
            },
          },
        },
      },
      include: { items: true },
    });

    const reviewers = await tx.user.findMany({
      where: {
        isActive: true,
        OR: [
          { role: "ADMIN" },
          {
            permissions: {
              some: {
                permission: {
                  in: ["REVIEW_QUOTE", "REVIEW_QUOTATIONS", "VIEW_ALL_QUOTES", "MANAGE_QUOTE_CHARGES"],
                },
              },
            },
          },
        ],
      },
      select: { id: true },
    });

    if (reviewers.length > 0) {
      await tx.quoteNotification.createMany({
        data: reviewers.map((reviewer) => ({
          quoteId: data.quoteId,
          recipientUserId: reviewer.id,
          title: "New quotation submission",
          message: `A quotation was submitted with ${selected.size} selected service(s).${data.customsChargeRequested ? ` Customs duties/charges requested for invoice value ${data.invoiceCurrency ?? data.currency} ${Number(data.invoiceValue ?? 0).toFixed(2)}.` : ""}${data.transportChargeRequested ? " Transportation pricing requested." : ""}`,
        })),
      });
    }

    return submission;
  });
}


const chargeMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export async function updateSubmissionCharges(data: {
  submissionId: string;
  adminId: string;
  customsChargeAmount?: number | null;
  transportChargeAmount?: number | null;
}) {
  if (data.customsChargeAmount === undefined && data.transportChargeAmount === undefined) {
    throw new Error("NO_CHARGE_FIELDS_TO_UPDATE");
  }
  for (const value of [data.customsChargeAmount, data.transportChargeAmount]) {
    if (value !== undefined && value !== null && (!Number.isFinite(value) || value < 0)) {
      throw new Error("INVALID_CHARGE_AMOUNT");
    }
  }

  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findUnique({
      where: { id: data.submissionId },
      include: { items: true, quote: { select: { id: true } } },
    });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

    if (data.customsChargeAmount !== undefined && !submission.customsChargeRequested && data.customsChargeAmount !== null) {
      throw new Error("CUSTOMS_CHARGE_NOT_REQUESTED");
    }
    if (data.transportChargeAmount !== undefined && !submission.transportChargeRequested && data.transportChargeAmount !== null) {
      throw new Error("TRANSPORT_CHARGE_NOT_REQUESTED");
    }

    const applyCharge = async (
      itemType: "CUSTOMS_CHARGE" | "TRANSPORT_CHARGE",
      amount: number | null | undefined,
      componentName: string,
      componentCode: string,
    ) => {
      if (amount === undefined) return;
      const existing = await tx.quoteSubmissionItem.findFirst({
        where: { submissionId: submission.id, itemType },
      });
      if (amount === null) {
        if (existing) await tx.quoteSubmissionItem.delete({ where: { id: existing.id } });
        return;
      }
      const rowData = {
        itemType,
        quoteItemId: null,
        componentName,
        componentCode,
        quantity: 1,
        rateApplied: chargeMoney(amount),
        lineTotal: chargeMoney(amount),
        isSelected: true,
      };
      if (existing) {
        await tx.quoteSubmissionItem.update({ where: { id: existing.id }, data: rowData });
      } else {
        await tx.quoteSubmissionItem.create({ data: { submissionId: submission.id, ...rowData } });
      }
    };

    await applyCharge("CUSTOMS_CHARGE", data.customsChargeAmount, "Customs duties and charges", "CUSTOMS_DUTY");
    await applyCharge("TRANSPORT_CHARGE", data.transportChargeAmount, "Additional transportation charge", "TRANSPORT_CHARGE");

    const items = await tx.quoteSubmissionItem.findMany({ where: { submissionId: submission.id } });
    const subtotal = chargeMoney(items.reduce((sum, item) => sum + Number(item.lineTotal), 0));

    // New submissions store an immutable copy of the VAT policy. Older
    // submissions are migrated with 0/default values; infer their original
    // rate from the pre-update subtotal/tax before replacing either total.
    const previousSubtotal = Number(submission.subtotal);
    const previousTax = Number(submission.taxAmount);
    const storedRate = Number(submission.vatPercentage);
    const vatPercentage = storedRate > 0
      ? storedRate
      : previousSubtotal > 0 && previousTax > 0
        ? chargeMoney((previousTax / previousSubtotal) * 10000) / 100
        : 0;
    const vatEnabled = submission.vatEnabled || storedRate > 0 || previousTax > 0;
    const taxAmount = vatEnabled ? chargeMoney((subtotal * vatPercentage) / 100) : 0;
    const totalAmount = chargeMoney(subtotal + taxAmount);

    const updated = await tx.quoteSubmission.update({
      where: { id: submission.id },
      data: { subtotal, taxAmount, totalAmount, vatEnabled, vatPercentage },
      include: { items: true },
    });

    const changes = {
      customsChargeAmount: data.customsChargeAmount === undefined ? "UNCHANGED" : data.customsChargeAmount,
      transportChargeAmount: data.transportChargeAmount === undefined ? "UNCHANGED" : data.transportChargeAmount,
      subtotal,
      vatEnabled,
      vatPercentage,
      taxAmount,
      totalAmount,
      currency: submission.currency,
    };
    await tx.quoteAuditEvent.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        action: "CHARGES_UPDATED",
        actorUserId: data.adminId,
        actorType: "ADMIN",
        details: changes as any,
      },
    });

    const chargeLabel = (label: string, amount: number | null | undefined) => {
      if (amount === undefined) return null;
      return `${label}: ${amount === null ? "removed / not priced" : `${submission.currency} ${chargeMoney(amount).toFixed(2)}`}`;
    };
    const noteLines = [
      chargeLabel("Customs duties and charges", data.customsChargeAmount),
      chargeLabel("Transportation charge", data.transportChargeAmount),
    ].filter((value): value is string => Boolean(value));
    const summary = `Additional charges updated. ${noteLines.join("; ")}. Current subtotal: ${submission.currency} ${subtotal.toFixed(2)}; VAT${vatEnabled ? ` (${vatPercentage}%)` : ""}: ${submission.currency} ${taxAmount.toFixed(2)}; total: ${submission.currency} ${totalAmount.toFixed(2)}.`;

    await tx.quoteMessage.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        senderType: "ADMIN",
        senderUserId: data.adminId,
        message: summary,
      },
    });

    if (submission.exporterId) {
      await tx.quoteNotification.create({
        data: {
          quoteId: submission.quoteId,
          recipientUserId: submission.exporterId,
          title: "Quotation charges updated",
          message: `The quotation team updated the additional charges. Your current quoted total is ${submission.currency} ${totalAmount.toFixed(2)} including applicable VAT.`,
        },
      });
    }

    return updated;
  });
}

export async function listExporterSubmissions(
  exporterId: string,
) {
  return prisma.quoteSubmission.findMany({
    where: { exporterId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      quoteId: true,
      status: true,
      customerName: true,
      currency: true,
      subtotal: true,
      taxAmount: true,
      totalAmount: true,
      customsChargeRequested: true,
      invoiceValue: true,
      invoiceCurrency: true,
      transportChargeRequested: true,
      vatEnabled: true,
      vatPercentage: true,
      customerMessage: true,
      adminMessage: true,
      submittedAt: true,
      reviewedAt: true,
      approvedAt: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
      quote: {
        select: {
          quoteNumber: true,
          goodsDescription: true,
          hsCode: true,
          weightKg: true,
          rateCard: {
            select: {
              name: true,
              mode: true,
              direction: true,
            },
          },
        },
      },
      items: {
        select: {
          id: true,
          itemType: true,
          componentName: true,
          componentCode: true,
          quantity: true,
          rateApplied: true,
          lineTotal: true,
          isSelected: true,
        },
      },
    },
  });
}

export async function findExporterSubmission(
  submissionId: string,
  exporterId: string,
) {
  return prisma.quoteSubmission.findFirst({
    where: {
      id: submissionId,
      exporterId,
    },
    include: {
      quote: {
        select: {
          id: true,
          quoteNumber: true,
          goodsDescription: true,
          hsCode: true,
          weightKg: true,
          rateCard: {
            select: {
              name: true,
              mode: true,
              direction: true,
            },
          },
        },
      },
      items: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          attachments: true,
        },
      },
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function listAdminSubmissions(status?: string) {
  const allowedStatuses = [
    "PENDING_REVIEW",
    "CHANGES_REQUESTED",
    "APPROVED",
    "REJECTED",
    "IN_PROGRESS",
    "COMPLETED",
    "ARCHIVED",
  ] as const;

  if (status && !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    throw new Error("INVALID_SUBMISSION_STATUS");
  }

  return prisma.quoteSubmission.findMany({
    where: status ? { status: status as (typeof allowedStatuses)[number] } : undefined,
    orderBy: { submittedAt: "desc" },
    include: {
      exporter: {
        select: { id: true, name: true, email: true, phone: true },
      },
      quote: {
        select: {
          id: true,
          quoteNumber: true,
          goodsDescription: true,
          hsCode: true,
          weightKg: true,
          quantity: true,
          customsValue: true,
          freightAmount: true,
          currency: true,
          validUntil: true,
          notes: true,
          requiresReview: true,
          inputSnapshot: true,
          pricingSnapshot: true,
          rateCard: {
            select: {
              id: true,
              name: true,
              mode: true,
              direction: true,
              configurations: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  routeLabel: true,
                  routeCode: true,
                  equipmentType: true,
                  options: { select: { id: true, name: true, code: true } },
                },
              },
            },
          },
        },
      },
      items: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          itemType: true,
          quoteItemId: true,
          componentName: true,
          componentCode: true,
          quantity: true,
          rateApplied: true,
          lineTotal: true,
          isSelected: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          senderType: true,
          message: true,
          createdAt: true,
          attachments: {
            select: {
              id: true,
              fileName: true,
              originalName: true,
              fileUrl: true,
              mimeType: true,
              fileSize: true,
              remarks: true,
              uploadedByType: true,
              createdAt: true,
            },
          },
        },
      },
      attachments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fileName: true,
          originalName: true,
          fileUrl: true,
          mimeType: true,
          fileSize: true,
          remarks: true,
          uploadedByType: true,
          createdAt: true,
        },
      },
    },
  });
}

const SUBMISSION_STATUSES = [
  "PENDING_REVIEW",
  "CHANGES_REQUESTED",
  "APPROVED",
  "REJECTED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
] as const;

type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

const AUDIT_ACTION_BY_STATUS = {
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IN_PROGRESS: "WORK_STARTED",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
  PENDING_REVIEW: "REOPENED",
} as const;

export async function updateSubmissionStatus(data: {
  submissionId: string;
  status: SubmissionStatus;
  adminId: string;
  note?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.quoteSubmission.findUnique({
      where: { id: data.submissionId },
      select: {
        id: true,
        quoteId: true,
        status: true,
      },
    });

    if (!existing) {
      throw new Error("SUBMISSION_NOT_FOUND");
    }

    const statusChanged = existing.status !== data.status;
    const now = new Date();
    const note = data.note?.trim();

    const updated = await tx.quoteSubmission.update({
      where: { id: existing.id },
      data: {
        status: data.status,
        ...(note ? { adminMessage: note } : {}),
        reviewedAt:
          data.status === "PENDING_REVIEW"
            ? null
            : existing.status === "PENDING_REVIEW"
              ? now
              : undefined,
        approvedAt:
          data.status === "APPROVED"
            ? now
            : data.status === "PENDING_REVIEW"
              ? null
              : undefined,
        completedAt:
          data.status === "COMPLETED"
            ? now
            : data.status === "PENDING_REVIEW"
              ? null
              : undefined,
        archivedAt:
          data.status === "ARCHIVED"
            ? now
            : data.status === "PENDING_REVIEW"
              ? null
              : undefined,
      },
    });

    if (statusChanged) {
      await tx.quoteAuditEvent.create({
        data: {
          quoteId: existing.quoteId,
          submissionId: existing.id,
          action: AUDIT_ACTION_BY_STATUS[data.status],
          actorUserId: data.adminId,
          actorType: "ADMIN",
          details: {
            previousStatus: existing.status,
            newStatus: data.status,
            note: note ?? null,
          },
        },
      });
    }

    // A status note is also a conversation message.
    if (note) {
      await tx.quoteMessage.create({
        data: {
          quoteId: existing.quoteId,
          submissionId: existing.id,
          senderType: "ADMIN",
          senderUserId: data.adminId,
          message: note,
        },
      });
    }

    return updated;
  });
}


export async function addSubmissionMessage(data: {
  submissionId: string;
  adminId: string;
  message: string;
}) {
  const submission = await prisma.quoteSubmission.findUnique({
    where: { id: data.submissionId },
    select: { id: true, quoteId: true },
  });

  if (!submission) {
    throw new Error("SUBMISSION_NOT_FOUND");
  }

  return prisma.$transaction(async (tx) => {
    const message = await tx.quoteMessage.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        senderType: "ADMIN",
        senderUserId: data.adminId,
        message: data.message.trim(),
      },
    });

    await tx.quoteAuditEvent.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        action: "REOPENED",
        actorUserId: data.adminId,
        actorType: "ADMIN",
        details: { event: "ADMIN_NOTE_ADDED" },
      },
    });

    return message;
  });
}


export async function addExporterSubmissionMessage(data: {
  submissionId: string;
  exporterId: string;
  message: string;
}) {
  const messageText = data.message.trim();

  if (!messageText || messageText.length > 5000) {
    throw new Error("INVALID_SUBMISSION_MESSAGE");
  }

  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findFirst({
      where: {
        id: data.submissionId,
        exporterId: data.exporterId,
      },
      select: {
        id: true,
        quoteId: true,
      },
    });

    if (!submission) {
      throw new Error("SUBMISSION_NOT_FOUND");
    }

    const message = await tx.quoteMessage.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        senderType: "EXPORTER",
        senderUserId: data.exporterId,
        message: messageText,
      },
    });

    const reviewers = await tx.user.findMany({
      where: {
        isActive: true,
        OR: [
          { role: "ADMIN" },
          {
            permissions: {
              some: {
                permission: {
                  in: [
                    "REVIEW_QUOTE",
                    "REVIEW_QUOTATIONS",
                    "VIEW_ALL_QUOTES",
                  ],
                },
              },
            },
          },
        ],
      },
      select: { id: true },
    });

    if (reviewers.length > 0) {
      await tx.quoteNotification.createMany({
        data: reviewers.map((reviewer) => ({
          quoteId: submission.quoteId,
          recipientUserId: reviewer.id,
          title: "New exporter message",
          message: "An exporter sent a message about a quotation.",
        })),
      });
    }

    return message;
  });
}

