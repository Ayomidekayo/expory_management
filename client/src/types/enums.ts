export type DocumentType =
  | "INVOICE"
  | "PACKING_LIST"
  | "NXP"
  | "XF"
  | "CCI"
  | "E_NUMBER"
  | "TRANSIT_INVOICE"
  | "OTHER";

export const DocumentType = {
  INVOICE: "INVOICE" as DocumentType,
  PACKING_LIST: "PACKING_LIST" as DocumentType,
  NXP: "NXP" as DocumentType,
  XF: "XF" as DocumentType,
  CCI: "CCI" as DocumentType,
  E_NUMBER: "E_NUMBER" as DocumentType,
  TRANSIT_INVOICE: "TRANSIT_INVOICE" as DocumentType,
  OTHER: "OTHER" as DocumentType,
} as const;











export type Role =
  | "ADMIN"
  | "CLIENT"
  | "STAFF"
  | "OFFICER"
  | "VIEWER";

export type ShipmentStatus =
  | "DRAFT"
  | "PENDING"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export type TransportMode =
  | "ROAD"
  | "SEA"
  | "AIR";

// export type DocumentType =
//   | "INVOICE"
//   | "PACKING_LIST"
//   | "NXP"
//   | "XF"
//   | "CCI"
//   | "E_NUMBER"
//   | "TRANSIT_INVOICE"
//   | "OTHER";