import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // ✅ Don't overwrite req.query/req.params directly
      // Attach validated data to a custom property
      (req as any).validated = parsed;

      next();
    } catch (err) {
      next(err);
    }
  };
