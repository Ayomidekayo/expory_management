import {
  Eye,
  Pencil,
  Package,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Button,
} from "../ui/button";

import {
  Badge,
} from "../ui/badge";

import type { PackingList } from "../../types/packing-list";

interface Props {
  data: PackingList[];
  loading?: boolean;

  // Pagination information
  currentPage?: number;
  pageLimit?: number;
}

export default function PackingListTable({
  data,
  loading = false,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">
        Loading packing lists...
      </div>
    );
  }

  /* =========================================
     EMPTY
  ========================================= */

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16">
        <div className="flex flex-col items-center gap-4">

          <Package className="h-16 w-16 text-muted-foreground" />

          <div>
            <h3 className="text-lg font-semibold">
              No Packing Lists Found
            </h3>

            <p className="text-muted-foreground">
              Create your first packing list.
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================
     TABLE
  ========================================= */

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <Table>

          {/* =========================================
              HEADER
          ========================================= */}

          <TableHeader>

            <TableRow>

              {/* S/N */}

              <TableHead className="w-[70px]">
                S/N
              </TableHead>

              <TableHead>
                Packing No.
              </TableHead>

              <TableHead>
                Shipment
              </TableHead>

              <TableHead>
                Client
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
                Date
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          {/* =========================================
              BODY
          ========================================= */}

          <TableBody>

            {data.map((packing, index) => {

              /*
               * Continuous serial number across pages.
               *
               * Page 1:
               * 1 - 10
               *
               * Page 2:
               * 11 - 20
               *
               * Page 3:
               * 21 - 30
               */

              const serialNumber =
                (currentPage - 1) *
                  pageLimit +
                index +
                1;

              return (
                <TableRow
                  key={packing.id}
                  className="transition-colors hover:bg-slate-50/70"
                >

                  {/* S/N */}

                  <TableCell className="font-medium text-muted-foreground">
                    {serialNumber}
                  </TableCell>

                  {/* PACKING NUMBER */}

                  <TableCell className="font-semibold">
                    {packing.packingListNumber}
                  </TableCell>

                  {/* SHIPMENT */}

                  <TableCell>
                    {packing.shipment.shipmentNumber}
                  </TableCell>

                  {/* CLIENT */}

                  <TableCell>
                    {packing.shipment.client?.companyName ?? "-"}
                  </TableCell>

                  {/* PACKAGES */}

                  <TableCell>
                    <Badge variant="outline">
                      {packing.totalPackages ?? 0}
                    </Badge>
                  </TableCell>

                  {/* GROSS WEIGHT */}

                  <TableCell>
                    {Number(
                      packing.grossWeight
                    ).toLocaleString()}{" "}
                    KG
                  </TableCell>

                  {/* NET WEIGHT */}

                  <TableCell>
                    {Number(
                      packing.netWeight
                    ).toLocaleString()}{" "}
                    KG
                  </TableCell>

                  {/* DATE */}

                  <TableCell>
                    {new Date(
                      packing.packingDate
                    ).toLocaleDateString()}
                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell className="text-right">

                    <div className="flex justify-end gap-2">

                      {/* VIEW */}

                      <Link
                        to={`/packing-lists/${packing.id}`}
                      >
                        <Button
                          size="icon"
                          variant="outline"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      {/* EDIT */}

                      <Link
                        to={`/packing-lists/${packing.id}/edit`}
                      >
                        <Button
                          size="icon"
                          variant="outline"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>

                    </div>

                  </TableCell>

                </TableRow>
              );
            })}

          </TableBody>

        </Table>

      </div>

    </div>
  );
}