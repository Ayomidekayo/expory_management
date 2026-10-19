import { Request, Response } from "express";

import { rateCardService } from "./rate-card.service";

import {
  createRateCardSchema,
  updateRateCardSchema,
  listRateCardsSchema,
  rateCardIdSchema,
} from "./rate-card.schema";

import {
  CreateRateCardInput,
  UpdateRateCardInput,
  ListRateCardsFilters,
} from "./rate-card.types";

/**
 * Centralized rate-card error handler.
 */
function handleRateCardError(
  error: unknown,
  res: Response,
): Response {
  const message =
    error instanceof Error
      ? error.message
      : "INTERNAL_SERVER_ERROR";

  const errors: Record<
    string,
    { status: number; message: string }
  > = {
    RATE_CARD_NOT_FOUND: {
      status: 404,
      message: "Rate card not found.",
    },

    RATE_CARD_CREATOR_REQUIRED: {
      status: 400,
      message: "A valid creator is required.",
    },

    INVALID_EFFECTIVE_DATE_RANGE: {
      status: 400,
      message:
        "The effective end date must be later than the start date.",
    },

    RATE_CARD_NOT_EDITABLE: {
      status: 409,
      message:
        "Only draft rate cards can be edited. Create a new rate card to change pricing.",
    },

    RATE_CARD_NOT_ACTIVATABLE: {
      status: 409,
      message:
        "This rate card cannot be activated in its current state.",
    },

    RATE_CARD_REQUIRES_COMPONENTS: {
      status: 400,
      message:
        "Add at least one active rate component before activating this rate card.",
    },

    RATE_CARD_REQUIRES_WEIGHT_SLABS: {
      status: 400,
      message:
        "Add weight slabs before activating weight-based pricing.",
    },

    RATE_CARD_MISSING_SLAB_RATE: {
      status: 400,
      message:
        "Every weight-based component must have a rate for each weight slab.",
    },

    RATE_CARD_INVALID_WEIGHT_SLAB: {
      status: 400,
      message:
        "A weight slab has an invalid minimum or maximum weight.",
    },

    RATE_CARD_OPEN_ENDED_SLAB_MUST_BE_LAST: {
      status: 400,
      message:
        "A weight slab without a maximum weight must be the final slab.",
    },

    RATE_CARD_OVERLAPPING_WEIGHT_SLABS: {
      status: 400,
      message: "Weight slabs cannot overlap.",
    },

    RATE_CARD_DATE_CONFLICT: {
      status: 409,
      message:
        "Another active rate card for this transport mode and direction overlaps these effective dates.",
    },
    RATE_CARD_REQUIRES_ACTIVE_CONFIGURATION: {
  status: 400,
  message:
    "At least one active configuration is required before activating this rate card.",
},

RATE_CARD_EFFECTIVE_PERIOD_EXPIRED: {
  status: 400,
  message:
    "The rate card's effective period has expired.",
},

CONFIGURATION_REQUIRES_COMPONENTS: {
  status: 400,
  message:
    "Every active configuration must contain at least one active pricing component.",
},

CONFIGURATION_REQUIRES_WEIGHT_SLABS: {
  status: 400,
  message:
    "Every active weight-based configuration must contain weight slabs.",
},

RATE_COMPONENT_VALUE_REQUIRED: {
  status: 400,
  message:
    "A fixed or per-unit component is missing its required value.",
},

RATE_COMPONENT_PERCENTAGE_INVALID: {
  status: 400,
  message:
    "A percentage component must have a valid percentage between 0 and 100.",
},

RATE_COMPONENT_BASIS_REQUIRED: {
  status: 400,
  message:
    "A percentage component must have a calculation basis.",
},

  };

  const knownError = errors[message];

  if (knownError) {
    return res.status(knownError.status).json({
      success: false,
      message: knownError.message,
    });
  }

  console.error("Rate card controller error:", error);

  return res.status(500).json({
    success: false,
    message:
      "An unexpected error occurred while processing the rate card.",
  });
}

/**
 * GET /rate-cards
 *
 * Retrieve rate cards with optional filters.
 */
export const listRateCards = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = listRateCardsSchema.safeParse(
      req.query,
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid rate-card filters.",
        errors: validation.error.flatten(),
      });
    }

    const filters =
      validation.data as ListRateCardsFilters;

    const rateCards =
      await rateCardService.list(filters);

    return res.status(200).json({
      success: true,
      message: "Rate cards retrieved successfully.",
      data: rateCards,
    });
  } catch (error) {
    return handleRateCardError(error, res);
  }
};

/**
 * GET /rate-cards/:id
 *
 * Retrieve a rate card and its configuration.
 */
export const getRateCardById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = rateCardIdSchema.safeParse(
      req.params,
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid rate-card ID.",
        errors: validation.error.flatten(),
      });
    }

    const rateCard =
      await rateCardService.getById(
        validation.data.id,
      );

    return res.status(200).json({
      success: true,
      message: "Rate card retrieved successfully.",
      data: rateCard,
    });
  } catch (error) {
    return handleRateCardError(error, res);
  }
};

/**
 * POST /rate-cards
 *
 * Create a new draft rate card.
 */
export const createRateCard = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = createRateCardSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid rate-card information.",
        errors: validation.error.flatten(),
      });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const input =
      validation.data as CreateRateCardInput;

    const rateCard =
      await rateCardService.create(
        input,
        userId,
      );

    return res.status(201).json({
      success: true,
      message: "Draft rate card created successfully.",
      data: rateCard,
    });
  } catch (error) {
    return handleRateCardError(error, res);
  }
};

/**
 * PATCH /rate-cards/:id
 *
 * Update a draft rate card.
 */
export const updateRateCard = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const paramsValidation =
      rateCardIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid rate-card ID.",
        errors: paramsValidation.error.flatten(),
      });
    }

    const bodyValidation =
      updateRateCardSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid rate-card update.",
        errors: bodyValidation.error.flatten(),
      });
    }

    const input =
      bodyValidation.data as UpdateRateCardInput;

    const rateCard =
      await rateCardService.update(
        paramsValidation.data.id,
        input,
      );

    return res.status(200).json({
      success: true,
      message: "Rate card updated successfully.",
      data: rateCard,
    });
  } catch (error) {
    return handleRateCardError(error, res);
  }
};

/**
 * POST /rate-cards/:id/activate
 *
 * Activate a validated draft rate card.
 */
export const activateRateCard = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const validation = rateCardIdSchema.safeParse(
      req.params,
    );

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid rate-card ID.",
        errors: validation.error.flatten(),
      });
    }

    const rateCard =
      await rateCardService.activate(
        validation.data.id,
      );

    return res.status(200).json({
      success: true,
      message: "Rate card activated successfully.",
      data: rateCard,
    });
  } catch (error) {
    return handleRateCardError(error, res);
  }
};