
import type { TransitMovementQuery } from "../../types/transit-movement";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Search,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

interface Props {
  filters: TransitMovementQuery;
  onChange: (filters: Partial<TransitMovementQuery>) => void;
  onReset: () => void;
}

export default function TransitMovementFilters({
  filters,
  onChange,
  onReset,
}: Props) {
  const hasFilters = Boolean(
    filters.search ||
    filters.direction ||
    filters.clientName ||
    filters.shipmentId ||
    filters.association ||
    filters.fromDate ||
    filters.toDate ||
    filters.isLocked
  );

  return (
    <div className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!hasFilters}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset filters
        </Button>
      </div>

      {/* GENERAL SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={filters.search ?? ""}
          onChange={(event) =>
            onChange({
              search: event.target.value,
            })
          }
          placeholder="Search movement number, shipment, client, truck or container..."
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* DIRECTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Movement Direction
          </label>

          <select
            value={filters.direction ?? ""}
            onChange={(event) =>
              onChange({
                direction: event.target.value
                  ? event.target.value as "IN" | "OUT"
                  : undefined,
              })
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Directions</option>
            <option value="IN">Transit In</option>
            <option value="OUT">Transit Out</option>
          </select>
        </div>

        {/* CLIENT NAME */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Client Name
          </label>

          <Input
            value={filters.clientName ?? ""}
            onChange={(event) =>
              onChange({
                clientName: event.target.value || undefined,
              })
            }
            placeholder="Search client name..."
          />
        </div>

        {/* ASSOCIATION */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Shipment Association
          </label>

          <select
            value={filters.association ?? ""}
            onChange={(event) =>
              onChange({
                association: event.target.value
                  ? event.target.value as "LINKED" | "INDEPENDENT"
                  : undefined,
              })
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Records</option>
            <option value="LINKED">Linked to Shipment</option>
            <option value="INDEPENDENT">Independent</option>
          </select>
        </div>

        {/* LOCK STATUS */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Record Status
          </label>

          <select
            value={filters.isLocked ?? ""}
            onChange={(event) =>
              onChange({
                isLocked: event.target.value
                  ? event.target.value as "true" | "false"
                  : undefined,
              })
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="false">Active</option>
            <option value="true">Locked</option>
          </select>
        </div>

        {/* FROM DATE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            From Date
          </label>

          <Input
            type="date"
            value={filters.fromDate ?? ""}
            onChange={(event) =>
              onChange({
                fromDate: event.target.value || undefined,
              })
            }
          />
        </div>

        {/* TO DATE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            To Date
          </label>

          <Input
            type="date"
            value={filters.toDate ?? ""}
            min={filters.fromDate}
            onChange={(event) =>
              onChange({
                toDate: event.target.value || undefined,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Combine filters to narrow down movement records.
        </p>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">
            Sort by
          </label>

          <select
            value={`${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`}
            onChange={(event) => {
              const [sortBy, sortOrder] = event.target.value.split(":");

              onChange({
                sortBy: sortBy as TransitMovementQuery["sortBy"],
                sortOrder: sortOrder as "asc" | "desc",
              });
            }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="createdAt:desc">Newest Created</option>
            <option value="createdAt:asc">Oldest Created</option>
            <option value="transitDate:desc">Latest Movement Date</option>
            <option value="transitDate:asc">Oldest Movement Date</option>
            <option value="transitNumber:asc">Movement Number A–Z</option>
            <option value="transitNumber:desc">Movement Number Z–A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
