import type { Request, Response, NextFunction } from "express";
import { QuotationService } from "./quotation.service";
import type { CalculateQuoteInput, PublicRateCardFilters, SubmitQuoteInput } from "./quotation.types";

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
