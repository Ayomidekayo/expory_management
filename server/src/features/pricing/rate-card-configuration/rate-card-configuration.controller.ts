import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createRateCardConfigurationSchema,
  updateRateCardConfigurationSchema,
} from "./rate-card-configuration.schema";
import { rateCardConfigurationService } from "./rate-card-configuration.service";

const knownErrors: Record<string, number> = {
  RATE_CARD_NOT_FOUND: 404,
  CONFIGURATION_NOT_FOUND: 404,
  RATE_CARD_MUST_BE_DRAFT: 409,
  ROUTE_CONFIGURATION_ONLY_FOR_LAND: 400,
  ROUTE_CODE_AND_LABEL_REQUIRED_TOGETHER: 400,
  AIRLINE_SELECTOR_ONLY_FOR_AIR: 400,
  INVALID_VAT_PERCENTAGE: 400,
  VAT_PERCENTAGE_REQUIRED: 400,
  VAT_CALCULATION_BASIS_REQUIRED: 400,
  UNSUPPORTED_CURRENCY: 400,
  CONFIGURATION_CODE_ALREADY_EXISTS: 409,
  INVALID_ROUTE_PARAMETER: 400,
};

function sendError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors: error.issues });
  }
  const code = error instanceof Error ? error.message : "INTERNAL_ERROR";
  const status = knownErrors[code] ?? 500;
  return res.status(status).json({
    success: false,
    message: status === 500 ? "An unexpected error occurred." : code.replaceAll("_", " ").toLowerCase(),
  });
}

function param(value: string | string[] | undefined): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("INVALID_ROUTE_PARAMETER");
  return value.trim();
}

export async function listConfigurations(req: Request, res: Response) {
  try {
    const data = await rateCardConfigurationService.list(param(req.params.rateCardId));
    return res.status(200).json({ success: true, message: "Configurations retrieved successfully.", data });
  } catch (error) { return sendError(res, error); }
}

export async function getConfigurationById(req: Request, res: Response) {
  try {
    const data = await rateCardConfigurationService.getById(param(req.params.id));
    return res.status(200).json({ success: true, message: "Configuration retrieved successfully.", data });
  } catch (error) { return sendError(res, error); }
}

export async function createConfiguration(req: Request, res: Response) {
  try {
    const input = createRateCardConfigurationSchema.parse(req.body);
    const data = await rateCardConfigurationService.create(param(req.params.rateCardId), input);
    return res.status(201).json({ success: true, message: "Configuration created successfully.", data });
  } catch (error) { return sendError(res, error); }
}

export async function updateConfiguration(req: Request, res: Response) {
  try {
    const input = updateRateCardConfigurationSchema.parse(req.body);
    const data = await rateCardConfigurationService.update(param(req.params.id), input);
    return res.status(200).json({ success: true, message: "Configuration updated successfully.", data });
  } catch (error) { return sendError(res, error); }
}
