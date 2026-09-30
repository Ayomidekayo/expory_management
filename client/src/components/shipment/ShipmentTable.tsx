import {
  Loader2,
  PackageOpen,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Badge } from "../ui/badge";

import type { Shipment } from "../../types/shipment.types";

import ShipmentRowActions from "./ShipmentRowActions";

import { formatDateOnly } from "../../utils/date";

interface ShipmentTableProps {
  shipments: Shipment[];
  isLoading?: boolean;

  // Pagination information
  currentPage?: number;
  pageLimit?: number;
}

export default function ShipmentTable({
  shipments,
  isLoading = false,
  currentPage = 1,
  pageLimit = 10,
}: ShipmentTableProps) {
  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  /* =========================================
     EMPTY
  ========================================= */

  if (!shipments.length) {
    return (
      <div className="flex flex-col items-center rounded-xl border py-16">

        <PackageOpen className="mb-4 h-14 w-14 text-slate-400" />

        <h3 className="text-lg font-semibold">
          No Shipments Found
        </h3>

        <p className="text-sm text-slate-500">
          Create your first shipment.
        </p>

      </div>
    );
  }

  /* =========================================
     TABLE
  ========================================= */

  return (
    <div className="overflow-hidden rounded-xl border bg-white">

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
                Shipment No.
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead>
                Client
              </TableHead>

              <TableHead>
                Exporter
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                XF Number
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                NXP Number
              </TableHead>

              <TableHead className="hidden xl:table-cell">
                CCI Number
              </TableHead>

              <TableHead>
                Transport
              </TableHead>

              <TableHead>
                Status
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

            {shipments.map(
              (shipment, index) => {

                /*
                 * Continuous serial number
                 * across pagination.
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
                    key={shipment.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >

                    {/* S/N */}

                    <TableCell className="font-medium text-muted-foreground">
                      {serialNumber}
                    </TableCell>

                    {/* SHIPMENT NUMBER */}

                    <TableCell className="font-semibold">
                      {shipment.shipmentNumber}
                    </TableCell>

                    {/* SHIPMENT DATE */}

                    <TableCell>
                      {formatDateOnly(
                        shipment.shipmentDate
                      )}
                    </TableCell>

                    {/* CLIENT */}

                    <TableCell>
                      {shipment.client.companyName}
                    </TableCell>

                    {/* EXPORTER */}

                    <TableCell>
                      {shipment.exporter.name}
                    </TableCell>

                    {/* XF NUMBER */}

                    <TableCell className="hidden lg:table-cell">
                      {shipment.xfNumber ?? "-"}
                    </TableCell>

                    {/* NXP NUMBER */}

                    <TableCell className="hidden lg:table-cell">
                      {shipment.nxpNumber ?? "-"}
                    </TableCell>

                    {/* CCI NUMBER */}

                    <TableCell className="hidden xl:table-cell">
                      {shipment.cciNumber ?? "-"}
                    </TableCell>

                    {/* TRANSPORT */}

                    <TableCell>
                      <Badge variant="outline">
                        {shipment.transportMode}
                      </Badge>
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <Badge variant="secondary">
                        {shipment.status.replaceAll(
                          "_",
                          " "
                        )}
                      </Badge>
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell className="text-right">
                      <ShipmentRowActions
                        shipment={shipment}
                      />
                    </TableCell>

                  </TableRow>
                );
              }
            )}

          </TableBody>

        </Table>

      </div>

    </div>
  );
}