import {
  Search,
  RotateCcw,
} from "lucide-react";

import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";


export default function PackingListFilters() {

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");

  function resetFilters() {

    setSearch("");

    setSortBy("createdAt");

    setSortOrder("desc");

  }

  return (

    <div className="rounded-xl border bg-white p-6">

      <div className="grid gap-4 lg:grid-cols-4">

        {/* Search */}

        <div className="relative">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search..."
            className="pl-9"
          />

        </div>

        {/* Sort By */}

        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >

          <SelectTrigger>

            <SelectValue/>

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

        {/* Sort Order */}

        <Select
          value={sortOrder}
          onValueChange={setSortOrder}
        >

          <SelectTrigger>

            <SelectValue />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="desc">
              Newest First
            </SelectItem>

            <SelectItem value="asc">
              Oldest First
            </SelectItem>

          </SelectContent>

        </Select>

        {/* Reset */}

        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
        >

          <RotateCcw className="mr-2 h-4 w-4" />

          Reset Filters

        </Button>

      </div>

    </div>

  );
}