import type {
  Request,
  Response,
} from "express";

import { ZodError } from "zod";

import {
  configurationIdParamsSchema,
  createPricingSectionSchema,
  pricingSectionIdParamsSchema,
  pricingSectionListQuerySchema,
  updatePricingSectionSchema,
} from "./rate-card-pricing-section.schema";

import {
  rateCardPricingSectionService,
} from "./rate-card-pricing-section.service";

function sendError(
  res: Response,
  error: unknown,
) {
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
  CONFIGURATION_NOT_FOUND: 404,
  PRICING_SECTION_NOT_FOUND: 404,
  RATE_CARD_OPTION_NOT_FOUND: 404,

  RATE_CARD_MUST_BE_DRAFT: 409,
  PRICING_SECTION_CODE_ALREADY_EXISTS: 409,
  CANNOT_REMOVE_OPTION_WITH_EXISTING_WEIGHT_SLABS: 409,

  UNSUPPORTED_CURRENCY: 400,
  INVALID_PRICING_SECTION_CODE: 400,
  OPTION_DOES_NOT_BELONG_TO_CONFIGURATION: 400,
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

export async function listPricingSections(
  req: Request,
  res: Response,
) {
  try {
    const { configurationId } =
      configurationIdParamsSchema.parse(req.params);

    const { activeOnly } =
      pricingSectionListQuerySchema.parse(req.query);

    const sections =
      await rateCardPricingSectionService.list(
        configurationId,
        activeOnly,
      );

    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function getPricingSectionById(
  req: Request,
  res: Response,
) {
  try {
    const { sectionId } =
      pricingSectionIdParamsSchema.parse(req.params);

    const section =
      await rateCardPricingSectionService.getById(
        sectionId,
      );

    return res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function createPricingSection(
  req: Request,
  res: Response,
) {
  try {
    const { configurationId } =
      configurationIdParamsSchema.parse(req.params);

    const input =
      createPricingSectionSchema.parse(req.body);

    const section =
      await rateCardPricingSectionService.create(
        configurationId,
        input,
      );

    return res.status(201).json({
      success: true,
      message: "Pricing section created successfully.",
      data: section,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function updatePricingSection(
  req: Request,
  res: Response,
) {
  try {
    const { sectionId } =
      pricingSectionIdParamsSchema.parse(req.params);

    const input =
      updatePricingSectionSchema.parse(req.body);

    const section =
      await rateCardPricingSectionService.update(
        sectionId,
        input,
      );

    return res.status(200).json({
      success: true,
      message: "Pricing section updated successfully.",
      data: section,
    });
  } catch (error) {
    return sendError(res, error);
  }
}