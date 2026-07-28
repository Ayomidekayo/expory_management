import { Search, RotateCcw } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { InvoiceQuery } from "../../types";



interface Props {
  filters: InvoiceQuery;

  onChange: (
    value: InvoiceQuery
  ) => void;
}

export default function InvoiceFilters({
  filters,
  onChange,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">

        {/* Search */}

        <div className="relative lg:col-span-2">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-10"
            placeholder="Invoice, Shipment, Client..."
            value={filters.search ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                search: e.target.value,
              })
            }
          />

        </div>

        {/* Status */}

        <Select
          value={filters.status}
          onValueChange={(value) =>
            onChange({
              ...filters,
              status:
                value === "ALL"
                  ? undefined
                  : (value as any),
            })
          }
        >
          <SelectTrigger>

            <SelectValue placeholder="Status" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="ALL">
              All Status
            </SelectItem>

            <SelectItem value="DRAFT">
              Draft
            </SelectItem>

            <SelectItem value="SENT">
              Sent
            </SelectItem>

            <SelectItem value="APPROVED">
              Approved
            </SelectItem>

            <SelectItem value="PAID">
              Paid
            </SelectItem>

            <SelectItem value="CANCELLED">
              Cancelled
            </SelectItem>

          </SelectContent>

        </Select>

        {/* Currency */}

        <Select
          value={filters.currency}
          onValueChange={(value) =>
            onChange({
              ...filters,
              currency:
                value === "ALL"
                  ? undefined
                  : (value as any),
            })
          }
        >
          <SelectTrigger>

            <SelectValue placeholder="Currency" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="ALL">
              All Currency
            </SelectItem>

            <SelectItem value="NGN">
              NGN
            </SelectItem>

            <SelectItem value="USD">
              USD
            </SelectItem>

            <SelectItem value="EUR">
              EUR
            </SelectItem>

          </SelectContent>

        </Select>

        {/* From Date */}

        <Input
          type="date"
          value={(filters as any).fromDate ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              fromDate: e.target.value,
            } as any)
          }
        />

        <Select
  value={filters.datePreset}
  onValueChange={(value) =>
    onChange({
      ...filters,
      datePreset:
        value === "CUSTOM"
          ? undefined
          : (value as any),
    })
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Quick Date" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="CUSTOM">
      Custom
    </SelectItem>

    <SelectItem value="TODAY">
      Today
    </SelectItem>

    <SelectItem value="THIS_WEEK">
      This Week
    </SelectItem>

    <SelectItem value="THIS_MONTH">
      This Month
    </SelectItem>

    <SelectItem value="THIS_QUARTER">
      This Quarter
    </SelectItem>

    <SelectItem value="THIS_YEAR">
      This Year
    </SelectItem>
  </SelectContent>
</Select>

        {/* To Date */}

        <Input
          type="date"
          value={(filters as any).toDate ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              toDate: e.target.value,
            } as any)
          }
        />

      </div>

      <div className="mt-5 flex justify-end">

        <Button
          variant="outline"
          onClick={() =>
            onChange({
              page: 1,
              limit: 10,
              sortBy: "createdAt",
              sortOrder: "desc",
            })
          }
        >

          <RotateCcw className="mr-2 h-4 w-4" />

          Reset Filters

        </Button>

      </div>

    </div>
  );
}