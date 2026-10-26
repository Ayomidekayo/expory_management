export const PERMISSIONS = {
  VIEW_DASHBOARD: "VIEW_DASHBOARD",

  // Quotation permissions
  MANAGE_RATE_CARDS: "MANAGE_RATE_CARDS",
  REVIEW_QUOTATIONS: "REVIEW_QUOTATIONS",

  // Keep all your other existing permissions here.
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];