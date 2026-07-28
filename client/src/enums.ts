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

export type DocumentType =
  | "INVOICE"
  | "PACKING_LIST"
  | "NXP"
  | "XF"
  | "CCI"
  | "E_NUMBER"
  | "TRANSIT_INVOICE"
  | "OTHER";