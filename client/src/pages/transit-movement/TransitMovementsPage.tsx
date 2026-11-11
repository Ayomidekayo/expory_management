
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Lock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
  useTransitMovements,
  useDeleteTransitMovement,
} from "../../hooks/transit-movement/useTransitMovements";

import type {
  TransitMovement,
  TransitMovementQuery,
  Currency,
} from "../../types/transit-movement";

const PAGE_SIZE = 10;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(
  amount: number | string,
  currency: Currency,
) {
  const value = Number(amount);

  return `${currency} ${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getMovementCharges(movement: TransitMovement) {
  const totals = new Map<Currency, number>();

  movement.items.forEach((item) => {
    const currency = item.chargeCurrency;
    const amount = Number(item.chargeAmount);

    totals.set(
      currency,
      (totals.get(currency) ?? 0) + amount,
    );
  });

  return Array.from(totals.entries());
}

function getDirectionStyle(direction: "IN" | "OUT") {
  return direction === "IN"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-orange-50 text-orange-700 border-orange-200";
}

function getPaymentStatusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "border border-green-200 bg-green-50 text-green-700";
    case "PARTIALLY_PAID":
      return "border border-blue-200 bg-blue-50 text-blue-700";
    case "ADVANCE":
      return "border border-amber-200 bg-amber-50 text-amber-700";
    case "UNPAID":
    default:
      return "border border-red-200 bg-red-50 text-red-700";
  }
}

function getPaymentStatusLabel(status: string) {
  switch (status) {
    case "PAID":
      return "Paid";
    case "PARTIALLY_PAID":
      return "Partially Paid";
    case "ADVANCE":
      return "Advance";
    case "UNPAID":
    default:
      return "Unpaid";
  }
}

export default function TransitMovementsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [direction, setDirection] = useState<
    "ALL" | "IN" | "OUT"
  >("ALL");

  const [clientName, setClientName] = useState("");
  const [shipmentId, setShipmentId] = useState("");

  const [association, setAssociation] = useState<
    "ALL" | "LINKED" | "INDEPENDENT"
  >("ALL");

  const [isLocked, setIsLocked] = useState<
    "ALL" | "true" | "false"
  >("ALL");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [movementToDelete, setMovementToDelete] =
    useState<TransitMovement | null>(null);

  // Debounce general search to avoid requesting on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const query: TransitMovementQuery = {
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    direction: direction === "ALL" ? undefined : direction,
    clientName: clientName.trim() || undefined,
    shipmentId: shipmentId.trim() || undefined,
    association: association === "ALL" ? undefined : association,
    isLocked: isLocked === "ALL" ? undefined : isLocked,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTransitMovements(query);

  const deleteMutation = useDeleteTransitMovement();

  const movements = data?.data ?? [];
  const pagination = data?.pagination;

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;

  // These figures describe the currently loaded page,
  // not the entire database.
  const pageStats = {
    total: movements.length,
    incoming: movements.filter(
      (movement) => movement.direction === "IN",
    ).length,
    outgoing: movements.filter(
      (movement) => movement.direction === "OUT",
    ).length,
    locked: movements.filter(
      (movement) => movement.isLocked,
    ).length,
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setDirection("ALL");
    setClientName("");
    setShipmentId("");
    setAssociation("ALL");
    setIsLocked("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    direction !== "ALL" ||
    Boolean(clientName) ||
    Boolean(shipmentId) ||
    association !== "ALL" ||
    isLocked !== "ALL" ||
    Boolean(fromDate) ||
    Boolean(toDate);

  const handleDelete = async () => {
    if (!movementToDelete) return;

    try {
      await deleteMutation.mutateAsync(movementToDelete.id);

      toast.success("Transit movement deleted successfully");

      setMovementToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete transit movement",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Transit Movements
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage incoming and outgoing transit records.
          </p>
        </div>

        <Button
          onClick={() => navigate("/transit-movements/new")}
          className="bg-green-700 hover:bg-green-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Movement
        </Button>
      </div>

      {/* PAGE STATISTICS */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">
            Records on this page
          </p>
          <p className="mt-2 text-2xl font-bold">
            {pageStats.total}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <ArrowDownToLine className="h-4 w-4" />
            <p className="text-xs font-medium">Transit IN</p>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {pageStats.incoming}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-orange-700">
            <ArrowUpFromLine className="h-4 w-4" />
            <p className="text-xs font-medium">Transit OUT</p>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {pageStats.outgoing}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700">
            <Lock className="h-4 w-4" />
            <p className="text-xs font-medium">Locked</p>
          </div>
          <p className="mt-2 text-2xl font-bold">
            {pageStats.locked}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        The four figures above describe the current page. Total matching records: {total.toLocaleString()}.
      </p>

      {/* SEARCH AND FILTERS */}
      <section className="space-y-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transit number, shipment, truck or container..."
              className="pl-9"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters((current) => !current)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        {showFilters && (
          <div className="grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="space-y-2">
              <Label>Direction</Label>
              <select
                value={direction}
                onChange={(event) => {
                  setDirection(event.target.value as typeof direction);
                  setPage(1);
                }}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="ALL">All directions</option>
                <option value="IN">Transit IN</option>
                <option value="OUT">Transit OUT</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Client name</Label>
              <Input
                value={clientName}
                onChange={(event) => {
                  setClientName(event.target.value);
                  setPage(1);
                }}
                placeholder="Filter by client"
              />
            </div>

            <div className="space-y-2">
              <Label>Shipment ID</Label>
              <Input
                value={shipmentId}
                onChange={(event) => {
                  setShipmentId(event.target.value);
                  setPage(1);
                }}
                placeholder="Enter shipment ID"
              />
            </div>

            <div className="space-y-2">
              <Label>Shipment association</Label>
              <select
                value={association}
                onChange={(event) => {
                  setAssociation(
                    event.target.value as typeof association,
                  );
                  setPage(1);
                }}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="ALL">All movements</option>
                <option value="LINKED">Linked to shipment</option>
                <option value="INDEPENDENT">Independent</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Lock status</Label>
              <select
                value={isLocked}
                onChange={(event) => {
                  setIsLocked(
                    event.target.value as typeof isLocked,
                  );
                  setPage(1);
                }}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="ALL">All statuses</option>
                <option value="true">Locked</option>
                <option value="false">Unlocked</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>From date</Label>
              <Input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>To date</Label>
              <Input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => {
                  setToDate(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex justify-end border-t pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          </div>
        )}
      </section>

      {/* ERROR STATE */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            Unable to load transit movements.
          </p>

          <Button
            variant="outline"
            className="mt-3"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex min-h-64 items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-green-700" />
          <span className="text-sm text-muted-foreground">
            Loading transit movements...
          </span>
        </div>
      )}

      {/* MOVEMENTS LIST */}
      {!isLoading && !isError && (
        <section className="space-y-4">

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-gray-900">
              Movement Records
            </h2>

            <p className="text-sm text-muted-foreground">
              {total === 0
                ? "No records"
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                    page * PAGE_SIZE,
                    total,
                  )} of ${total}`}
            </p>
          </div>

          {movements.length === 0 ? (
            <div className="rounded-xl border bg-white px-4 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <ArrowDownToLine className="h-6 w-6 text-green-700" />
              </div>

              <h3 className="mt-4 font-semibold">
                No transit movements found
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a movement or adjust your search filters.
              </p>

              <Button
                className="mt-5 bg-green-700 hover:bg-green-800"
                onClick={() => navigate("/transit-movements/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Movement
              </Button>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm lg:block">
                <table className="w-full min-w-[1200px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-4">S/N</th>
                      <th className="px-4 py-4">Transit Number</th>
                      <th className="px-4 py-4">Direction</th>
                      <th className="px-4 py-4">Date</th>
                      <th className="px-4 py-4">Shipment / Client</th>
                      <th className="px-4 py-4">Items</th>
                      <th className="px-4 py-4">Total Charges</th>
                      <th className="px-4 py-4">Payment Status</th>
                      <th className="px-4 py-4">Record Status</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {movements.map((movement, index) => (
                      <tr
                        key={movement.id}
                        onClick={() => navigate(`/transit-movements/${movement.id}`)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            navigate(`/transit-movements/${movement.id}`);
                          }
                        }}
                        tabIndex={0}
                        role="link"
                        aria-label={`View transit movement ${movement.transitNumber}`}
                        className="cursor-pointer transition-colors hover:bg-emerald-50/60 focus:bg-emerald-50 focus:outline-none"
                      >
                        <td className="px-4 py-4 font-semibold text-gray-500">
                          {(page - 1) * PAGE_SIZE + index + 1}
                        </td>

                        <td className="px-4 py-4 font-semibold text-green-700">
                          {movement.transitNumber}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${getDirectionStyle(
                              movement.direction,
                            )}`}
                          >
                            {movement.direction === "IN" ? "Transit IN" : "Transit OUT"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {formatDate(movement.transitDate)}
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium text-gray-900">
                            {movement.shipment?.shipmentNumber ?? "Independent"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {movement.shipment?.client?.companyName ?? "No linked client"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="font-semibold">
                            {movement._count?.items ?? movement.items.length}
                          </span>
                          <span className="ml-1 text-xs text-muted-foreground">items</span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {getMovementCharges(movement).map(([currency, amount]) => (
                              <p
                                key={currency}
                                className="whitespace-nowrap text-xs font-semibold text-gray-900"
                              >
                                {formatMoney(amount, currency)}
                              </p>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="min-w-[130px] space-y-2">
                            {movement.items.length > 0 ? (
                              movement.items.map((item) => (
                                <div key={item.id} className="flex flex-col items-start gap-1">
                                  <span className="max-w-[140px] truncate text-xs text-gray-500">
                                    {item.name || item.itemType}
                                  </span>
                                  <span
                                    className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${getPaymentStatusStyle(
                                      item.paymentStatus,
                                    )}`}
                                  >
                                    {getPaymentStatusLabel(item.paymentStatus)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No items</span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {movement.isLocked ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                              <Lock className="h-3 w-3" />
                              Locked
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="View movement"
                              aria-label="View movement"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/transit-movements/${movement.id}`);
                              }}
                            >
                              <Eye className="h-4 w-4 text-emerald-700" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Edit movement"
                              aria-label="Edit movement"
                              disabled={movement.isLocked}
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/transit-movements/${movement.id}/edit`);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Delete movement"
                              aria-label="Delete movement"
                              disabled={movement.isLocked}
                              onClick={(event) => {
                                event.stopPropagation();
                                setMovementToDelete(movement);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE AND TABLET CARDS */}
              <div className="grid gap-3 lg:hidden">
                {movements.map((movement, index) => (
                  <div
                    key={movement.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/transit-movements/${movement.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/transit-movements/${movement.id}`);
                      }
                    }}
                    aria-label={`View transit movement ${movement.transitNumber}`}
                    className="cursor-pointer space-y-4 rounded-xl border bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        S/N: {(page - 1) * PAGE_SIZE + index + 1}
                      </span>
                      <span className={`rounded-full border px-2 py-1 text-xs font-medium ${getDirectionStyle(movement.direction)}`}>
                        {movement.direction}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <button
                          type="button"
                          className="break-all text-left font-semibold text-green-700"
                          onClick={() =>
                            navigate(`/transit-movements/${movement.id}`)
                          }
                        >
                          {movement.transitNumber}
                        </button>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(movement.transitDate)}
                        </p>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Shipment
                        </p>
                        <p className="mt-1 break-words font-medium">
                          {movement.shipment?.shipmentNumber ?? "Independent"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Client
                        </p>
                        <p className="mt-1 break-words font-medium">
                          {movement.shipment?.client?.companyName ?? "Not linked"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Items
                        </p>
                        <p className="mt-1 font-medium">
                          {movement._count?.items ?? movement.items.length}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Record status
                        </p>
                        <p className="mt-1 font-medium">
                          {movement.isLocked ? "Locked" : "Active"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 border-t pt-3">
                      <p className="text-xs text-muted-foreground">
                        Total charges
                      </p>

                      {getMovementCharges(movement).map(
                        ([currency, amount]) => (
                          <p
                            key={currency}
                            className="text-sm font-semibold"
                          >
                            {formatMoney(amount, currency)}
                          </p>
                        ),
                      )}
                    </div>

                    <div className="space-y-2 border-t pt-3">
                      <p className="text-xs font-semibold text-gray-500">
                        ITEM PAYMENT STATUS
                      </p>

                      {movement.items.length > 0 ? (
                        movement.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="min-w-0 truncate text-sm text-gray-700">
                              {item.name || item.itemType}
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getPaymentStatusStyle(
                                item.paymentStatus,
                              )}`}
                            >
                              {getPaymentStatusLabel(item.paymentStatus)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400">No items</p>
                      )}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/transit-movements/${movement.id}`);
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={movement.isLocked}
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/transit-movements/${movement.id}/edit`);
                        }}
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={movement.isLocked}
                        onClick={(event) => {
                          event.stopPropagation();
                          setMovementToDelete(movement);
                        }}
                      >
                        <Trash2 className="mr-1 h-4 w-4 text-red-600" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PAGINATION */}
          <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page{" "}
              <span className="font-semibold text-gray-900">{page}</span>
              {" "}of{" "}
              <span className="font-semibold text-gray-900">
                {Math.max(totalPages, 1)}
              </span>
              <span className="mx-2">·</span>
              <span className="font-semibold text-gray-900">
                {total.toLocaleString()}
              </span>{" "}
              total records
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={totalPages === 0 || page >= totalPages || isFetching}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {movementToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleteMutation.isPending) {
              setMovementToDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-movement-title"
            className="w-full max-w-md space-y-5 rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2
                id="delete-movement-title"
                className="text-lg font-semibold"
              >
                Delete Transit Movement?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Are you sure you want to delete{" "}
                <strong className="text-gray-900">
                  {movementToDelete.transitNumber}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                disabled={deleteMutation.isPending}
                onClick={() => setMovementToDelete(null)}
              >
                Cancel
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Movement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
