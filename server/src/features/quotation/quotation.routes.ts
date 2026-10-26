import { Router, type RequestHandler } from "express";
import {
  listPublicRateCards,
  getPublicConfigurations,
  calculatePublicQuote,
  submitQuote,
  listMySubmissions,
  getMySubmission,
  listAdminSubmissions,
  addAdminSubmissionMessage,
  changeSubmissionStatus,
  uploadQuotationAttachment,
  addExporterSubmissionMessage,
} from "./quotation.controller";
import authenticate from "../../middleware/auth.middleware";
import { Permission } from "../../generated";
import { quotationUpload } from "../middleware/quotation-upload.middleware";

const router = Router();

/**
 * Use any-of authorization for capabilities that legitimately grant the same
 * entry point. The shared requirePermission middleware accepts one permission,
 * while the quotation review queue needs separate VIEW and REVIEW grants.
 */
function requireAnyPermission(...requiredPermissions: Permission[]): RequestHandler {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // ADMIN retains full access; all non-admin staff must be explicitly assigned.
    const grantedPermissions = new Set<string>(user.permissions ?? []);
    const allowed =
      user.role === "ADMIN" ||
      requiredPermissions.some((permission) => grantedPermissions.has(permission));

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this quotation feature.",
      });
    }

    return next();
  };
}

const statusPermissionByStatus: Record<string, Permission> = {
  APPROVED: Permission.APPROVE_QUOTE,
  REJECTED: Permission.REJECT_QUOTE,
  CHANGES_REQUESTED: Permission.REQUEST_QUOTE_CHANGES,
  COMPLETED: Permission.COMPLETE_QUOTE,
};

const requireStatusPermission: RequestHandler = (req, res, next) => {
  const requestedStatus =
    typeof req.body?.status === "string" ? req.body.status : "";
  const actionPermission = statusPermissionByStatus[requestedStatus];

  // Reviewers may manage all statuses. Staff with a narrow action permission
  // can only perform the matching action; the controller repeats this check.
  const allowedPermissions = [
    Permission.REVIEW_QUOTE,
    Permission.REVIEW_QUOTATIONS,
    ...(actionPermission ? [actionPermission] : []),
  ];

  return requireAnyPermission(...allowedPermissions)(req, res, next);
};

// ---------------------------------------------------------------------------
// Public quotation calculator — intentionally unauthenticated.
// ---------------------------------------------------------------------------
router.get("/public/quotations/rate-cards", listPublicRateCards);
router.get(
  "/public/quotations/rate-cards/:rateCardId/configurations",
  getPublicConfigurations,
);
router.post("/public/quotations/calculate", calculatePublicQuote);

// ---------------------------------------------------------------------------
// Exporter-owned submissions — controller verifies exporter role and ownership.
// ---------------------------------------------------------------------------
router.get("/quotations/mine", authenticate, listMySubmissions);
router.get("/quotations/mine/:submissionId", authenticate, getMySubmission);
router.post("/quotations/:quoteId/submissions", authenticate, submitQuote);
router.post(
  "/quotations/mine/:submissionId/attachments",
  authenticate,
  quotationUpload.single("file"),
  uploadQuotationAttachment,
);
router.post(
  "/quotations/mine/:submissionId/messages",
  authenticate,
  addExporterSubmissionMessage,
);

// ---------------------------------------------------------------------------
// Staff access to all submitted quotations and quotation review.
// Assign VIEW_ALL_QUOTES for read-only access; assign REVIEW_QUOTATIONS or
// REVIEW_QUOTE to let staff access the review queue and detail workflow.
// ---------------------------------------------------------------------------
router.get(
  "/admin/quotations/submissions",
  authenticate,
  requireAnyPermission(
    Permission.VIEW_ALL_QUOTES,
    Permission.REVIEW_QUOTATIONS,
    Permission.REVIEW_QUOTE,
  ),
  listAdminSubmissions,
);

router.patch(
  "/admin/quotations/submissions/:submissionId/status",
  authenticate,
  requireStatusPermission,
  changeSubmissionStatus,
);

router.post(
  "/admin/quotations/submissions/:submissionId/messages",
  authenticate,
  requireAnyPermission(
    Permission.REVIEW_QUOTATIONS,
    Permission.REVIEW_QUOTE,
    Permission.ADD_QUOTE_MESSAGE,
  ),
  addAdminSubmissionMessage,
);

router.post(
  "/admin/quotations/submissions/:submissionId/attachments",
  authenticate,
  requireAnyPermission(
    Permission.REVIEW_QUOTATIONS,
    Permission.REVIEW_QUOTE,
    Permission.UPLOAD_QUOTE_ATTACHMENT,
  ),
  quotationUpload.single("file"),
  uploadQuotationAttachment,
);

export default router;
