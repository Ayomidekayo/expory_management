
import { Router } from "express";

import {
  listPublicRateCards,
  getPublicConfigurations,
  calculatePublicQuote,
  submitQuote,
} from "./quotation.controller";

import authenticate from "../../middleware/auth.middleware";

const router = Router();

// Public endpoints: no login required.
router.get(
  "/public/quotations/rate-cards",
  listPublicRateCards,
);

router.get(
  "/public/quotations/rate-cards/:rateCardId/configurations",
  getPublicConfigurations,
);

router.post(
  "/public/quotations/calculate",
  calculatePublicQuote,
);

// Submitting a quotation requires authentication.
router.post(
  "/quotations/:quoteId/submissions",
  authenticate,
  submitQuote,
);

export default router;
