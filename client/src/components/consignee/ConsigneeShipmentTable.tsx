import {
  ClipboardList,
  Eye,
  Ship,
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

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  shipments: any[];
}

function statusVariant(status?: string) {
  switch (status) {
    case "COMPLETED":
      return "default";

    case "IN_TRANSIT":
      return "secondary";

    case "CANCELLED":
      return "destructive";

    default:
      return "outline";
  }
}

function formatStatus(status?: string) {
  if (!status) return "-";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatTransport(mode?: string) {
  if (!mode) return "-";

  return mode
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function ConsigneeShipmentTable({
  shipments,
}: Props) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <CardHeader className="border-b border-slate-200 bg-slate-50/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Ship className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Shipment History
            </CardTitle>

            <p className="mt-0.5 text-sm text-slate-500">
              View shipments associated with this consignee.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {shipments.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Ship className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-slate-900">
              No shipments found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              This consignee does not have any shipments yet.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shipment No.
                  </TableHead>

                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shipment Date
                  </TableHead>

                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </TableHead>

                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Transport
                  </TableHead>

                  <TableHead className="px-6 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow
                    key={shipment.id}
                    className="border-slate-100 transition-colors hover:bg-slate-50/70"
                  >
                    {/* Shipment Number */}
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500">
                          <Ship className="h-4 w-4" />
                        </div>

                        <span className="whitespace-nowrap text-sm font-semibold text-slate-900">
                          {shipment.shipmentNumber ?? "-"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Shipment Date */}
                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-slate-600">
                        {shipment.shipmentDate
                          ? new Date(
                              shipment.shipmentDate
                            ).toLocaleDateString()
                          : "-"}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={statusVariant(
                          shipment.status
                        )}
                        className="whitespace-nowrap"
                      >
                        {formatStatus(
                          shipment.status
                        )}
                      </Badge>
                    </TableCell>

                    {/* Transport */}
                    <TableCell>
                      <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                        {formatTransport(
                          shipment.transportMode
                        )}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="px-6 text-right">
                      <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Link
                          to={`/shipments/${shipment.id}`}
                          aria-label={`View shipment ${
                            shipment.shipmentNumber ?? ""
                          }`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
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