
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
          quoteId: data.quoteId,
          recipientUserId: reviewer.id,
          title: "New quotation submission",
          message: `A quotation was submitted with ${selected.size} selected service(s).`,
        })),
      });
    }
;

    return submission;
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
      totalAmount: true,
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

  if (
    status &&
    !allowedStatuses.includes(
      status as (typeof allowedStatuses)[number],
    )
  ) {
    throw new Error("INVALID_SUBMISSION_STATUS");
  }

  return prisma.quoteSubmission.findMany({
    where: status
      ? { status: status as (typeof allowedStatuses)[number] }
      : undefined,
    orderBy: { submittedAt: "desc" },
    include: {
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

