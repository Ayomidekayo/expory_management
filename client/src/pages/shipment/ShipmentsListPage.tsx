import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import ShipmentStatisticsCards from "../../components/shipment/ShipmentStatisticsCards";
import ShipmentTable from "../../components/shipment/ShipmentTable";

export default function ShipmentListPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Shipments
          </h1>

          <p className="text-muted-foreground">
            Manage export shipments.
          </p>

        </div>

        <Button asChild>

          <Link to="/shipments/new">

            <Plus className="mr-2 h-4 w-4" />

            New Shipment

          </Link>

        </Button>

      </div>

      <ShipmentStatisticsCards />

      <ShipmentTable />

    </div>
  );
}