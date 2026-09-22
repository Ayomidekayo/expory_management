import {
  Package,
  Weight,
  MessageSquare,
  CalendarDays,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Badge } from "../../ui/badge";
import type { PackingList } from "../../../types/packing-list";

interface Props {
  packingList: PackingList;
}

export default function PackingItemsTable({
  packingList,
}: Props) {
  const items = packingList.items ?? [];

  const formatDate = (date?: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />

            <div>
              <h2 className="text-lg font-semibold">
                Packing List Items
              </h2>

              <p className="text-sm text-muted-foreground">
                {items.length}{" "}
                {items.length === 1 ? "item" : "items"} on this
                packing list
              </p>
            </div>
          </div>

          <Badge variant="secondary">
            {items.length}{" "}
            {items.length === 1 ? "Item" : "Items"}
          </Badge>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="whitespace-nowrap">
                #
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Item Date
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Description
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Package Type
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Packages
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Gross Weight
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Net Weight
              </TableHead>

              <TableHead className="whitespace-nowrap">
                Remarks
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50/70"
                >
                  {/* NUMBER */}
                  <TableCell>
                    <Badge variant="outline">
                      {index + 1}
                    </Badge>
                  </TableCell>

                  {/* ITEM DATE */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />

                      <span>
                        {formatDate(item.itemDate)}
                      </span>
                    </div>
                  </TableCell>

                  {/* DESCRIPTION */}
                  <TableCell className="min-w-[220px]">
                    <div className="font-medium text-slate-900">
                      {item.description}
                    </div>
                  </TableCell>

                  {/* PACKAGE TYPE */}
                  <TableCell>
                    {item.packageType || "-"}
                  </TableCell>

                  {/* PACKAGES */}
                  <TableCell>
                    {item.packages ?? "-"}
                  </TableCell>

                  {/* GROSS WEIGHT */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Weight className="h-3.5 w-3.5 text-muted-foreground" />

                      {item.grossWeight != null
                        ? `${Number(
                            item.grossWeight
                          ).toLocaleString()} KG`
                        : "-"}
                    </div>
                  </TableCell>

                  {/* NET WEIGHT */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Weight className="h-3.5 w-3.5 text-muted-foreground" />

                      {item.netWeight != null
                        ? `${Number(
                            item.netWeight
                          ).toLocaleString()} KG`
                        : "-"}
                    </div>
                  </TableCell>

                  {/* REMARKS */}
                  <TableCell className="min-w-[180px]">
                    {item.remarks ? (
                      <div className="flex items-start gap-1.5 text-sm text-slate-600">
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                        <span>{item.remarks}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        -
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  No packing list items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}