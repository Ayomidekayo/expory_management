import type {
  Request,
  Response,
} from "express";

import { ZodError } from "zod";

import {
  createRateCardAirlineSchema,
  updateRateCardAirlineSchema,
} from "./rate-card-airline.schema";

import {
  rateCardAirlineService,
} from "./rate-card-airline.service";

function sendError(
  res: Response,
  error: unknown,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: error.issues,
    });
  }

  const message =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  const knownErrors: Record<string, number> = {
    RATE_CARD_NOT_FOUND: 404,
    CONFIGURATION_NOT_FOUND: 404,
    AIRLINE_NOT_FOUND: 404,

    RATE_CARD_MUST_BE_DRAFT: 409,

    AIRLINE_SELECTOR_ONLY_FOR_AIR: 400,
    AIRLINE_SELECTOR_DISABLED: 400,
    CONFIGURATION_RATE_CARD_MISMATCH: 400,
    AIRLINE_CODE_ALREADY_EXISTS: 409,
  };

  const statusCode = knownErrors[message] ?? 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode !== 500
        ? message.replaceAll("_", " ").toLowerCase()
        : "An unexpected error occurred.",
  });
}

function getRouteParam(
  value: string | string[] | undefined,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("INVALID_ROUTE_PARAMETER");
  }

  return value;
}

/**
 * GET /rate-cards/:rateCardId/airlines
 */
export async function listAirlines(
  req: Request,
  res: Response,
) {
  try {
    const rateCardId = getRouteParam(
      req.params.rateCardId,
    );

    const configurationId = getRouteParam(
      typeof req.query.configurationId === "string"
        ? req.query.configurationId
        : undefined,
    );

    const activeOnly =
      req.query.activeOnly === "true";

    const airlines =
      await rateCardAirlineService.list(
        rateCardId,
        configurationId,
        activeOnly,
      );

    return res.status(200).json({
      success: true,
      message: "Airlines retrieved successfully.",
      data: airlines,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * GET /rate-cards/:rateCardId/airlines/:id
 */
export async function getAirlineById(
  req: Request,
  res: Response,
) {
  try {
    const rateCardId = getRouteParam(
      req.params.rateCardId,
    );

    const id = getRouteParam(req.params.id);

    const airline =
      await rateCardAirlineService.getById(
        rateCardId,
        id,
      );

    return res.status(200).json({
      success: true,
      message: "Airline retrieved successfully.",
      data: airline,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * POST /rate-cards/:rateCardId/airlines
 */
export async function createAirline(
  req: Request,
  res: Response,
) {
  try {
    const rateCardId = getRouteParam(
      req.params.rateCardId,
    );

    const input =
      createRateCardAirlineSchema.parse(req.body);

    const airline =
      await rateCardAirlineService.create(
        rateCardId,
        input,
      );

    return res.status(201).json({
      success: true,
      message: "Airline created successfully.",
      data: airline,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

/**
 * PATCH /rate-cards/:rateCardId/airlines/:id
 */
export async function updateAirline(
  req: Request,
  res: Response,
) {
  try {
    const rateCardId = getRouteParam(
      req.params.rateCardId,
    );

    const id = getRouteParam(req.params.id);

    const input =
      updateRateCardAirlineSchema.parse(req.body);

    const airline =
      await rateCardAirlineService.update(
        rateCardId,
        id,
        input,
      );

    return res.status(200).json({
      success: true,
      message: "Airline updated successfully.",
      data: airline,
    });
  } catch (error) {
    return sendError(res, error);
  }
}