import {
  Package,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import {
  Badge,
} from "../../ui/badge";
import type { PackingList } from "../../../types/packing-list";


interface Props {
  packingList: PackingList;
}

export default function PackingItemsTable({
  packingList,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      {/* Header */}

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Package className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Packing Items
          </h2>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                #
              </TableHead>

              <TableHead>
                Description
              </TableHead>

              <TableHead>
                Package Type
              </TableHead>

              <TableHead>
                Packages
              </TableHead>

              <TableHead>
                Gross Weight
              </TableHead>

              <TableHead>
                Net Weight
              </TableHead>

              <TableHead>
                Remarks
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {packingList.items.map(
              (item, index) => (

                <TableRow
                  key={item.id}
                >

                  <TableCell>

                    <Badge variant="outline">

                      {index + 1}

                    </Badge>

                  </TableCell>

                  <TableCell className="font-medium">

                    {item.description}

                  </TableCell>

                  <TableCell>

                    {item.packageType || "-"}

                  </TableCell>

                  <TableCell>

                    {item.packages ?? "-"}

                  </TableCell>

                  <TableCell>

                    {Number(
                      item.grossWeight
                    ).toLocaleString()} KG

                  </TableCell>

                  <TableCell>

                    {Number(
                      item.netWeight
                    ).toLocaleString()} KG

                  </TableCell>

                  <TableCell>

                    {item.remarks || "-"}

                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </div>

    </div>
  );
}