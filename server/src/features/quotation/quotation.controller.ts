import type { Request, Response, NextFunction } from "express";
import { QuotationService } from "./quotation.service";
import type { CalculateQuoteInput, PublicRateCardFilters, SubmitQuoteInput } from "./quotation.types";
import quotationAttachmentService from "./quotation-attachment.service";
import { Permission } from "../../generated";

const service = new QuotationService();
function getRouteParam(
  value: string | string[] | undefined,
): string | null {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  return null;
}
function respondError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "INTERNAL_ERROR";
  const badRequest = new Set([
    "WEIGHT_REQUIRED",
    "QUANTITY_REQUIRED",
    "INVALID_CUSTOMS_VALUE",
    "INVALID_FREIGHT_AMOUNT",
    "INVALID_OPTION",
    "INVALID_AIRLINE",
    "AIRLINE_REQUIRED",
    "INVALID_SELECTED_QUOTE_ITEM",
    "SELECT_AT_LEAST_ONE_SERVICE",
    "QUOTE_NOT_SUBMITTABLE",
    "QUOTE_SELECTION_RECALCULATION_REQUIRED",
    "INVALID_ADDITIONAL_CHARGE_REQUEST",
    "INVOICE_VALUE_REQUIRED",
    "INVALID_INVOICE_CURRENCY",
    "INVALID_CUSTOMER_MESSAGE",
    "INVALID_CHARGE_AMOUNT",
    "CUSTOMS_CHARGE_NOT_REQUESTED",
    "TRANSPORT_CHARGE_NOT_REQUESTED",
    "NO_CHARGE_FIELDS_TO_UPDATE",
    "INVALID_CUSTOM_CHARGE",
    "INVALID_SUBTRACTION",
    "SUBTRACTION_EXCEEDS_SUBTOTAL",
    "SHIPMENT_OPTIONS_NOT_CONFIGURED",
    "SHIPMENT_OPTION_REQUIRED",
    "SELECT_ONE_SHIPMENT_OPTION",
  ]);
  const notFound = new Set([
    "ACTIVE_RATE_CARD_NOT_FOUND",
    "ACTIVE_CONFIGURATION_NOT_FOUND",
    "QUOTE_NOT_FOUND",
    "SUBMISSION_NOT_FOUND",
  ]);
  const publicMessages: Record<string, string> = {
    INVALID_SELECTED_QUOTE_ITEM:
      "One or more selected services do not belong to this quotation. Recalculate the quote and try again.",
    SELECT_AT_LEAST_ONE_SERVICE:
      "Select at least one service before submitting your request.",
    QUOTE_NOT_SUBMITTABLE:
      "This quotation has already been submitted or is no longer available.",
    QUOTE_SELECTION_RECALCULATION_REQUIRED:
      "This quotation needs to be recalculated before it can be submitted. Please calculate a new quote.",
    INVALID_ADDITIONAL_CHARGE_REQUEST:
      "Choose valid yes/no options for the additional services.",
    INVOICE_VALUE_REQUIRED:
      "Enter a commercial invoice value greater than zero when requesting customs assistance.",
    INVALID_INVOICE_CURRENCY:
      "Enter a valid three-letter invoice currency code.",
    INVALID_CUSTOMER_MESSAGE:
      "Additional information cannot exceed 5,000 characters.",
    INVALID_CHARGE_AMOUNT:
      "Charge amounts must be valid numbers greater than or equal to zero.",
    CUSTOMS_CHARGE_NOT_REQUESTED:
      "The exporter did not request customs assistance on this submission.",
    TRANSPORT_CHARGE_NOT_REQUESTED:
      "The exporter did not request transportation pricing on this submission.",
    NO_CHARGE_FIELDS_TO_UPDATE:
      "Provide at least one additional charge to update.",
    INVALID_CUSTOM_CHARGE: "Provide a valid custom charge name, positive amount, and optional reason.",
    INVALID_SUBTRACTION: "Provide a positive reduction amount and a reason up to 1,000 characters.",
    SUBTRACTION_EXCEEDS_SUBTOTAL: "The reduction cannot exceed the current quotation subtotal.",
    SHIPMENT_OPTIONS_NOT_CONFIGURED:
      "No active shipment options are configured for this rate-card configuration. Please contact the quotation team.",
    SHIPMENT_OPTION_REQUIRED:
      "Select one shipment option before calculating this quote.",
    SELECT_ONE_SHIPMENT_OPTION:
      "Select exactly one shipment option for land or sea freight.",
  };
  const status = notFound.has(message) ? 404 : badRequest.has(message) ? 400 : 500;
  res.status(status).json({
    success: false,
    message:
      status === 500
        ? "Unable to process quotation."
        : publicMessages[message] ?? message,
    code: message,
  });
}

export async function listPublicRateCards(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("PUBLIC RATE CARDS CONTROLLER REACHED");

  try {
    const filters: PublicRateCardFilters = {
      mode: req.query.mode as any,
      direction: req.query.direction as any,
    };

    res.json({
      success: true,
      data: await service.listPublicRateCards(filters),
    });
  } catch (error) {
    respondError(res, error);
  }
}

export async function getPublicConfigurations(
  req: Request,
  res: Response,
) {
  try {
    const rateCardId = getRouteParam(req.params.rateCardId);

    if (!rateCardId) {
      res.status(400).json({
        success: false,
        message: "A valid rate card ID is required.",
      });
      return;
    }

    res.json({
      success: true,
      data: await service.getPublicConfigurations(rateCardId),
    });
  } catch (error) {
    respondError(res, error);
  }
}

export async function calculatePublicQuote(req: Request, res: Response) {
  try {
    const result = await service.calculate(req.body as CalculateQuoteInput);
    res.status(201).json({ success: true, data: result });
  } catch (error) { respondError(res, error); }
}

function getAuthenticatedUserId(req: Request): string | null {
  const user = (req as Request & { user?: { id?: string; userId?: string } }).user;
  return user?.id ?? user?.userId ?? null;
}

export async function submitQuote(req: Request, res: Response) {
  try {
    const exporterId = getAuthenticatedUserId(req);

    if (!exporterId) {
      res.status(401).json({
        success: false,
        message: "Login is required before submitting a quotation request.",
      });
      return;
    }

    if (req.user?.role !== "EXPORTER") {
      res.status(403).json({
        success: false,
        message: "Only exporter accounts can submit quotation requests.",
      });
      return;
    }

    const body = req.body as Partial<SubmitQuoteInput> | undefined;
    if (
      !Array.isArray(body?.selectedQuoteItemIds) ||
      body.selectedQuoteItemIds.length === 0 ||
      !body.selectedQuoteItemIds.every((id) => typeof id === "string" && id.trim())
    ) {
      res.status(400).json({
        success: false,
        message: "Select at least one service before submitting the request.",
        code: "SELECT_AT_LEAST_ONE_SERVICE",
      });
      return;
    }

    const quoteId = getRouteParam(req.params.quoteId);

    if (!quoteId) {
      res.status(400).json({
        success: false,
        message: "A valid quote ID is required.",
      });
      return;
    }

    const result = await service.submit(
      quoteId,
      exporterId,
      req.body as SubmitQuoteInput,
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    respondError(res, error);
  }
}


export async function updateSubmissionCharges(req: Request, res: Response) {
  const user = req.user;
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  const canManageCharges = user.role === "ADMIN" || user.permissions?.includes(Permission.MANAGE_QUOTE_CHARGES);
  if (!canManageCharges) return res.status(403).json({ success: false, message: "You do not have permission to manage quotation charges." });
  const submissionId = getRouteParam(req.params.submissionId);
  if (!submissionId) return res.status(400).json({ success: false, message: "A valid submission ID is required." });

  const body: Record<string, unknown> = req.body ?? {};
  type ParsedAmount = { kind: "absent" } | { kind: "invalid" } | { kind: "value"; value: number | null };
  const parseOptionalAmount = (key: "customsChargeAmount" | "transportChargeAmount"): ParsedAmount => {
    if (!Object.prototype.hasOwnProperty.call(body, key)) return { kind: "absent" };
    if (body[key] === null || body[key] === "") return { kind: "value", value: null };
    if (typeof body[key] !== "number" && typeof body[key] !== "string") return { kind: "invalid" };
    if (typeof body[key] === "string" && !body[key].trim()) return { kind: "value", value: null };
    const value = Number(body[key]);
    return Number.isFinite(value) && value >= 0 ? { kind: "value", value } : { kind: "invalid" };
  };
  const customs = parseOptionalAmount("customsChargeAmount");
  const transport = parseOptionalAmount("transportChargeAmount");
  if (customs.kind === "invalid" || transport.kind === "invalid") {
    return res.status(400).json({ success: false, message: "Charge amounts must be valid numbers greater than or equal to zero.", code: "INVALID_CHARGE_AMOUNT" });
  }
  for (const key of ["customsChargeRequested", "transportChargeRequested"] as const) {
    if (body[key] !== undefined && typeof body[key] !== "boolean") {
      return res.status(400).json({ success: false, message: "Request flags must be true or false.", code: "INVALID_ADDITIONAL_CHARGE_REQUEST" });
    }
  }
  const invoiceValue = body.invoiceValue === undefined || body.invoiceValue === null || body.invoiceValue === "" ? undefined : Number(body.invoiceValue);
  if (invoiceValue !== undefined && (!Number.isFinite(invoiceValue) || invoiceValue <= 0)) {
    return res.status(400).json({ success: false, message: "Enter a commercial invoice value greater than zero.", code: "INVOICE_VALUE_REQUIRED" });
  }
  const invoiceCurrency = typeof body.invoiceCurrency === "string" ? body.invoiceCurrency.trim().toUpperCase() : undefined;
  if (invoiceCurrency !== undefined && !/^[A-Z]{3}$/.test(invoiceCurrency)) {
    return res.status(400).json({ success: false, message: "Enter a valid three-letter invoice currency code.", code: "INVALID_INVOICE_CURRENCY" });
  }
  const hasRequestPatch = body.customsChargeRequested !== undefined || body.transportChargeRequested !== undefined || invoiceValue !== undefined || invoiceCurrency !== undefined;
  if (customs.kind === "absent" && transport.kind === "absent" && !hasRequestPatch) {
    return res.status(400).json({ success: false, message: "Provide at least one additional charge or request field to update.", code: "NO_CHARGE_FIELDS_TO_UPDATE" });
  }
  try {
    const data = await service.updateSubmissionCharges({
      submissionId,
      adminId: user.id,
      ...(customs.kind === "value" ? { customsChargeAmount: customs.value } : {}),
      ...(transport.kind === "value" ? { transportChargeAmount: transport.value } : {}),
      ...(body.customsChargeRequested !== undefined ? { customsChargeRequested: body.customsChargeRequested as boolean } : {}),
      ...(body.transportChargeRequested !== undefined ? { transportChargeRequested: body.transportChargeRequested as boolean } : {}),
      ...(invoiceValue !== undefined ? { invoiceValue } : {}),
      ...(invoiceCurrency !== undefined ? { invoiceCurrency } : {}),
    });
    return res.status(200).json({ success: true, message: "Additional-service requests and charges saved; current totals and VAT recalculated.", data });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
    if (code === "SUBMISSION_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation submission not found.", code });
    if (["CUSTOMS_CHARGE_NOT_REQUESTED", "TRANSPORT_CHARGE_NOT_REQUESTED", "INVALID_CHARGE_AMOUNT", "NO_CHARGE_FIELDS_TO_UPDATE", "INVOICE_VALUE_REQUIRED", "INVALID_INVOICE_CURRENCY", "INVALID_ADDITIONAL_CHARGE_REQUEST"].includes(code)) {
      const messages: Record<string, string> = {
        CUSTOMS_CHARGE_NOT_REQUESTED: "The exporter did not request customs assistance on this submission.",
        TRANSPORT_CHARGE_NOT_REQUESTED: "The exporter did not request transportation pricing on this submission.",
        INVALID_CHARGE_AMOUNT: "Charge amounts must be valid numbers greater than or equal to zero.",
        NO_CHARGE_FIELDS_TO_UPDATE: "Provide at least one additional charge or request field to update.",
        INVOICE_VALUE_REQUIRED: "Enter a commercial invoice value greater than zero when requesting customs assistance.",
        INVALID_INVOICE_CURRENCY: "Enter a valid three-letter invoice currency code.",
        INVALID_ADDITIONAL_CHARGE_REQUEST: "Choose valid yes/no options for the additional services.",
      };
      return res.status(400).json({ success: false, message: messages[code], code });
    }
    return respondError(res, error);
  }
}

/** Exporter self-service: request customs/transport pricing after submission. */
export async function requestExporterAdditionalCharges(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (user.role !== "EXPORTER") return res.status(403).json({ success: false, message: "Exporter access required." });
  if (!submissionId) return res.status(400).json({ success: false, message: "A valid submission ID is required." });

  const body = req.body ?? {};
  if (body.customsChargeRequested !== undefined && typeof body.customsChargeRequested !== "boolean") {
    return res.status(400).json({ success: false, message: "Choose a valid option for customs assistance.", code: "INVALID_ADDITIONAL_CHARGE_REQUEST" });
  }
  if (body.transportChargeRequested !== undefined && typeof body.transportChargeRequested !== "boolean") {
    return res.status(400).json({ success: false, message: "Choose a valid option for transportation pricing.", code: "INVALID_ADDITIONAL_CHARGE_REQUEST" });
  }
  const invoiceValue = body.invoiceValue === undefined || body.invoiceValue === null || body.invoiceValue === ""
    ? undefined
    : Number(body.invoiceValue);
  if (invoiceValue !== undefined && (!Number.isFinite(invoiceValue) || invoiceValue <= 0)) {
    return res.status(400).json({ success: false, message: "Enter a commercial invoice value greater than zero.", code: "INVOICE_VALUE_REQUIRED" });
  }
  const invoiceCurrency = typeof body.invoiceCurrency === "string" ? body.invoiceCurrency.trim().toUpperCase() : undefined;
  if (invoiceCurrency !== undefined && !/^[A-Z]{3}$/.test(invoiceCurrency)) {
    return res.status(400).json({ success: false, message: "Enter a valid three-letter invoice currency code.", code: "INVALID_INVOICE_CURRENCY" });
  }

  try {
    const data = await service.requestExporterAdditionalCharges({
      submissionId,
      exporterId: user.id,
      ...(body.customsChargeRequested !== undefined ? { customsChargeRequested: body.customsChargeRequested } : {}),
      ...(invoiceValue !== undefined ? { invoiceValue } : {}),
      ...(invoiceCurrency !== undefined ? { invoiceCurrency } : {}),
      ...(body.transportChargeRequested !== undefined ? { transportChargeRequested: body.transportChargeRequested } : {}),
    });
    return res.status(200).json({ success: true, message: "Additional-service request saved. No charge was added until operations prices it.", data });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
    if (code === "SUBMISSION_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation submission not found.", code });
    if (["INVOICE_VALUE_REQUIRED", "INVALID_INVOICE_CURRENCY", "INVALID_ADDITIONAL_CHARGE_REQUEST"].includes(code)) {
      const messages: Record<string, string> = {
        INVOICE_VALUE_REQUIRED: "Enter a commercial invoice value greater than zero when requesting customs assistance.",
        INVALID_INVOICE_CURRENCY: "Enter a valid three-letter invoice currency code.",
        INVALID_ADDITIONAL_CHARGE_REQUEST: "Choose customs assistance and/or transportation pricing.",
      };
      return res.status(400).json({ success: false, message: messages[code], code });
    }
    return respondError(res, error);
  }
}

function canManageAdditionalCharges(req: Request): boolean {
  const user = req.user;
  return Boolean(user && (user.role === "ADMIN" || user.permissions?.includes(Permission.MANAGE_QUOTE_CHARGES)));
}

function parsePositiveChargeAmount(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Create a named, user-defined additional charge. */
export async function addCustomSubmissionCharge(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (!canManageAdditionalCharges(req)) return res.status(403).json({ success: false, message: "You do not have permission to manage quotation charges." });
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const amount = parsePositiveChargeAmount(req.body?.amount);
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
  if (!submissionId || name.length < 2 || name.length > 120 || amount === null || reason.length > 1000) {
    return res.status(400).json({ success: false, message: "Enter a charge name (2–120 characters), a positive amount, and an optional reason up to 1,000 characters." });
  }
  try {
    const data = await service.addCustomSubmissionCharge({ submissionId, adminId: user.id, name, amount, reason: reason || undefined });
    return res.status(201).json({ success: true, message: "Additional charge added and quotation totals recalculated.", data });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
    if (code === "SUBMISSION_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation submission not found.", code });
    return respondError(res, error);
  }
}

/** Edit a named, user-defined additional charge. */
export async function editCustomSubmissionCharge(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  const chargeId = getRouteParam(req.params.chargeId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (!canManageAdditionalCharges(req)) return res.status(403).json({ success: false, message: "You do not have permission to manage quotation charges." });
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const amount = parsePositiveChargeAmount(req.body?.amount);
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
  if (!submissionId || !chargeId || name.length < 2 || name.length > 120 || amount === null || reason.length > 1000) {
    return res.status(400).json({ success: false, message: "Enter a charge name (2–120 characters), a positive amount, and an optional reason up to 1,000 characters." });
  }
  try {
    const data = await service.editCustomSubmissionCharge({ submissionId, chargeId, adminId: user.id, name, amount, reason: reason || undefined });
    return res.status(200).json({ success: true, message: "Additional charge updated and quotation totals recalculated.", data });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
    if (code === "SUBMISSION_NOT_FOUND" || code === "ADDITIONAL_CHARGE_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation or additional charge not found.", code });
    if (code === "NOT_A_CUSTOM_CHARGE") return res.status(400).json({ success: false, message: "Only a named custom charge can be edited here.", code });
    return respondError(res, error);
  }
}

/** Delete a priced extra line; original SERVICE rows cannot be deleted here. */
export async function deleteSubmissionAdditionalCharge(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  const chargeId = getRouteParam(req.params.chargeId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (!canManageAdditionalCharges(req)) return res.status(403).json({ success: false, message: "You do not have permission to manage quotation charges." });
  if (!submissionId || !chargeId) return res.status(400).json({ success: false, message: "Submission and charge IDs are required." });
  try {
    const data = await service.deleteSubmissionAdditionalCharge({ submissionId, chargeId, adminId: user.id });
    return res.status(200).json({ success: true, message: "Additional charge removed and quotation totals recalculated.", data });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
    if (code === "SUBMISSION_NOT_FOUND" || code === "ADDITIONAL_CHARGE_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation or additional charge not found.", code });
    if (code === "NOT_AN_ADDITIONAL_CHARGE") return res.status(400).json({ success: false, message: "Original requested service lines cannot be removed as additional charges.", code });
    return respondError(res, error);
  }
}

/** Hard-delete the whole quotation and every submission attached to its quote. ADMIN only. */
export async function deleteQuotationCompletely(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (user.role !== "ADMIN") return res.status(403).json({ success: false, message: "Only an administrator can delete a quotation completely." });
  if (!submissionId) return res.status(400).json({ success: false, message: "A valid submission ID is required." });
  try {
    const result = await service.deleteQuotationCompletely({ submissionId, adminId: user.id });
    return res.status(200).json({ success: true, message: "Quotation and its submissions were permanently deleted.", data: result });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
    if (code === "SUBMISSION_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation submission not found.", code });
    return respondError(res, error);
  }
}


/** Create a reason-backed subtotal reduction/bonus. The database stores it as a negative line item. */
export async function addSubmissionSubtraction(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (!canManageAdditionalCharges(req)) return res.status(403).json({ success: false, message: "You do not have permission to manage quotation charges." });

  const amount = parsePositiveChargeAmount(req.body?.amount);
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "Bonus / deduction";
  if (!submissionId || amount === null || reason.length < 3 || reason.length > 1000 || name.length < 2 || name.length > 120) {
    return res.status(400).json({ success: false, message: "Enter a positive reduction amount, a short name, and a reason (3–1,000 characters).", code: "INVALID_SUBTRACTION" });
  }
  try {
    const data = await service.addSubmissionSubtraction({ submissionId, adminId: user.id, amount, reason, name });
    return res.status(201).json({ success: true, message: "Reduction applied and quotation totals recalculated.", data });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
    if (code === "SUBMISSION_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation submission not found.", code });
    if (code === "SUBTRACTION_EXCEEDS_SUBTOTAL" || code === "INVALID_SUBTRACTION") {
      return res.status(400).json({ success: false, message: code === "SUBTRACTION_EXCEEDS_SUBTOTAL" ? "The reduction cannot exceed the current quotation subtotal." : "Enter a positive reduction amount and a reason.", code });
    }
    return respondError(res, error);
  }
}

export async function getMySubmissionHistory(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (user.role !== "EXPORTER") return res.status(403).json({ success: false, message: "Exporter access required." });
  if (!submissionId) return res.status(400).json({ success: false, message: "A valid submission ID is required." });
  try {
    const data = await service.listSubmissionHistory(submissionId, user.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === "SUBMISSION_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation submission not found.", code: error.message });
    return respondError(res, error);
  }
}

export async function getAdminSubmissionHistory(req: Request, res: Response) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  const canView = user.role === "ADMIN" || [Permission.VIEW_ALL_QUOTES, Permission.REVIEW_QUOTE, Permission.REVIEW_QUOTATIONS, Permission.MANAGE_QUOTE_CHARGES].some((permission) => user.permissions?.includes(permission));
  if (!canView) return res.status(403).json({ success: false, message: "You do not have permission to view quotation history." });
  if (!submissionId) return res.status(400).json({ success: false, message: "A valid submission ID is required." });
  try {
    const data = await service.listSubmissionHistory(submissionId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === "SUBMISSION_NOT_FOUND") return res.status(404).json({ success: false, message: "Quotation submission not found.", code: error.message });
    return respondError(res, error);
  }
}

export async function listQuotationNotifications(req: Request, res: Response) {
  const user = req.user;
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  try {
    const data = await service.listQuotationNotifications(user.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return respondError(res, error);
  }
}

export async function markQuotationNotificationRead(req: Request, res: Response) {
  const user = req.user;
  const notificationId = getRouteParam(req.params.notificationId);
  if (!user) return res.status(401).json({ success: false, message: "Authentication required." });
  if (!notificationId) return res.status(400).json({ success: false, message: "A valid notification ID is required." });
  try {
    const data = await service.markQuotationNotificationRead(user.id, notificationId);
    return res.status(200).json({ success: true, message: "Notification marked as read.", data });
  } catch (error) {
    if (error instanceof Error && error.message === "NOTIFICATION_NOT_FOUND") return res.status(404).json({ success: false, message: "Notification not found.", code: error.message });
    return respondError(res, error);
  }
}

export async function listMySubmissions(
  req: Request,
  res: Response,
) {
  try {
    const exporterId = getAuthenticatedUserId(req);

    if (!exporterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (req.user?.role !== "EXPORTER") {
      return res.status(403).json({
        success: false,
        message: "This endpoint is for exporters only.",
      });
    }

    const submissions =
      await service.listExporterSubmissions(exporterId);

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    return respondError(res, error);
  }
}



export async function getMySubmission(
  req: Request,
  res: Response,
) {
  try {
    const exporterId = getAuthenticatedUserId(req);
    const submissionId = getRouteParam(
      req.params.submissionId,
    );

    if (!exporterId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (req.user?.role !== "EXPORTER") {
      return res.status(403).json({
        success: false,
        message: "Exporter access required.",
      });
    }

    if (!submissionId) {
      return res.status(400).json({
        success: false,
        message: "A valid submission ID is required.",
      });
    }

    const submission =
      await service.getExporterSubmission(
        submissionId,
        exporterId,
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Quotation submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    return respondError(res, error);
  }
}
export async function listAdminSubmissions(
  req: Request,
  res: Response,
) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const permissions = user.permissions ?? [];

    // Viewing all submitted quotations is separate from having review powers.
    // ADMIN keeps full access; other staff must be explicitly granted a permission.
    const canViewAllQuotes =
      user.role === "ADMIN" ||
      permissions.includes(Permission.VIEW_ALL_QUOTES) ||
      permissions.includes(Permission.REVIEW_QUOTATIONS) ||
      permissions.includes(Permission.REVIEW_QUOTE) ||
      permissions.includes(Permission.MANAGE_QUOTE_CHARGES);

    if (!canViewAllQuotes) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view quotations.",
      });
    }

    const rawStatus = req.query.status;
    const status =
      typeof rawStatus === "string" ? rawStatus : undefined;

    const submissions =
      await service.listAdminSubmissions(status);

    return res.status(200).json({
      success: true,
      data: submissions,
      count: submissions.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "INTERNAL_ERROR";

    if (message === "INVALID_SUBMISSION_STATUS") {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation status filter.",
      });
    }

    return respondError(res, error);
  }
}


const REVIEW_STATUSES = new Set([
  "PENDING_REVIEW",
  "CHANGES_REQUESTED",
  "APPROVED",
  "REJECTED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
]);

function hasAnyQuotationPermission(
  req: Request,
  permissions: Permission[],
) {
  const user = req.user;

  return Boolean(
    user &&
      (user.role === "ADMIN" ||
        permissions.some((permission) =>
          user.permissions?.includes(permission),
        )),
  );
}

function canManageQuotation(req: Request) {
  return hasAnyQuotationPermission(req, [
    Permission.REVIEW_QUOTATIONS,
    Permission.REVIEW_QUOTE,
  ]);
}

export async function changeSubmissionStatus(
  req: Request,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const submissionId = getRouteParam(req.params.submissionId);
  const { status, note } = req.body ?? {};

  // A general reviewer may update workflow statuses. Staff with a narrow action
  // permission may only perform the matching status transition.
  const actionPermissionByStatus: Record<string, Permission> = {
    APPROVED: Permission.APPROVE_QUOTE,
    REJECTED: Permission.REJECT_QUOTE,
    CHANGES_REQUESTED: Permission.REQUEST_QUOTE_CHANGES,
    COMPLETED: Permission.COMPLETE_QUOTE,
  };
  const actionPermission =
    typeof status === "string"
      ? actionPermissionByStatus[status]
      : undefined;

  if (
    !canManageQuotation(req) &&
    (!actionPermission ||
      !hasAnyQuotationPermission(req, [Permission.VIEW_ALL_QUOTES]) ||
      !hasAnyQuotationPermission(req, [actionPermission]))
  ) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this quotation status change.",
    });
  }

  if (!submissionId || typeof status !== "string") {
    return res.status(400).json({
      success: false,
      message: "Submission ID and status are required.",
    });
  }

  if (!REVIEW_STATUSES.has(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quotation status.",
    });
  }

  if (
    note !== undefined &&
    (typeof note !== "string" || note.length > 5000)
  ) {
    return res.status(400).json({
      success: false,
      message: "The note must be text no longer than 5,000 characters.",
    });
  }

  try {
    const data = await service.updateSubmissionStatus({
      submissionId,
      status: status as any,
      adminId: req.user.id,
      note: typeof note === "string" ? note.trim() : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Quotation status updated.",
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SUBMISSION_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: "Quotation submission not found.",
      });
    }

    return respondError(res, error);
  }
}

export async function addAdminSubmissionMessage(
  req: Request,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const canReview = canManageQuotation(req);
  const canMessageWithSpecificGrant =
    hasAnyQuotationPermission(req, [Permission.VIEW_ALL_QUOTES]) &&
    hasAnyQuotationPermission(req, [Permission.ADD_QUOTE_MESSAGE]);

  if (!canReview && !canMessageWithSpecificGrant) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to message exporters about quotations.",
    });
  }

  const submissionId = getRouteParam(req.params.submissionId);
  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  if (!submissionId || !message || message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "A submission ID and a message of 1–5,000 characters are required.",
    });
  }

  try {
    const data = await service.addSubmissionMessage({
      submissionId,
      adminId: req.user.id,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Quotation note added.",
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SUBMISSION_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: "Quotation submission not found.",
      });
    }

    return respondError(res, error);
  }
}


export async function uploadQuotationAttachment(
  req: Request,
  res: Response,
) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  const file = req.file;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (!submissionId || !file) {
    return res.status(400).json({
      success: false,
      message: "A submission ID and file are required.",
    });
  }

  const isExporter = user.role === "EXPORTER";
  const isAdmin = user.role === "ADMIN";
  const canReview =
    isAdmin ||
    user.permissions?.includes(Permission.REVIEW_QUOTE) ||
    user.permissions?.includes(Permission.REVIEW_QUOTATIONS);
  const canUploadWithSpecificGrant =
    user.permissions?.includes(Permission.VIEW_ALL_QUOTES) &&
    user.permissions?.includes(Permission.UPLOAD_QUOTE_ATTACHMENT);
  const canManage = isAdmin || canReview || canUploadWithSpecificGrant;

  if (!isExporter && !canManage) {
    return res.status(403).json({
      success: false,
      message: "You cannot upload quotation attachments.",
    });
  }

  const remarks =
    typeof req.body?.remarks === "string"
      ? req.body.remarks.trim()
      : undefined;

  if (remarks && remarks.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Remarks cannot exceed 1,000 characters.",
    });
  }

  try {
    const attachment = await quotationAttachmentService.upload({
      submissionId,
      userId: user.id,
      senderType: isExporter ? "EXPORTER" : "ADMIN",
      file,
      remarks,
    });

    return res.status(201).json({
      success: true,
      message: "Quotation attachment uploaded.",
      data: attachment,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "INTERNAL_ERROR";

    if (message === "SUBMISSION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Quotation submission not found.",
      });
    }

    if (message === "QUOTATION_ACCESS_DENIED") {
      return res.status(403).json({
        success: false,
        message: "You cannot access this quotation.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to upload quotation attachment.",
    });
  }
}

export async function addExporterSubmissionMessage(
  req: Request,
  res: Response,
) {
  const user = req.user;
  const submissionId = getRouteParam(req.params.submissionId);
  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (user.role !== "EXPORTER") {
    return res.status(403).json({
      success: false,
      message: "Exporter access required.",
    });
  }

  if (!submissionId || !message || message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "A submission ID and a message of 1–5,000 characters are required.",
    });
  }

  try {
    const data = await service.addExporterSubmissionMessage({
      submissionId,
      exporterId: user.id,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent.",
      data,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SUBMISSION_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: "Quotation submission not found.",
      });
    }

    return respondError(res, error);
  }
}