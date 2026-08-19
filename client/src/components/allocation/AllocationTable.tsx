import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
} from "lucide-react";

import { useAllocations } from "../../hooks/allocation/useAllocations";

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


export default function AllocationTable() {
  const {
    data,
    isLoading,
  } = useAllocations();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        Loading allocations...
      </div>
    );
  }

  const allocations =
    data?.data ?? [];

  if (!allocations.length) {
    return (
      <div className="rounded-lg border p-10 text-center">

        <h3 className="text-lg font-semibold">
          No Allocations Found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Create your first allocation.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      <Table>

        <TableHeader>

          <TableRow>

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
            (allocation) => (

              <TableRow
                key={allocation.id}
              >

                <TableCell className="font-medium">
                  {allocation.allocationNumber}
                </TableCell>


<TableCell>
  {allocation.cargoType ?? "-"}
</TableCell>
                <TableCell>
                  {allocation.client
                    ?.companyName ??
                    "-"}
                </TableCell>

                <TableCell>
                  {allocation.exporter
                    ?.name ??
                    "-"}
                </TableCell>

                <TableCell>
                  {allocation.consignee
                    ?.name ??
                    "-"}
                </TableCell>

                <TableCell>
                  {allocation.serviceType.replaceAll(
                    "_",
                    " "
                  )}
                </TableCell>

                <TableCell>

                  <AllocationPriorityBadge
                    priority={
                      allocation.priority
                    }
                  />

                </TableCell>

                <TableCell>

                  <AllocationStatusBadge
                    status={
                      allocation.status
                    }
                  />

                </TableCell>

                <TableCell>

                  {allocation.expectedShipmentDate
                    ? new Date(
                        allocation.expectedShipmentDate
                      ).toLocaleDateString()
                    : "-"}

                </TableCell>

                <TableCell>

                  {new Date(
                    allocation.createdAt
                  ).toLocaleDateString()}

                </TableCell>

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
                      allocation={
                        allocation
                      }
                    />

                  </div>

                </TableCell>

              </TableRow>

            )
          )}

        </TableBody>

      </Table>

    </div>
  );
}