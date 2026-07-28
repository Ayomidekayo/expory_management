import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import { useConsignees } from "../../hooks/consignee/useConsignees";

import ConsigneeSummaryCards from "../../components/consignee/ConsigneeSummaryCards";
import ConsigneeTable from "../../components/consignee/ConsigneeTable";
import ConsigneeFilters from "../../components/consignee/ConsigneeFilters";

export default function ConsigneeListPage() {
  const {
    data,
    isLoading,
  } = useConsignees();

  const consignees = data?.data ?? [];

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Consignees
          </h1>

          <p className="text-muted-foreground">
            Manage registered consignees.
          </p>
        </div>

        <Button asChild>
          <Link to="/consignees/new">
            <Plus className="mr-2 h-4 w-4" />
            New Consignee
          </Link>
        </Button>

      </div>

      {!isLoading && (
        <ConsigneeSummaryCards
          consignees={consignees}
        />
      )}

      <ConsigneeFilters/>

      <ConsigneeTable />

    </div>
  );
}