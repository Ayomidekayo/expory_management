import { Link } from "react-router-dom";
import {
  Eye,
  Plus,
  ClipboardList,
  PackageCheck,
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
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocations: Allocation[];
}

const statusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "APPROVED":
    case "COMPLETED":
      return "default";

    case "PENDING":
      return "secondary";

    case "REJECTED":
      return "destructive";

    default:
      return "outline";
  }
};

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatPriority(priority?: string | null) {
  if (!priority) return "-";

  return priority
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatService(service?: string | null) {
  if (!service) return "-";

  return service
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function ClientAllocationTable({
  allocations,
}: Props) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Allocation History
            </CardTitle>

            <p className="mt-0.5 text-sm text-slate-500">
              View the client's allocation requests and shipment status.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {allocations.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ClipboardList className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-slate-900">
              No allocations found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              This client does not have any allocation history yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Allocation No
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Service
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Priority
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Destination
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shipment
                  </TableHead>

                  <TableHead className="px-6 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allocations.map((allocation) => (
                  <TableRow
                    key={allocation.id}
                    className="border-slate-100 transition-colors hover:bg-slate-50/70"
                  >
                    {/* Allocation */}
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
                          <ClipboardList className="h-4 w-4" />
                        </div>

                        <span className="whitespace-nowrap text-sm font-semibold text-slate-900">
                          {allocation.allocationNumber}
                        </span>
                      </div>
                    </TableCell>

                    {/* Service */}
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-slate-700">
                        {formatService(
                          allocation.serviceType
                        )}
                      </span>
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                        {formatPriority(
                          allocation.priority
                        )}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={statusVariant(
                          allocation.status
                        )}
                        className="whitespace-nowrap"
                      >
                        {formatStatus(
                          allocation.status
                        )}
                      </Badge>
                    </TableCell>

                    {/* Destination */}
                    <TableCell>
                      <span className="max-w-[180px] truncate text-sm text-slate-600">
                        {allocation.destinationCountry ||
                          "-"}
                      </span>
                    </TableCell>

                    {/* Shipment */}
                    <TableCell>
                      {allocation.shipment ? (
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                            <PackageCheck className="h-4 w-4" />
                          </span>

                          <div className="flex flex-col">
                            <Badge
                              variant="default"
                              className="w-fit"
                            >
                              Generated
                            </Badge>

                            {allocation.shipment
                              .shipmentNumber && (
                              <span className="mt-1 text-xs text-slate-500">
                                {
                                  allocation.shipment
                                    .shipmentNumber
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Badge
                          variant="outline"
                          className="whitespace-nowrap text-slate-500"
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="px-6 text-right">
                      {allocation.shipment ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Link
                            to={`/shipments/${allocation.shipment.id}`}
                            aria-label="View shipment"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-slate-200"
                        >
                          <Link
                            to={`/shipments/create?allocationId=${allocation.id}`}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Generate
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}