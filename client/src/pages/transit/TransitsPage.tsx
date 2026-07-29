import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import TransitStatisticsCards from "../../components/transit/TransitStatisticsCards";
import TransitTable from "../../components/transit/TransitTable";

import { useTransits } from "../../hooks/transit/useTransits";
import TransitFilters from "./TransitFilters";

import { useState } from "react";
import type { TransitQuery } from "../../types/transit.type";

export default function TransitsPage() {
  
    const [filters, setFilters] =
  useState<TransitQuery>({

    page: 1,

    limit: 10,

});

 const {
  data,
  isLoading,
} = useTransits(filters);
  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Transits

          </h1>

          <p className="text-muted-foreground">

            Manage shipment transit records.

          </p>

        </div>

        <Link to="/transits/create">

          <Button>

            <Plus className="mr-2 h-4 w-4" />

            Create Transit

          </Button>

        </Link>

      </div>

      <TransitStatisticsCards
        data={data?.data ?? []}
      />

      {/* Filters will go here */}
<TransitFilters
  filters={filters}
  onChange={setFilters}
/>
      <TransitTable
        data={data?.data ?? []}
        loading={isLoading}
      />

    </div>

  );

}