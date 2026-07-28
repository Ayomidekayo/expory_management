import type { Consignee } from "./consignee";
import type { ShipmentStatus } from "./enums";
import type { Exporter } from "./exporter.types";
import type { Invoice } from "./invoice";
import type { PackingList } from "./packing-list";
import type { Transit } from "./transit";
import type { User } from "./user";

export interface Shipment {
  id: string;

  shipmentNumber: string;

  shipmentDate: string;

  xfNumber?: string | null;

  nxpNumber?: string | null;

  cciNumber?: string | null;

  eNumber?: string | null;

  status: ShipmentStatus;

  exporterId: string;

  consigneeId: string;

  createdById: string;

  exporter: Exporter;

  consignee: Consignee;

  createdBy: Pick<User, "id" | "name" | "role">;

  invoice?: Invoice | null;

  packingList?: PackingList | null;

  transits: Transit[];

  documents: Document[];

  createdAt: string;

  updatedAt: string;
}
