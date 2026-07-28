import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import AllocationTable from "../../components/allocation/AllocationTable";
import AllocationStatisticsCards from "../../components/allocation/AllocationStatisticsCards";



export default function AllocationListPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Allocations
          </h1>

          <p className="text-muted-foreground">
            Manage export allocations.
          </p>

        </div>

        <Button asChild>

          <Link to="/allocations/new">

            <Plus className="mr-2 h-4 w-4" />

            New Allocation

          </Link>

        </Button>

      </div>

      <AllocationStatisticsCards />

      <AllocationTable />

    </div>
  );
}