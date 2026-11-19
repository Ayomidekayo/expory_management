import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Truck,
  X,
  Link2,
  Unlink,
  Pencil,
} from "lucide-react";

import { useTransporters } from "../../hooks/transporter/useTransporters";

import type {
  Currency,
  Transporter,
  TransporterQuery,
  TransporterStatus,
} from "../../types/transporter";
import { useShipments } from "../../../../hooks/shipments/useShipments";

const PAGE_SIZE = 10;

function formatDate(value: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(amount: number, currency: Currency) {
  const value = amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (currency === "NGN") return `₦${value}`;
  if (currency === "USD") return `$${value}`;
  if (currency === "EUR") return `€${value}`;
  return `CFA ${value}`;
}

function getCharges(record: Transporter) {
  const totals = new Map<Currency, number>();
  record.items.forEach((item) => {
    totals.set(
      item.chargeCurrency,
      (totals.get(item.chargeCurrency) ?? 0) + Number(item.chargeAmount ?? 0),
    );
  });
  return Array.from(totals.entries());
}

function getItemLabel(record: Transporter) {
  const trucks = record.items.filter(
    (item) => item.itemType === "TRUCK",
  ).length;
  const containers = record.items.filter(
    (item) => item.itemType === "CONTAINER",
  ).length;
  const parts = [];
  if (trucks) parts.push(`${trucks} ${trucks === 1 ? "truck" : "trucks"}`);
  if (containers)
    parts.push(
      `${containers} ${containers === 1 ? "container" : "containers"}`,
    );
  return parts.length ? parts.join(" · ") : "No items";
}

function statusStyle(status: TransporterStatus) {
  const styles: Record<TransporterStatus, string> = {
    PENDING: "border-slate-200 bg-slate-50 text-slate-700",
    LOADING: "border-blue-200 bg-blue-50 text-blue-700",
    IN_TRANSIT: "border-indigo-200 bg-indigo-50 text-indigo-700",
    OFFLOADING: "border-amber-200 bg-amber-50 text-amber-800",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
  };
  return styles[status];
}

function StatusPill({ status }: { status: TransporterStatus }) {
  const labels: Record<TransporterStatus, string> = {
    PENDING: "Pending",
    LOADING: "Loading",
    IN_TRANSIT: "In transit",
    OFFLOADING: "Offloading",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle(status)}`}
    >
      {labels[status]}
    </span>
  );
}

function getStatusSummary(record: Transporter) {
  const counts = new Map<TransporterStatus, number>();
  record.items.forEach((item) =>
    counts.set(item.status, (counts.get(item.status) ?? 0) + 1),
  );
  return Array.from(counts.entries());
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Truck;
  tone: "blue" | "amber" | "green" | "violet";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
          <p className="mt-1.5 text-xs text-slate-500">{description}</p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500" />
    </div>
  );
}

export default function TransportersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | TransporterStatus>("ALL");
  const [itemType, setItemType] = useState<"ALL" | "TRUCK" | "CONTAINER">(
    "ALL",
  );
  const [shipmentId, setShipmentId] = useState("");
  const [sortBy, setSortBy] = useState<TransporterQuery["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const query: TransporterQuery = {
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: status === "ALL" ? undefined : status,
    itemType: itemType === "ALL" ? undefined : itemType,
    shipmentId: shipmentId || undefined,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isFetching, isError, refetch } =
    useTransporters(query);
  const records = data?.data ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const { data: shipmentResponse } = useShipments({ page: 1, limit: 100 });
  const shipments = shipmentResponse?.data ?? [];

  const stats = useMemo(
    () => ({
      items: records.reduce((sum, record) => sum + record.items.length, 0),
      linked: records.filter((record) => Boolean(record.shipmentId)).length,
      independent: records.filter((record) => !record.shipmentId).length,
    }),
    [records],
  );

  const hasFilters = Boolean(
    search || status !== "ALL" || itemType !== "ALL" || shipmentId,
  );

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setStatus("ALL");
    setItemType("ALL");
    setShipmentId("");
    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-3 py-5 sm:px-6 sm:py-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Operations
            management
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Transporters
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage truck owners, vehicle movements, offloading status and
            transporter charges.
          </p>
        </div>
        <button
          onClick={() => navigate("/transporters/new")}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Create Transporter
        </button>
      </header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          title="Transporter records"
          value={total.toLocaleString()}
          description="Total matching records"
          icon={Truck}
          tone="blue"
        />
        <StatCard
          title="Transporter items"
          value={stats.items.toLocaleString()}
          description="Items on the current page"
          icon={Package}
          tone="amber"
        />
        <StatCard
          title="Shipment linked"
          value={stats.linked}
          description="Current page connected to shipments"
          icon={Link2}
          tone="green"
        />
        <StatCard
          title="Independent"
          value={stats.independent}
          description="Current page not linked to shipments"
          icon={Unlink}
          tone="violet"
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transporter number, owner, truck plate or container..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${showFilters ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label
            className="text-xs font-medium text-slate-500"
            htmlFor="transporter-sort"
          >
            Sort by
          </label>
          <select
            id="transporter-sort"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value as TransporterQuery["sortBy"]);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="createdAt">Created date</option>
            <option value="transportDate">Transport date</option>
            <option value="transportNumber">Transporter number</option>
          </select>
          <select
            aria-label="Sort order"
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value as "asc" | "desc");
              setPage(1);
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-3.5 w-3.5" /> Reset filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label
                className="text-xs font-semibold text-slate-600"
                htmlFor="transporter-status"
              >
                Item operational status
              </label>
              <select
                id="transporter-status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as typeof status);
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="ALL">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="LOADING">Loading</option>
                <option value="IN_TRANSIT">In transit</option>
                <option value="OFFLOADING">Offloading</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label
                className="text-xs font-semibold text-slate-600"
                htmlFor="transporter-type"
              >
                Item type
              </label>
              <select
                id="transporter-type"
                value={itemType}
                onChange={(event) => {
                  setItemType(event.target.value as typeof itemType);
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="ALL">Trucks and containers</option>
                <option value="TRUCK">Trucks only</option>
                <option value="CONTAINER">Containers only</option>
              </select>
            </div>
            <div>
              <label
                className="text-xs font-semibold text-slate-600"
                htmlFor="transporter-shipment"
              >
                Shipment
              </label>
              <select
                id="transporter-shipment"
                value={shipmentId}
                onChange={(event) => {
                  setShipmentId(event.target.value);
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">All shipment associations</option>
                {shipments.map(
                  (shipment: { id: string; shipmentNumber?: string }) => (
                    <option key={shipment.id} value={shipment.id}>
                      {shipment.shipmentNumber ?? shipment.id}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        )}
      </section>

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">
            Unable to load transporter records.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex min-h-64 items-center justify-center gap-2 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-700" />
          <span className="text-sm">Loading transporter records...</span>
        </div>
      )}

      {!isLoading && !isError && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-semibold text-slate-900">
                Transporter records
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Select a record to view its vehicles, operational progress and
                payments.
              </p>
            </div>
            <p className="text-xs font-medium text-slate-500">
              {total === 0
                ? "No records"
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total.toLocaleString()}`}
            </p>
          </div>

          {records.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No transporter records found
              </h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Create a transporter record or change your search and filters.
              </p>
              <button
                onClick={() => navigate("/transporters/new")}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800"
              >
                <Plus className="h-4 w-4" /> Create transporter
              </button>
            </div>
          ) : (
            <>
              {/* Desktop and large tablet table */}
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px] text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-4">S/N</th>
                        <th className="px-4 py-4">Transporter No.</th>
                        <th className="px-4 py-4">Truck owner</th>
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Shipment</th>
                        <th className="px-4 py-4">Items</th>
                        <th className="px-4 py-4">Total charges</th>
                        <th className="px-4 py-4">Operational status</th>
                        <th className="px-4 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map((record, index) => (
                        <tr
                          key={record.id}
                          onClick={() => navigate(`/transporters/${record.id}`)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter")
                              navigate(`/transporters/${record.id}`);
                          }}
                          tabIndex={0}
                          className="cursor-pointer transition hover:bg-emerald-50/50 focus:bg-emerald-50 focus:outline-none"
                        >
                          <td className="px-4 py-4 text-xs text-slate-500">
                            {(page - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-semibold text-emerald-700">
                              {record.transportNumber}
                            </span>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {record.isLocked
                                ? "Locked record"
                                : "Active record"}
                            </p>
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-800">
                            {record.truckOwnerName}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                            {formatDate(record.transportDate)}
                          </td>
                          <td className="px-4 py-4">
                            {record.shipment?.shipmentNumber ? (
                              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                {record.shipment.shipmentNumber}
                              </span>
                            ) : (
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                                Independent
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-800">
                              {record.items.length} items
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {getItemLabel(record)}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              {getCharges(record).map(([currency, amount]) => (
                                <p
                                  key={currency}
                                  className="whitespace-nowrap text-xs font-semibold text-slate-700"
                                >
                                  {formatMoney(amount, currency)}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex max-w-[230px] flex-wrap gap-1">
                              {getStatusSummary(record)
                                .slice(0, 2)
                                .map(([itemStatus, count]) => (
                                  <span
                                    key={itemStatus}
                                    className="inline-flex items-center gap-1"
                                  >
                                    <StatusPill status={itemStatus} />
                                    <span className="text-[11px] text-slate-500">
                                      ×{count}
                                    </span>
                                  </span>
                                ))}
                              {getStatusSummary(record).length > 2 && (
                                <span className="text-xs text-slate-500">
                                  +{getStatusSummary(record).length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td
                            className="px-4 py-4"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() =>
                                  navigate(`/transporters/${record.id}`)
                                }
                                aria-label="View transporter"
                                title="View"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/transporters/${record.id}/edit`)
                                }
                                disabled={record.isLocked}
                                aria-label="Edit transporter"
                                title="Edit"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile and tablet cards */}
              <div className="grid gap-3 lg:hidden">
                {records.map((record, index) => (
                  <article
                    key={record.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/transporters/${record.id}`)}
                      className="block w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Record {(page - 1) * PAGE_SIZE + index + 1}
                          </p>
                          <h3 className="mt-1 break-all text-base font-bold text-emerald-700">
                            {record.transportNumber}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {record.truckOwnerName}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${record.isLocked ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
                        >
                          {record.isLocked ? "Locked" : "Active"}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3 text-sm">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Transport date
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 font-medium text-slate-700">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(record.transportDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Shipment
                          </p>
                          <p className="mt-1 break-words font-medium text-slate-700">
                            {record.shipment?.shipmentNumber ?? "Independent"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Items
                          </p>
                          <p className="mt-1 font-medium text-slate-700">
                            {record.items.length} · {getItemLabel(record)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Charges
                          </p>
                          <div className="mt-1 space-y-0.5">
                            {getCharges(record).length ? (
                              getCharges(record).map(([currency, amount]) => (
                                <p
                                  key={currency}
                                  className="font-semibold text-slate-800"
                                >
                                  {formatMoney(amount, currency)}
                                </p>
                              ))
                            ) : (
                              <p className="font-medium text-slate-500">—</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 border-t border-slate-100 pt-3">
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Item progress
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {getStatusSummary(record).map(
                            ([itemStatus, count]) => (
                              <span
                                key={itemStatus}
                                className="inline-flex items-center gap-1.5"
                              >
                                <StatusPill status={itemStatus} />
                                <span className="text-xs text-slate-500">
                                  ×{count}
                                </span>
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </button>
                    <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/transporters/${record.id}`)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" /> View details
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/transporters/${record.id}/edit`)
                        }
                        disabled={record.isLocked}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* ===========================================
    PAGINATION
=========================================== */}

      {/* ===========================================
    PAGINATION
=========================================== */}

{total > 0 && (
  <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">

    <div>
      <p className="text-sm font-semibold text-slate-700">
        Page {page} of {totalPages}
      </p>

      <p className="mt-0.5 text-xs text-slate-500">
        Showing {(page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, total)} of{" "}
        {total.toLocaleString()} transporter records
      </p>
    </div>

    <div className="flex gap-2">

      {/* PREVIOUS */}
      <button
        type="button"
        disabled={page <= 1 || isFetching}
        onClick={() =>
          setPage((current) => Math.max(1, current - 1))
        }
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {/* NEXT */}
      <button
        type="button"
        disabled={page >= totalPages || isFetching}
        onClick={() =>
          setPage((current) =>
            Math.min(totalPages, current + 1)
          )
        }
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>

    </div>
  </div>
)}
        </section>
      )}
    </div>
  );
}
