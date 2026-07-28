import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import PackingListStatisticsCards from "../../components/packing-list/PackingListStatisticsCards";

import PackingListTable from "../../components/packing-list/PackingListTable";
import { usePackingLists } from "../../hooks/packingList/usePackingLists";
import PackingListFilters from "./PackingListFilters";

export default function PackingListsPage() {
  const { data, isLoading } =
    usePackingLists();
console.log(data)
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Packing Lists
          </h1>

          <p className="text-muted-foreground">
            Manage all packing lists.
          </p>

        </div>

        <Link to="/packing-lists/create">

          <Button>

            <Plus className="mr-2 h-4 w-4" />

            Create Packing List

          </Button>

        </Link>

      </div>

      <PackingListStatisticsCards
        data={data?.data ?? []}
      />

      <PackingListFilters />

      <PackingListTable
        data={data?.data ?? []}
        loading={isLoading}
      />

    </div>
  );
}