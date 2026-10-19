import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  componentListQuerySchema,
  createRateComponentSchema,
  rateCardIdParamsSchema,
  rateComponentIdParamsSchema,
  updateRateComponentSchema,
} from "./rate-component.schema";

import { rateComponentService } from "./rate-component.service";

function sendError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: error.flatten(),
    });
  }

  const message =
    error instanceof Error
      ? error.message
      : "INTERNAL_SERVER_ERROR";

  const statusMap: Record<string, number> = {
    RATE_CARD_NOT_FOUND: 404,
    RATE_COMPONENT_NOT_FOUND: 404,
    PRICING_SECTION_NOT_FOUND: 404,
    RATE_CARD_OPTION_NOT_FOUND: 404,
    RATE_CARD_MUST_BE_DRAFT: 409,
    RATE_COMPONENT_CODE_ALREADY_EXISTS: 409,
    PRICING_SECTION_CONFIGURATION_MISMATCH: 400,
    PRICING_SECTION_OPTION_MISMATCH: 400,
    OPTION_CONFIGURATION_MISMATCH: 400,
    PRICING_SECTION_RATE_CARD_MISMATCH: 400,
OPTION_RATE_CARD_MISMATCH: 400,
INVALID_RATE_COMPONENT_CODE: 400,
  };

  const status = statusMap[message] ?? 500;

  return res.status(status).json({
    success: false,
    message:
      status === 500
        ? "An unexpected error occurred."
        : message,
  });
}

export async function listRateComponents(
  req: Request,
  res: Response,
) {
  try {
    const { rateCardId } = rateCardIdParamsSchema.parse(req.params);
    const filters = componentListQuerySchema.parse(req.query);

    const components = await rateComponentService.list(
      rateCardId,
      filters,
    );

    return res.status(200).json({
      success: true,
      data: components,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getRateComponentById(
  req: Request,
  res: Response,
) {
  try {
    const { componentId } =
      rateComponentIdParamsSchema.parse(req.params);

    const component = await rateComponentService.getById(
      componentId,
    );

    return res.status(200).json({
      success: true,
      data: component,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function createRateComponent(
  req: Request,
  res: Response,
) {
  try {
    const { rateCardId } = rateCardIdParamsSchema.parse(req.params);
    const input = createRateComponentSchema.parse(req.body);

    const component = await rateComponentService.create(
      rateCardId,
      input,
    );

    return res.status(201).json({
      success: true,
      message: "Rate component created successfully.",
      data: component,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function updateRateComponent(
  req: Request,
  res: Response,
) {
  try {
    const { componentId } =
      rateComponentIdParamsSchema.parse(req.params);

    const input = updateRateComponentSchema.parse(req.body);

    const component = await rateComponentService.update(
      componentId,
      input,
    );

    return res.status(200).json({
      success: true,
      message: "Rate component updated successfully.",
      data: component,
    });
  } catch (error) {
    return sendError(res, error);
  }
}