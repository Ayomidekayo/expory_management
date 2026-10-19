import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  createWeightSlabSchema,
  listWeightSlabsQuerySchema,
  rateCardParamsSchema,
  updateWeightSlabSchema,
  upsertSlabRatesSchema,
  weightSlabParamsSchema,
} from "./weight-slab.schema";

import { WeightSlabService } from "./weight-slab.service";

const service = new WeightSlabService();

function sendError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: error.flatten(),
    });
  }

  const message =
    error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR";

  const statusMap: Record<string, number> = {
    RATE_CARD_NOT_FOUND: 404,
    WEIGHT_SLAB_NOT_FOUND: 404,
    CONFIGURATION_NOT_FOUND: 404,
    OPTION_NOT_FOUND: 404,
    PRICING_SECTION_NOT_FOUND: 404,

    RATE_CARD_MUST_BE_DRAFT: 409,
    WEIGHT_SLAB_RANGE_OVERLAP: 409,

    MAX_WEIGHT_MUST_EXCEED_MIN_WEIGHT: 400,
    CONFIGURATION_RATE_CARD_MISMATCH: 400,
    OPTION_CONFIGURATION_MISMATCH: 400,
    OPTION_RATE_CARD_MISMATCH: 400,
    PRICING_SECTION_CONFIGURATION_MISMATCH: 400,
    PRICING_SECTION_OPTION_MISMATCH: 400,
    PRICING_SECTION_REQUIRES_ITS_OPTION: 400,
    PRICING_SECTION_RATE_CARD_MISMATCH: 400,
    INVALID_OR_INACTIVE_WEIGHT_SLAB_COMPONENT: 400,
    COMPONENT_CONFIGURATION_MISMATCH: 400,
  };

  return res.status(statusMap[message] ?? 500).json({
    success: false,
    message:
      statusMap[message] !== undefined
        ? message
        : "An unexpected error occurred.",
  });
}

export async function listWeightSlabs(
  req: Request,
  res: Response,
) {
  try {
    const { rateCardId } = rateCardParamsSchema.parse(req.params);
    const filters = listWeightSlabsQuerySchema.parse(req.query);

    const data = await service.list(rateCardId, filters);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getWeightSlabById(
  req: Request,
  res: Response,
) {
  try {
    const { weightSlabId } = weightSlabParamsSchema.parse(req.params);

    const data = await service.getById(weightSlabId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function createWeightSlab(
  req: Request,
  res: Response,
) {
  try {
    const { rateCardId } = rateCardParamsSchema.parse(req.params);
    const input = createWeightSlabSchema.parse(req.body);

    const data = await service.create(rateCardId, input);

    return res.status(201).json({
      success: true,
      message: "Weight slab created successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function updateWeightSlab(
  req: Request,
  res: Response,
) {
  try {
    const { weightSlabId } = weightSlabParamsSchema.parse(req.params);
    const input = updateWeightSlabSchema.parse(req.body);

    const data = await service.update(weightSlabId, input);

    return res.status(200).json({
      success: true,
      message: "Weight slab updated successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function deleteWeightSlab(
  req: Request,
  res: Response,
) {
  try {
    const { weightSlabId } = weightSlabParamsSchema.parse(req.params);

    const data = await service.delete(weightSlabId);

    return res.status(200).json({
      success: true,
      message: "Weight slab deleted successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function setWeightSlabRates(
  req: Request,
  res: Response,
) {
  try {
    const { weightSlabId } = weightSlabParamsSchema.parse(req.params);
    const input = upsertSlabRatesSchema.parse(req.body);

    const data = await service.setRates(weightSlabId, input);

    return res.status(200).json({
      success: true,
      message: "Weight slab rates saved successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}