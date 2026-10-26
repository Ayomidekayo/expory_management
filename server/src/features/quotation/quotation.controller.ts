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
  const badRequest = new Set(["WEIGHT_REQUIRED", "QUANTITY_REQUIRED", "INVALID_CUSTOMS_VALUE", "INVALID_FREIGHT_AMOUNT", "INVALID_OPTION", "INVALID_AIRLINE", "AIRLINE_REQUIRED", "INVALID_SELECTED_QUOTE_ITEM", "SELECT_AT_LEAST_ONE_SERVICE", "QUOTE_NOT_SUBMITTABLE"]);
  const notFound = new Set(["ACTIVE_RATE_CARD_NOT_FOUND", "ACTIVE_CONFIGURATION_NOT_FOUND", "QUOTE_NOT_FOUND"]);
  const status = notFound.has(message) ? 404 : badRequest.has(message) ? 400 : 500;
  res.status(status).json({ success: false, message: status === 500 ? "Unable to process quotation." : message, code: message });
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
      permissions.includes(Permission.REVIEW_QUOTE);

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
