import type { Request, Response, NextFunction } from "express";
import { rateCardOptionService } from "./rate-card-option.service";
import { createRateCardOptionSchema, updateRateCardOptionSchema } from "./rate-card-option.types";

function sendError(error: unknown, res: Response, next: NextFunction) {
  const err = error as { statusCode?: number };
  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, message: (error as Error).message });
  }
  return next(error);
}

export const rateCardOptionController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await rateCardOptionService.list(String(req.params.configurationId));
      return res.json({ success: true, data });
    } catch (error) { return sendError(error, res, next); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await rateCardOptionService.getById(String(req.params.id));
      return res.json({ success: true, data });
    } catch (error) { return sendError(error, res, next); }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createRateCardOptionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: "Invalid option data.", errors: parsed.error.flatten() });
      const data = await rateCardOptionService.create(String(req.params.configurationId), parsed.data);
      return res.status(201).json({ success: true, data });
    } catch (error) { return sendError(error, res, next); }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = updateRateCardOptionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ success: false, message: "Invalid option data.", errors: parsed.error.flatten() });
      const data = await rateCardOptionService.update(String(req.params.id), parsed.data);
      return res.json({ success: true, data });
    } catch (error) { return sendError(error, res, next); }
  },
};
