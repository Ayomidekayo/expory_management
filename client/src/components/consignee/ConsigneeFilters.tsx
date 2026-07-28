import { Search, RotateCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ConsigneeFilters() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const search =
    searchParams.get("search") ?? "";

  const active =
    searchParams.get("isActive") ?? "";

  const updateParam = (
    key: string,
    value: string
  ) => {
    const params =
      new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-4">

        {/* Search */}

        <div className="relative lg:col-span-2">

          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search company, contact person or email..."
            value={search}
            onChange={(e) =>
              updateParam(
                "search",
                e.target.value
              )
            }
            className="pl-10"
          />

        </div>

        {/* Status */}

        <select
          value={active}
          onChange={(e) =>
            updateParam(
              "isActive",
              e.target.value
            )
          }
          className="
            h-10
            rounded-md
            border
            border-input
            bg-background
            px-3
            text-sm
          "
        >
          <option value="">
            All Status
          </option>

          <option value="true">
            Active
          </option>

          <option value="false">
            Inactive
          </option>

        </select>

        {/* Reset */}

        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>

      </div>

    </div>
  );
}