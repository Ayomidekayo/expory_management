import type { Request, Response } from "express";
import { ZodError, z } from "zod";
import { RateCardActivationService } from "./rate-card-activation.service";



const service = new RateCardActivationService();

const rateCardParamsSchema = z.object({
  rateCardId: z.string().min(1, "Rate card ID is required."),
});

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
    RATE_CARD_NOT_DRAFT: 409,
    RATE_CARD_VALIDATION_FAILED: 422,
    RATE_CARD_STATUS_CHANGED: 409,
    RATE_CARD_NOT_ACTIVE: 409,
  };

  return res.status(statusMap[message] ?? 500).json({
    success: false,
    message:
      statusMap[message] !== undefined
        ? message
        : "An unexpected error occurred.",
  });
}

export async function validateRateCard(
  req: Request,
  res: Response,
) {
  try {
    const { rateCardId } = rateCardParamsSchema.parse(req.params);

    const data = await service.validate(rateCardId);

    return res.status(200).json({
      success: true,
      message: data.canActivate
        ? "Rate card passed validation."
        : "Rate card requires corrections before activation.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function activateRateCard(
  req: Request,
  res: Response,
) {
  try {
    const { rateCardId } = rateCardParamsSchema.parse(req.params);

    const data = await service.activate(rateCardId);

    return res.status(200).json({
      success: true,
      message: "Rate card activated successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function archiveRateCard(
  req: Request,
  res: Response,
) {
  try {
    const { rateCardId } = rateCardParamsSchema.parse(req.params);

    const data = await service.archive(rateCardId);

    return res.status(200).json({
      success: true,
      message: "Rate card archived successfully.",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}