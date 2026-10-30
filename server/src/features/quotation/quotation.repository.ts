
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
          submissionId: submission.id,
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
  customsChargeRequested?: boolean;
  transportChargeRequested?: boolean;
  invoiceValue?: number;
  invoiceCurrency?: string;
}) {
  const hasAnyFields = data.customsChargeAmount !== undefined || data.transportChargeAmount !== undefined ||
    data.customsChargeRequested !== undefined || data.transportChargeRequested !== undefined ||
    data.invoiceValue !== undefined || data.invoiceCurrency !== undefined;
  if (!hasAnyFields) throw new Error("NO_CHARGE_FIELDS_TO_UPDATE");
  for (const value of [data.customsChargeAmount, data.transportChargeAmount]) {
    if (value !== undefined && value !== null && (!Number.isFinite(value) || value < 0)) throw new Error("INVALID_CHARGE_AMOUNT");
  }
  if (data.invoiceValue !== undefined && (!Number.isFinite(data.invoiceValue) || data.invoiceValue <= 0)) throw new Error("INVOICE_VALUE_REQUIRED");
  if (data.invoiceCurrency !== undefined && !/^[A-Z]{3}$/.test(data.invoiceCurrency.trim().toUpperCase())) throw new Error("INVALID_INVOICE_CURRENCY");

  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findUnique({
      where: { id: data.submissionId },
      include: { items: true, quote: { select: { id: true } } },
    });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

    // Requests are additive. Staff can enable an unrequested service but this
    // endpoint will not silently switch an existing request off.
    const customsRequested = Boolean(submission.customsChargeRequested || data.customsChargeRequested === true || data.invoiceValue !== undefined);
    const transportRequested = Boolean(submission.transportChargeRequested || data.transportChargeRequested === true);
    if (data.customsChargeAmount !== undefined && data.customsChargeAmount !== null && !customsRequested) throw new Error("CUSTOMS_CHARGE_NOT_REQUESTED");
    if (data.transportChargeAmount !== undefined && data.transportChargeAmount !== null && !transportRequested) throw new Error("TRANSPORT_CHARGE_NOT_REQUESTED");
    const nextInvoiceValue = data.invoiceValue !== undefined ? data.invoiceValue : Number(submission.invoiceValue ?? 0);
    const nextInvoiceCurrency = (data.invoiceCurrency ?? submission.invoiceCurrency ?? submission.currency ?? "NGN").trim().toUpperCase();
    if (customsRequested && (!Number.isFinite(nextInvoiceValue) || nextInvoiceValue <= 0)) throw new Error("INVOICE_VALUE_REQUIRED");
    if (customsRequested && !/^[A-Z]{3}$/.test(nextInvoiceCurrency)) throw new Error("INVALID_INVOICE_CURRENCY");

    const applyCharge = async (
      itemType: "CUSTOMS_CHARGE" | "TRANSPORT_CHARGE",
      amount: number | null | undefined,
      componentName: string,
      componentCode: string,
    ) => {
      if (amount === undefined) return;
      const existing = await tx.quoteSubmissionItem.findFirst({ where: { submissionId: submission.id, itemType } });
      if (amount === null) {
        if (existing) await tx.quoteSubmissionItem.delete({ where: { id: existing.id } });
        return;
      }
      const rowData = { itemType, quoteItemId: null, componentName, componentCode, reason: null, quantity: 1, rateApplied: chargeMoney(amount), lineTotal: chargeMoney(amount), isSelected: true };
      if (existing) await tx.quoteSubmissionItem.update({ where: { id: existing.id }, data: rowData });
      else await tx.quoteSubmissionItem.create({ data: { submissionId: submission.id, ...rowData } });
    };

    await applyCharge("CUSTOMS_CHARGE", data.customsChargeAmount, "Customs duties and charges", "CUSTOMS_DUTY");
    await applyCharge("TRANSPORT_CHARGE", data.transportChargeAmount, "Additional transportation charge", "TRANSPORT_CHARGE");

    const items = await tx.quoteSubmissionItem.findMany({ where: { submissionId: submission.id } });
    const subtotal = chargeMoney(items.reduce((sum, item) => sum + Number(item.lineTotal), 0));
    const previousSubtotal = Number(submission.subtotal);
    const previousTax = Number(submission.taxAmount);
    const storedRate = Number(submission.vatPercentage);
    const vatPercentage = storedRate > 0 ? storedRate : previousSubtotal > 0 && previousTax > 0 ? chargeMoney((previousTax / previousSubtotal) * 10000) / 100 : 0;
    const vatEnabled = Boolean(submission.vatEnabled || storedRate > 0 || previousTax > 0);
    const taxAmount = vatEnabled ? chargeMoney((subtotal * vatPercentage) / 100) : 0;
    const totalAmount = chargeMoney(subtotal + taxAmount);

    const updated = await tx.quoteSubmission.update({
      where: { id: submission.id },
      data: {
        subtotal, taxAmount, totalAmount, vatEnabled, vatPercentage,
        customsChargeRequested: customsRequested,
        transportChargeRequested: transportRequested,
        ...(customsRequested ? { invoiceValue: nextInvoiceValue, invoiceCurrency: nextInvoiceCurrency } : {}),
      },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });
    const changes = {
      customsChargeAmount: data.customsChargeAmount === undefined ? "UNCHANGED" : data.customsChargeAmount,
      transportChargeAmount: data.transportChargeAmount === undefined ? "UNCHANGED" : data.transportChargeAmount,
      customsChargeRequested: customsRequested,
      invoiceValue: customsRequested ? nextInvoiceValue : null,
      invoiceCurrency: customsRequested ? nextInvoiceCurrency : null,
      transportChargeRequested: transportRequested,
      subtotal, vatEnabled, vatPercentage, taxAmount, totalAmount, currency: submission.currency,
    };
    await tx.quoteAuditEvent.create({ data: { quoteId: submission.quoteId, submissionId: submission.id, action: "CHARGES_UPDATED", actorUserId: data.adminId, actorType: "ADMIN", details: changes as any } });

    const noteLines = [
      data.customsChargeAmount === undefined ? null : `Customs charge: ${data.customsChargeAmount === null ? "removed / not priced" : `${submission.currency} ${chargeMoney(data.customsChargeAmount).toFixed(2)}`}`,
      data.transportChargeAmount === undefined ? null : `Transportation charge: ${data.transportChargeAmount === null ? "removed / not priced" : `${submission.currency} ${chargeMoney(data.transportChargeAmount).toFixed(2)}`}`,
      data.customsChargeRequested === true || data.invoiceValue !== undefined ? `Customs request saved for invoice value ${nextInvoiceCurrency} ${nextInvoiceValue.toFixed(2)}` : null,
      data.transportChargeRequested === true ? "Transportation pricing request saved" : null,
    ].filter(Boolean);
    const summary = `Additional quotation changes saved. ${noteLines.join("; ") || "Request details updated"}. Current subtotal: ${submission.currency} ${subtotal.toFixed(2)}; VAT${vatEnabled ? ` (${vatPercentage}%)` : ""}: ${submission.currency} ${taxAmount.toFixed(2)}; total: ${submission.currency} ${totalAmount.toFixed(2)}.`;
    await tx.quoteMessage.create({ data: { quoteId: submission.quoteId, submissionId: submission.id, senderType: "ADMIN", senderUserId: data.adminId, message: summary } });
    if (submission.exporterId) {
      await tx.quoteNotification.create({ data: { quoteId: submission.quoteId, submissionId: submission.id, recipientUserId: submission.exporterId, title: "Quotation charges updated", message: `The quotation team updated the additional service requests or charges. Your current total is ${submission.currency} ${totalAmount.toFixed(2)} including applicable VAT.` } });
    }
    return updated;
  });
}

/** Shared transactional recalculation for custom-charge CRUD. */
async function recalculateAfterAdditionalChargeChange(
  tx: any,
  submission: any,
  adminId: string,
  auditDetails: Record<string, unknown>,
  message: string,
  notification?: { title?: string; message?: string },
) {
  const items = await tx.quoteSubmissionItem.findMany({
    where: { submissionId: submission.id },
    select: { lineTotal: true },
  });
  const subtotal = chargeMoney(items.reduce((sum: number, item: any) => sum + Number(item.lineTotal), 0));
  const previousSubtotal = Number(submission.subtotal ?? 0);
  const previousTax = Number(submission.taxAmount ?? 0);
  const storedRate = Number(submission.vatPercentage ?? 0);
  const vatPercentage = storedRate > 0
    ? storedRate
    : previousSubtotal > 0 && previousTax > 0
      ? chargeMoney((previousTax / previousSubtotal) * 10000) / 100
      : 0;
  const vatEnabled = Boolean(submission.vatEnabled || storedRate > 0 || previousTax > 0);
  const taxAmount = vatEnabled ? chargeMoney((subtotal * vatPercentage) / 100) : 0;
  const totalAmount = chargeMoney(subtotal + taxAmount);
  const updated = await tx.quoteSubmission.update({
    where: { id: submission.id },
    data: { subtotal, taxAmount, totalAmount, vatEnabled, vatPercentage },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
  const audit = { ...auditDetails, subtotal, taxAmount, totalAmount, currency: submission.currency, vatEnabled, vatPercentage };
  await tx.quoteAuditEvent.create({
    data: {
      quoteId: submission.quoteId,
      submissionId: submission.id,
      action: "CHARGES_UPDATED",
      actorUserId: adminId,
      actorType: "ADMIN",
      details: audit as any,
    },
  });
  const fullMessage = `${message} Current subtotal: ${submission.currency} ${subtotal.toFixed(2)}; VAT${vatEnabled ? ` (${vatPercentage}%)` : ""}: ${submission.currency} ${taxAmount.toFixed(2)}; total: ${submission.currency} ${totalAmount.toFixed(2)}.`;
  await tx.quoteMessage.create({
    data: {
      quoteId: submission.quoteId,
      submissionId: submission.id,
      senderType: "ADMIN",
      senderUserId: adminId,
      message: fullMessage,
    },
  });
  if (submission.exporterId) {
    await tx.quoteNotification.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        recipientUserId: submission.exporterId,
        title: notification?.title ?? "Quotation charges updated",
        message: notification?.message ?? `An additional charge was changed. Your current quotation total is ${submission.currency} ${totalAmount.toFixed(2)} including applicable VAT.`,
      },
    });
  }
  return updated;
}

/** Save an exporter request after submission without inventing or pricing a fee. */
export async function requestExporterAdditionalCharges(data: {
  submissionId: string;
  exporterId: string;
  customsChargeRequested?: boolean;
  invoiceValue?: number;
  invoiceCurrency?: string;
  transportChargeRequested?: boolean;
}) {
  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findFirst({
      where: { id: data.submissionId, exporterId: data.exporterId },
      include: { quote: { select: { quoteNumber: true } } },
    });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

    const customsRequested = Boolean(submission.customsChargeRequested || data.customsChargeRequested === true || data.invoiceValue !== undefined);
    const transportRequested = Boolean(submission.transportChargeRequested || data.transportChargeRequested === true);
    if (!customsRequested && !transportRequested) throw new Error("INVALID_ADDITIONAL_CHARGE_REQUEST");

    const nextInvoiceValue = data.invoiceValue !== undefined ? Number(data.invoiceValue) : Number(submission.invoiceValue ?? 0);
    const nextInvoiceCurrency = (data.invoiceCurrency ?? submission.invoiceCurrency ?? submission.currency ?? "NGN").trim().toUpperCase();
    if (customsRequested && (!Number.isFinite(nextInvoiceValue) || nextInvoiceValue <= 0)) throw new Error("INVOICE_VALUE_REQUIRED");
    if (customsRequested && !/^[A-Z]{3}$/.test(nextInvoiceCurrency)) throw new Error("INVALID_INVOICE_CURRENCY");

    const updated = await tx.quoteSubmission.update({
      where: { id: submission.id },
      data: {
        customsChargeRequested: customsRequested,
        transportChargeRequested: transportRequested,
        ...(customsRequested ? { invoiceValue: nextInvoiceValue, invoiceCurrency: nextInvoiceCurrency } : {}),
      },
      include: { items: { orderBy: { createdAt: "asc" } } },
    });

    const actions = [
      customsRequested ? `Customs assistance requested for invoice value ${nextInvoiceCurrency} ${nextInvoiceValue.toFixed(2)}` : "",
      transportRequested ? "Transportation pricing requested" : "",
    ].filter(Boolean);
    const message = `${actions.join("; ")}. No price was added; operations must confirm any additional charge.`;
    await tx.quoteAuditEvent.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        action: "CHARGES_UPDATED",
        actorUserId: data.exporterId,
        actorType: "EXPORTER",
        details: {
          event: "EXPORTER_ADDITIONAL_CHARGE_REQUESTED",
          customsChargeRequested: customsRequested,
          invoiceValue: customsRequested ? nextInvoiceValue : null,
          invoiceCurrency: customsRequested ? nextInvoiceCurrency : null,
          transportChargeRequested: transportRequested,
        } as any,
      },
    });
    await tx.quoteMessage.create({
      data: {
        quoteId: submission.quoteId,
        submissionId: submission.id,
        senderType: "EXPORTER",
        senderUserId: data.exporterId,
        message,
      },
    });

    const reviewers = await tx.user.findMany({
      where: {
        isActive: true,
        OR: [
          { role: "ADMIN" },
          { permissions: { some: { permission: { in: ["REVIEW_QUOTE", "REVIEW_QUOTATIONS", "VIEW_ALL_QUOTES", "MANAGE_QUOTE_CHARGES"] } } } },
        ],
      },
      select: { id: true },
    });
    if (reviewers.length) {
      await tx.quoteNotification.createMany({
        data: reviewers.map((reviewer: { id: string }) => ({
          quoteId: submission.quoteId,
          submissionId: submission.id,
          recipientUserId: reviewer.id,
          title: "Exporter requested additional quotation charges",
          message: `${submission.quote?.quoteNumber ?? "A quotation"}: ${message}`,
        })),
      });
    }
    return updated;
  });
}

export async function addCustomSubmissionCharge(data: {
  submissionId: string; adminId: string; name: string; amount: number; reason?: string;
}) {
  if (!data.name.trim() || data.name.trim().length > 120 || !Number.isFinite(data.amount) || data.amount <= 0 || (data.reason?.length ?? 0) > 1000) {
    throw new Error("INVALID_CUSTOM_CHARGE");
  }
  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findUnique({ where: { id: data.submissionId } });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");
    const charge = await tx.quoteSubmissionItem.create({
      data: {
        submissionId: submission.id,
        quoteItemId: null,
        itemType: "OTHER_CHARGE",
        componentName: data.name.trim(),
        componentCode: null,
        reason: data.reason?.trim() || null,
        quantity: 1,
        rateApplied: chargeMoney(data.amount),
        lineTotal: chargeMoney(data.amount),
        isSelected: true,
      },
    });
    return recalculateAfterAdditionalChargeChange(tx, submission, data.adminId,
      { event: "OTHER_CHARGE_ADDED", chargeId: charge.id, name: charge.componentName, amount: charge.lineTotal, reason: charge.reason },
      `Additional charge added: ${charge.componentName} (${submission.currency} ${chargeMoney(data.amount).toFixed(2)})${data.reason?.trim() ? `; reason: ${data.reason.trim()}` : ""}.`);
  });
}

export async function editCustomSubmissionCharge(data: {
  submissionId: string; chargeId: string; adminId: string; name: string; amount: number; reason?: string;
}) {
  if (!data.name.trim() || data.name.trim().length > 120 || !Number.isFinite(data.amount) || data.amount <= 0 || (data.reason?.length ?? 0) > 1000) {
    throw new Error("INVALID_CUSTOM_CHARGE");
  }
  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findUnique({ where: { id: data.submissionId } });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");
    const existing = await tx.quoteSubmissionItem.findFirst({ where: { id: data.chargeId, submissionId: submission.id } });
    if (!existing) throw new Error("ADDITIONAL_CHARGE_NOT_FOUND");
    if (String(existing.itemType) !== "OTHER_CHARGE") throw new Error("NOT_A_CUSTOM_CHARGE");
    const updatedItem = await tx.quoteSubmissionItem.update({
      where: { id: existing.id },
      data: {
        componentName: data.name.trim(),
        rateApplied: chargeMoney(data.amount),
        lineTotal: chargeMoney(data.amount),
        reason: data.reason?.trim() || null,
      },
    });
    return recalculateAfterAdditionalChargeChange(tx, submission, data.adminId,
      { event: "OTHER_CHARGE_EDITED", chargeId: updatedItem.id, previousName: existing.componentName, name: updatedItem.componentName, previousAmount: existing.lineTotal, amount: updatedItem.lineTotal, reason: updatedItem.reason },
      `Additional charge updated: ${updatedItem.componentName} (${submission.currency} ${chargeMoney(data.amount).toFixed(2)})${data.reason?.trim() ? `; reason: ${data.reason.trim()}` : ""}.`);
  });
}

export async function deleteSubmissionAdditionalCharge(data: {
  submissionId: string; chargeId: string; adminId: string;
}) {
  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findUnique({ where: { id: data.submissionId } });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");
    const existing = await tx.quoteSubmissionItem.findFirst({ where: { id: data.chargeId, submissionId: submission.id } });
    if (!existing) throw new Error("ADDITIONAL_CHARGE_NOT_FOUND");
    if (String(existing.itemType) === "SERVICE") throw new Error("NOT_AN_ADDITIONAL_CHARGE");
    await tx.quoteSubmissionItem.delete({ where: { id: existing.id } });
    let submissionAfterRemoval = submission;
    if (String(existing.itemType) === "CUSTOMS_CHARGE") {
      submissionAfterRemoval = await tx.quoteSubmission.update({
        where: { id: submission.id },
        data: { customsChargeRequested: false, invoiceValue: null, invoiceCurrency: null },
      });
    } else if (String(existing.itemType) === "TRANSPORT_CHARGE") {
      submissionAfterRemoval = await tx.quoteSubmission.update({
        where: { id: submission.id },
        data: { transportChargeRequested: false },
      });
    }
    const existingType = String(existing.itemType).toUpperCase();
    const isSubtraction = existingType === "SUBTRACTION";
    const removedAmount = Math.abs(Number(existing.lineTotal));
    const cancelledRequest = existingType === "CUSTOMS_CHARGE"
      ? " The customs request and invoice details were also cleared."
      : existingType === "TRANSPORT_CHARGE"
        ? " The transportation request was also cleared."
        : "";
    const historyEvent = isSubtraction ? "SUBTRACTION_REMOVED" : "ADDITIONAL_CHARGE_DELETED";
    const changeMessage = isSubtraction
      ? `Reduction removed: ${existing.componentName} (${submission.currency} ${removedAmount.toFixed(2)}). The original selected services were preserved. The reason remains in the audit history.`
      : `Additional charge removed: ${existing.componentName} (${submission.currency} ${removedAmount.toFixed(2)}). The original selected services were preserved.${cancelledRequest}`;
    return recalculateAfterAdditionalChargeChange(tx, submissionAfterRemoval, data.adminId,
      { event: historyEvent, chargeId: existing.id, itemType: existing.itemType, name: existing.componentName, removedAmount, reason: existing.reason ?? null, customsRequestCancelled: existingType === "CUSTOMS_CHARGE", transportRequestCancelled: existingType === "TRANSPORT_CHARGE" },
      changeMessage,
      isSubtraction ? {
        title: "Quotation adjustment reversed",
        message: `${existing.componentName} was removed and ${submission.currency} ${removedAmount.toFixed(2)} was restored to the current subtotal. Reason recorded: ${existing.reason ?? "Not supplied"}.`,
      } : undefined);
  });
}

/** Add a transparent, reason-backed deduction/bonus as a negative line item. */
export async function addSubmissionSubtraction(data: {
  submissionId: string;
  adminId: string;
  amount: number;
  reason: string;
  name?: string;
}) {
  const reason = data.reason.trim();
  const name = (data.name?.trim() || "Bonus / deduction").slice(0, 120);
  if (!Number.isFinite(data.amount) || data.amount <= 0 || !reason || reason.length > 1000 || name.length < 2) {
    throw new Error("INVALID_SUBTRACTION");
  }

  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findUnique({
      where: { id: data.submissionId },
      include: { items: { select: { lineTotal: true } } },
    });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

    const currentSubtotal = chargeMoney(
      submission.items.reduce((sum, item) => sum + Number(item.lineTotal), 0),
    );
    if (data.amount > currentSubtotal) throw new Error("SUBTRACTION_EXCEEDS_SUBTOTAL");

    const amount = chargeMoney(data.amount);
    const deduction = await tx.quoteSubmissionItem.create({
      data: {
        submissionId: submission.id,
        quoteItemId: null,
        itemType: "SUBTRACTION",
        componentName: name,
        componentCode: "SUBTRACTION",
        reason,
        quantity: 1,
        rateApplied: -amount,
        lineTotal: -amount,
        isSelected: true,
      },
    });

    return recalculateAfterAdditionalChargeChange(
      tx,
      submission,
      data.adminId,
      {
        event: "SUBTRACTION_ADDED",
        adjustmentId: deduction.id,
        name,
        amount,
        storedLineTotal: -amount,
        reason,
        previousSubtotal: currentSubtotal,
        adjustmentKind: "BONUS_OR_DEDUCTION",
      },
      `A deduction/bonus was applied: ${name} (−${submission.currency} ${amount.toFixed(2)}). Reason: ${reason}.`,
      {
        title: "Quotation credit / bonus applied",
        message: `The quotation team applied a ${submission.currency} ${amount.toFixed(2)} reduction to your quotation. Your current subtotal, applicable VAT and final total have been recalculated. Reason: ${reason}. Open the quotation to view the updated total.`,
      },
    );
  });
}

/** List audit history only for the submission requested by an authorized caller. */
export async function listSubmissionHistory(submissionId: string, exporterId?: string) {
  const submission = await prisma.quoteSubmission.findFirst({
    where: { id: submissionId, ...(exporterId ? { exporterId } : {}) },
    select: {
      id: true,
      quoteId: true,
      exporterId: true,
      quote: { select: { quoteNumber: true } },
    },
  });
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

  const events = await prisma.quoteAuditEvent.findMany({
    where: { submissionId: submission.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      action: true,
      actorUserId: true,
      actorType: true,
      details: true,
      createdAt: true,
    },
  });

  return { submissionId: submission.id, quoteId: submission.quoteId, quoteNumber: submission.quote.quoteNumber, events };
}

const quotationNotificationSelect = {
  id: true,
  quoteId: true,
  submissionId: true,
  title: true,
  message: true,
  createdAt: true,
  readAt: true,
} as const;

/** Notification ownership is always scoped to the authenticated recipient. */
export async function listQuotationNotifications(recipientUserId: string) {
  const where = { recipientUserId };
  const [notifications, unreadCount] = await Promise.all([
    prisma.quoteNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 40,
      select: quotationNotificationSelect,
    }),
    prisma.quoteNotification.count({ where: { recipientUserId, readAt: null } }),
  ]);
  return { notifications, unreadCount };
}

export async function markQuotationNotificationRead(data: { recipientUserId: string; notificationId: string }) {
  const notification = await prisma.quoteNotification.findFirst({
    where: { id: data.notificationId, recipientUserId: data.recipientUserId },
    select: quotationNotificationSelect,
  });
  if (!notification) throw new Error("NOTIFICATION_NOT_FOUND");
  if (notification.readAt) return notification;

  return prisma.quoteNotification.update({
    where: { id: notification.id },
    data: { readAt: new Date() },
    select: quotationNotificationSelect,
  });
}

/** Permanently remove the selected quotation and all of its submissions/children. */
export async function deleteQuotationCompletely(data: { submissionId: string; adminId: string }) {
  return prisma.$transaction(async (tx) => {
    const submission = await tx.quoteSubmission.findUnique({
      where: { id: data.submissionId },
      select: { id: true, quoteId: true },
    });
    if (!submission) throw new Error("SUBMISSION_NOT_FOUND");
    const quote = await tx.quote.findUnique({ where: { id: submission.quoteId }, select: { id: true, quoteNumber: true } });
    if (!quote) throw new Error("SUBMISSION_NOT_FOUND");
    // Delete submissions first because some schemas use onDelete: Restrict from submission to quote.
    await tx.quoteSubmission.deleteMany({ where: { quoteId: quote.id } });
    await tx.quote.delete({ where: { id: quote.id } });
    return { quoteId: quote.id, quoteNumber: quote.quoteNumber, deleted: true };
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
          reason: true,
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
          reason: true,
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
        exporterId: true,
        status: true,
        quote: { select: { quoteNumber: true } },
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
      if (existing.exporterId) {
        await tx.quoteNotification.create({
          data: {
            quoteId: existing.quoteId,
            submissionId: existing.id,
            recipientUserId: existing.exporterId,
            title: "Quotation status updated",
            message: `${existing.quote.quoteNumber}: Your quotation status changed to ${data.status.replaceAll("_", " ").toLowerCase()}.${note ? ` Team note: ${note}` : ""}`,
          },
        });
      }
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
    select: { id: true, quoteId: true, exporterId: true },
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

    if (submission.exporterId) {
      await tx.quoteNotification.create({
        data: {
          quoteId: submission.quoteId,
          submissionId: submission.id,
          recipientUserId: submission.exporterId,
          title: "New message from the quotation team",
          message: "The quotation team sent you a new message. Open your quotation to read the full conversation.",
        },
      });
    }

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
          submissionId: submission.id,
          recipientUserId: reviewer.id,
          title: "New exporter message",
          message: "An exporter sent a message about a quotation.",
        })),
      });
    }

    return message;
  });
}


