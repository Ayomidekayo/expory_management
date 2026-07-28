import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

import { useConsignee } from "../../hooks/consignee/useConsignee";

import ConsigneeStatisticsCard from "../../components/consignee/details/ConsigneeStatisticsCard";
import ConsigneeInformationCard from "../../components/consignee/details/ConsigneeInformationCard";
import ConsigneeAllocationTable from "../../components/consignee/ConsigneeAllocationTable";
import ConsigneeShipmentTable from "../../components/consignee/ConsigneeShipmentTable";

export default function ConsigneeDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useConsignee(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div className="py-20 text-center">Consignee not found.</div>;
  }

  const consignee = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{consignee.name}</h1>

        <p className="text-muted-foreground">Consignee Details</p>
      </div>

      <ConsigneeStatisticsCard consignee={consignee} />

      <ConsigneeInformationCard consignee={consignee} />

      <ConsigneeAllocationTable allocations={consignee.allocations ?? []} />

      <ConsigneeShipmentTable shipments={consignee.shipments ?? []} />
    </div>
  );
}
