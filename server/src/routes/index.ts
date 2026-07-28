import { Router } from "express";
import authRoutes from "./auth.routes";
import exporterRoutes from "./exporter.routes";
import consigneeRoutes from "./consignee.routes";
import shipmentRoutes from "./shipment.routes";
import invoiceRoutes from "./invoice.routes";
import dashboardRoutes from "./dashboard.routes";
import packingListRouts from "./packing-list.routes";
import containerRoutes from "./container.routes";
import allocationDocumentRoutes from "./allocation.document.routes"

import clientRoutes from "./client.routes";
import allocationRoutes from "./allocation.routes";
import transitRoutes from  "./transit.routes"
import documentRoutes from "./document.routes";






const router = Router();

router.use("/auth", authRoutes);
router.use("/exporters", exporterRoutes);
router.use("/containers", containerRoutes);
router.use("/clients", clientRoutes);
router.use("/consignees", consigneeRoutes);
router.use("/allocations", allocationRoutes);
router.use("/allocations-document", allocationDocumentRoutes);
router.use("/shipments", shipmentRoutes);
 router.use("/invoices", invoiceRoutes);
  router.use("/transits", transitRoutes);



router.use(
  "/documents",
  documentRoutes
);
 router.use("/dashboard", dashboardRoutes);
// router.use("/invoice-items", invoiceItemRoutes);

router.use(
  "/packing-lists",
  packingListRouts
);
router.use(
  "/documents",
  documentRoutes
);
export default router;