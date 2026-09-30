import { Link } from "react-router-dom";

import {
  Eye,
  Pencil,
  Loader2,
} from "lucide-react";

import type { Allocation } from "../../types/allocation.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";

import AllocationStatusBadge from "./AllocationStatusBadge";
import AllocationPriorityBadge from "./AllocationPriorityBadge";
import AllocationRowActions from "./AllocationRowAction";

interface AllocationTableProps {
  allocations: Allocation[];
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;

  // Pagination information
  currentPage?: number;
  pageLimit?: number;
}

export default function AllocationTable({
  allocations,
  isLoading = false,
  isFetching = false,
  isError = false,
  currentPage = 1,
  pageLimit = 10,
}: AllocationTableProps) {
  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-500" />

        <p className="mt-3 text-sm text-muted-foreground">
          Loading allocations...
        </p>
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
        <h3 className="text-lg font-semibold text-red-800">
          Unable to load allocations
        </h3>

        <p className="mt-2 text-sm text-red-600">
          Please try again.
        </p>
      </div>
    );
  }

  /* =========================================
     EMPTY
  ========================================= */

  if (!allocations.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <h3 className="text-lg font-semibold">
          No Allocations Found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Create your first allocation.
        </p>
      </div>
    );
  }

  /* =========================================
     TABLE
  ========================================= */

  return (
    <div className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* Fetching indicator */}

      {isFetching && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-md">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading...
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* S/N */}

              <TableHead className="w-[70px]">
                S/N
              </TableHead>

              <TableHead>
                Allocation No.
              </TableHead>

              <TableHead>
                Cargo Type
              </TableHead>

              <TableHead>
                Client
              </TableHead>

              <TableHead>
                Exporter
              </TableHead>

              <TableHead>
                Consignee
              </TableHead>

              <TableHead>
                Service
              </TableHead>

              <TableHead>
                Priority
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Shipment Date
              </TableHead>

              <TableHead>
                Created
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allocations.map(
              (allocation, index) => {
                /*
                 * Continuous serial number across pages.
                 *
                 * Page 1:
                 * 1, 2, 3 ... 10
                 *
                 * Page 2:
                 * 11, 12, 13 ... 20
                 */

                const serialNumber =
                  (currentPage - 1) *
                    pageLimit +
                  index +
                  1;

                return (
                  <TableRow
                    key={allocation.id}
                  >
                    {/* S/N */}

                    <TableCell className="font-medium text-muted-foreground">
                      {serialNumber}
                    </TableCell>

                    {/* ALLOCATION NUMBER */}

                    <TableCell className="font-medium">
                      {allocation.allocationNumber}
                    </TableCell>

                    {/* CARGO TYPE */}

                    <TableCell>
                      {allocation.cargoType ?? "-"}
                    </TableCell>

                    {/* CLIENT */}

                    <TableCell>
                      {allocation.client
                        ?.companyName ?? "-"}
                    </TableCell>

                    {/* EXPORTER */}

                    <TableCell>
                      {allocation.exporter
                        ?.name ?? "-"}
                    </TableCell>

                    {/* CONSIGNEE */}

                    <TableCell>
                      {allocation.consignee
                        ?.name ?? "-"}
                    </TableCell>

                    {/* SERVICE */}

                    <TableCell>
                      {allocation.serviceType
                        .replaceAll("_", " ")}
                    </TableCell>

                    {/* PRIORITY */}

                    <TableCell>
                      <AllocationPriorityBadge
                        priority={
                          allocation.priority
                        }
                      />
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <AllocationStatusBadge
                        status={
                          allocation.status
                        }
                      />
                    </TableCell>

                    {/* SHIPMENT DATE */}

                    <TableCell>
                      {allocation.expectedShipmentDate
                        ? new Date(
                            allocation.expectedShipmentDate
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    {/* CREATED */}

                    <TableCell>
                      {new Date(
                        allocation.createdAt
                      ).toLocaleDateString()}
                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          asChild
                        >
                          <Link
                            to={`/allocations/${allocation.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          asChild
                        >
                          <Link
                            to={`/allocations/${allocation.id}/edit`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>

                        <AllocationRowActions
                          allocation={allocation}
                        />
                      </div>
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