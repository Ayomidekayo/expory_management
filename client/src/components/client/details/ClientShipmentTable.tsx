import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  Package,
  Ship,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

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

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipments: Shipment[];
}

function statusVariant(
  status: Shipment["status"]
): "default" | "secondary" | "destructive" | "outline" {
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

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatTransport(mode?: string | null) {
  if (!mode) return "-";

  return mode
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function ClientShipmentTable({
  shipments,
}: Props) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Ship className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Shipment History
            </CardTitle>

            <p className="mt-0.5 text-sm text-slate-500">
              View shipments, documents and current shipment status.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {shipments.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Ship className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-slate-900">
              No shipments available
            </p>

            <p className="mt-1 text-sm text-slate-500">
              This client does not have any shipment history yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shipment No
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Transport
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Shipping Line
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Exporter
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Consignee
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Invoices
                  </TableHead>

                  <TableHead className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Packing List
                  </TableHead>

                  <TableHead className="px-6 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {shipments.map((shipment) => {
                  const invoices =
                    shipment.invoices ?? [];

                  return (
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
                            {shipment.shipmentNumber}
                          </span>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <span className="whitespace-nowrap text-sm text-slate-600">
                          {new Date(
                            shipment.shipmentDate
                          ).toLocaleDateString()}
                        </span>
                      </TableCell>

                      {/* Transport */}
                      <TableCell>
                        <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                          {formatTransport(
                            shipment.transportMode
                          )}
                        </span>
                      </TableCell>

                      {/* Shipping Line */}
                      <TableCell>
                        <span className="max-w-[160px] truncate text-sm text-slate-600">
                          {shipment.shippingLine ||
                            "-"}
                        </span>
                      </TableCell>

                      {/* Exporter */}
                      <TableCell>
                        <span className="max-w-[160px] truncate text-sm text-slate-600">
                          {shipment.exporter?.name ??
                            "-"}
                        </span>
                      </TableCell>

                      {/* Consignee */}
                      <TableCell>
                        <span className="max-w-[160px] truncate text-sm text-slate-600">
                          {shipment.consignee?.name ??
                            "-"}
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

                      {/* Invoices */}
                      <TableCell>
                        {invoices.length > 0 ? (
                          <div className="min-w-[120px] space-y-2">
                            <Badge className="w-fit gap-1">
                              <FileText className="h-3 w-3" />

                              {invoices.length}{" "}
                              {invoices.length === 1
                                ? "Invoice"
                                : "Invoices"}
                            </Badge>

                            <div className="space-y-1">
                              {invoices.map(
                                (invoice) => (
                                  <Link
                                    key={invoice.id}
                                    to={`/invoices/${invoice.id}`}
                                    className="block max-w-[140px] truncate text-xs font-medium text-slate-500 transition-colors hover:text-primary hover:underline"
                                  >
                                    {
                                      invoice.invoiceNumber
                                    }
                                  </Link>
                                )
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

                      {/* Packing List */}
                      <TableCell>
                        {shipment.packingList ? (
                          <Badge className="w-fit gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                            <Package className="h-3 w-3" />
                            Available
                          </Badge>
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
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Link
                            to={`/shipments/${shipment.id}`}
                            aria-label="View shipment"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}