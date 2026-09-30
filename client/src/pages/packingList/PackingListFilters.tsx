import {
  Search,
  RotateCcw,
} from "lucide-react";

import {
  Input,
} from "../../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { Button } from "../../components/ui/button";

import type { PackingListQuery } from "../../types/packing-list";

interface PackingListFiltersProps {
  filters: PackingListQuery;

  onChange: (
    filters: Partial<PackingListQuery>
  ) => void;

  onReset: () => void;
}

export default function PackingListFilters({
  filters,
  onChange,
  onReset,
}: PackingListFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="grid gap-4 lg:grid-cols-4">

        {/* =========================================
            SEARCH
        ========================================= */}

        <div className="relative">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            value={filters.search ?? ""}
            onChange={(e) =>
              onChange({
                search: e.target.value,
              })
            }
            placeholder="Search packing lists..."
            className="pl-9"
          />

        </div>

        {/* =========================================
            SORT BY
        ========================================= */}

        <Select
          value={filters.sortBy ?? "createdAt"}
          onValueChange={(value) => {
            onChange({
              sortBy:
                value as PackingListQuery["sortBy"],
            });
          }}
        >

          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="createdAt">
              Created Date
            </SelectItem>

            <SelectItem value="packingDate">
              Packing Date
            </SelectItem>

            <SelectItem value="packingListNumber">
              Packing List Number
            </SelectItem>

          </SelectContent>

        </Select>

        {/* =========================================
            SORT ORDER
        ========================================= */}

        <Select
          value={filters.sortOrder ?? "asc"}
          onValueChange={(value) => {
            onChange({
              sortOrder:
                value as PackingListQuery["sortOrder"],
            });
          }}
        >

          <SelectTrigger>
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="asc">
              Oldest First
            </SelectItem>

            <SelectItem value="desc">
              Newest First
            </SelectItem>

          </SelectContent>

        </Select>

        {/* =========================================
            RESET
        ========================================= */}

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />

          Reset Filters
        </Button>

      </div>

    </div>
  );
}