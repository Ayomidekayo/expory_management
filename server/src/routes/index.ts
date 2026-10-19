import { Router } from "express";
import authRoutes from "./auth.routes";
import exporterRoutes from "./exporter.routes";
import consigneeRoutes from "./consignee.routes";
import shipmentRoutes from "./shipment.routes";
import invoiceRoutes from "./invoice.routes";
import dashboardRoutes from "./dashboard.routes";
import packingListRouts from "./packing-list.routes";
import containerRoutes from "./container.routes";
import clientRoutes from "./client.routes";
import allocationRoutes from "./allocation.routes";
import transitRoutes from  "./transit.routes"
import documentRoutes from "./document.routes";
import userRoutes from "./user.routes";
import  invoicePaymentRoutes  from "./invoice-payment.routes"
import  gateMovementRoutes   from "./gate-movement.routes"

import weightSlabRoutes   from "../features/pricing/weight-slabs/weight-slab.routes"

import rateCardConfigurationRoutes from "../features/pricing/rate-card-configuration/rate-card-configuration.routes";

///new
import rateCardPricingSectionRoutes from "../features/pricing/rate-card-pricing-section/rate-card-pricing-section.routes";
import rateComponentRoutes   from  "../features/pricing/rate-component/rate-component.routes"
import rateCardActivationRoutes  from "../features/pricing/rate-card-activation/rate-card-activation.routes"
import rateCardOptionRoutes from  "../features/pricing/rate-card-option/rate-card-option.routes"
import rateCardAirlineRoutes   from "../features/pricing/rate-card-airline/rate-card-airline.routes"
import rateCardRoutes from "../features/pricing/rate-cards/rate-card.routes"
import quotationRoutes   from "../features/quotation/quotation.routes"
const router = Router();

router.use("/auth", authRoutes);
router.use("/exporters", exporterRoutes);
router.use("/containers", containerRoutes);
router.use("/clients", clientRoutes);
router.use("/consignees", consigneeRoutes);
router.use("/allocations", allocationRoutes);
router.use("/shipments", shipmentRoutes);
 router.use("/invoices", invoiceRoutes);
  router.use("/transits", transitRoutes);

  router.use("/users", userRoutes);

router.use(
  "/documents",
  documentRoutes
);
 router.use("/dashboard", dashboardRoutes);



router.use(
  "/packing-lists",
  packingListRouts
);
router.use(
  "/documents",
  documentRoutes
);
router.use(
  "/invoice-payments",
  invoicePaymentRoutes
);
router.use(
  "/gate-movements",
  gateMovementRoutes
);
// ==========================================
// QUOTATION MANAGEMENT
// ==========================================
// Quote management
router.use(quotationRoutes);


// Rate card configurations
router.use("/rate-cards",rateCardRoutes);
router.use(rateCardConfigurationRoutes);
router.use(rateCardOptionRoutes);

// Airline configuration
 router.use(rateCardAirlineRoutes);

// Pricing sections
router.use(rateCardPricingSectionRoutes);

// Rate components
router.use(rateComponentRoutes);

// Weight slabs and slab rates
router.use(weightSlabRoutes);

// Validation, activation and archiving
router.use(rateCardActivationRoutes);


export default router;
