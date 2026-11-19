import { Eye, MapPin, Package, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

/**
 * The list only relies on fields that belong to the Transit model.
 * Related objects are optional so this component also works when the API
 * returns a lighter list response without every relation populated.
 */
type TransitRecord = {
  id: string;
  transitNumber?: string | null;
  origin?: string | null;
  destination?: string | null;
  transportMode?: string | null;
  transporter?: string | null;
  transitInvoice?: string | null;
  agentNumber?: string | null;
  exporterNumber?: string | null;
  wibNumber?: string | null;
  quantity?: number | string | null;
  description?: string | null;
  unitPrice?: number | string | null;
  totalPrice?: number | string | null;
  createdAt?: string | Date | null;
  shipment?: {
    shipmentNumber?: string | null;
  } | null;
  container?: {
    containerNumber?: string | null;
    containerType?: string | null;
    containerSize?: string | null;
  } | null;
};

interface Props {
  data: TransitRecord[];
  loading?: boolean;
  currentPage?: number;
  pageLimit?: number;
}

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "—";
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? numericValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : String(value);
}

function formatMode(value?: string | null) {
  if (!value) return "—";
  return value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function TransitModeIcon({ mode }: { mode?: string | null }) {
  if (mode === "ROAD") return <Truck className="h-3.5 w-3.5" />;
  if (mode === "SEA") return <Package className="h-3.5 w-3.5" />;
  return <MapPin className="h-3.5 w-3.5" />;
}

export default function TransitTable({
  data,
  loading = false,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="w-full rounded-xl border bg-white px-4 py-14 text-center text-sm text-slate-500 shadow-sm">
        Loading transit records...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-xl border bg-white px-4 py-14 text-center shadow-sm">
        <Package className="mx-auto h-10 w-10 text-slate-300" />
        <h3 className="mt-3 text-base font-semibold text-slate-800">
          No transit records found
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Transit records will appear here once they have been created.
        </p>
      </div>
    );
  }

  const openDetails = (transit: TransitRecord) => {
    navigate(`/transits/${transit.id}`);
  };

  return (
    <div className="w-full min-w-0">
      {/* Desktop and tablet table */}
      <div className="hidden w-full overflow-hidden rounded-xl border bg-white shadow-sm md:block">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="w-[68px] whitespace-nowrap">S/N</TableHead>
                <TableHead className="whitespace-nowrap">Transit No.</TableHead>
                <TableHead className="whitespace-nowrap">Shipment</TableHead>
                <TableHead className="whitespace-nowrap">Container</TableHead>
                <TableHead className="whitespace-nowrap">Origin</TableHead>
                <TableHead className="whitespace-nowrap">Destination</TableHead>
                <TableHead className="whitespace-nowrap">Mode</TableHead>
                <TableHead className="whitespace-nowrap">Transporter</TableHead>
                <TableHead className="whitespace-nowrap text-right">Quantity</TableHead>
                <TableHead className="whitespace-nowrap text-right">Total Price</TableHead>
                <TableHead className="whitespace-nowrap">Created</TableHead>
                <TableHead className="w-[92px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((transit, index) => {
                const serialNumber = (currentPage - 1) * pageLimit + index + 1;

                return (
                  <TableRow
                    key={transit.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open transit ${transit.transitNumber ?? "record"}`}
                    onClick={() => openDetails(transit)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDetails(transit);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-emerald-50/50 focus:bg-emerald-50 focus:outline-none"
                  >
                    <TableCell className="font-medium text-slate-500">
                      {serialNumber}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-slate-900">
                      {transit.transitNumber || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {transit.shipment?.shipmentNumber || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {transit.container?.containerNumber || "—"}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{transit.origin || "—"}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{transit.destination || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="inline-flex items-center gap-1 whitespace-nowrap">
                        <TransitModeIcon mode={transit.transportMode} />
                        {formatMode(transit.transportMode)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[170px] truncate">
                      {transit.transporter || "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(transit.quantity)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatNumber(transit.totalPrice)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">
                      {formatDate(transit.createdAt)}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => openDetails(transit)}
                        aria-label={`View transit ${transit.transitNumber ?? "record"}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Full-width mobile cards */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 md:hidden">
        {data.map((transit, index) => {
          const serialNumber = (currentPage - 1) * pageLimit + index + 1;

          return (
            <article
              key={transit.id}
              role="button"
              tabIndex={0}
              aria-label={`Open transit ${transit.transitNumber ?? "record"}`}
              onClick={() => openDetails(transit)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openDetails(transit);
                }
              }}
              className="w-full min-w-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-800">
                    {serialNumber}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      S/N
                    </p>
                    <h3 className="mt-0.5 break-all text-sm font-bold text-slate-900">
                      {transit.transitNumber || "Transit record"}
                    </h3>
                    <p className="mt-1 break-words text-xs text-slate-500">
                      {transit.shipment?.shipmentNumber
                        ? `Shipment ${transit.shipment.shipmentNumber}`
                        : "No shipment number"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 gap-1 whitespace-nowrap">
                  <TransitModeIcon mode={transit.transportMode} />
                  {formatMode(transit.transportMode)}
                </Badge>
              </div>

              <div className="mt-4 grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Container
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {transit.container?.containerNumber || "—"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Transporter
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {transit.transporter || "—"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Origin
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-700">
                    {transit.origin || "—"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Destination
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-700">
                    {transit.destination || "—"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Quantity
                  </p>
                  <p className="mt-1 text-sm font-medium tabular-nums text-slate-800">
                    {formatNumber(transit.quantity)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Total Price
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900">
                    {formatNumber(transit.totalPrice)}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex min-w-0 items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-500">
                  Created {formatDate(transit.createdAt)}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700">
                  View details <Eye className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
