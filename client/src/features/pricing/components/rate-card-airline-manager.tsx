
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpDown,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  LoaderCircle,
  Plane,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  useCreateRateCardAirline,
  useRateCardAirlines,
  useUpdateRateCardAirline,
} from "../hooks/use-rate-card-airlines";
import type { RateCardAirline } from "../api/rate-card-airline.api";



interface Props {
  rateCardId: string;
  configurationId: string;
  currency: string;
  canEdit: boolean;
}

type AirlineStatus = "ALL" | "ACTIVE" | "INACTIVE";

const formatMoney = (value: string | number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value));
  } catch {
    return `${currency} ${Number(value).toLocaleString("en-NG")}`;
  }
};

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:cursor-not-allowed disabled:bg-slate-50";

export default function RateCardAirlineManager({
  rateCardId,
  configurationId,
  currency,
  canEdit,
}: Props) {
  const {
    data: airlines = [],
    isLoading,
    isError,
    refetch,
  } = useRateCardAirlines(rateCardId, configurationId, false);

  const createAirline = useCreateRateCardAirline(rateCardId);

  const [editingAirline, setEditingAirline] =
    useState<RateCardAirline | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AirlineStatus>("ALL");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [ratePerKg, setRatePerKg] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateAirline = useUpdateRateCardAirline(
    rateCardId,
    configurationId,
    editingAirline?.id ?? "",
  );

  const activeCount = airlines.filter((item) => item.isActive).length;
  const inactiveCount = airlines.length - activeCount;

  const filteredAirlines = useMemo(() => {
    const query = search.trim().toLowerCase();

    return airlines.filter((airline) => {
      const matchesSearch =
        !query ||
        airline.name.toLowerCase().includes(query) ||
        airline.code.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && airline.isActive) ||
        (statusFilter === "INACTIVE" && !airline.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [airlines, search, statusFilter]);

  const resetForm = () => {
    setEditingAirline(null);
    setShowForm(false);
    setCode("");
    setName("");
    setRatePerKg("");
    setDisplayOrder("0");
    setIsActive(true);
    setErrorMessage("");
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
    setSuccessMessage("");
  };

  const startEditing = (airline: RateCardAirline) => {
    setEditingAirline(airline);
    setCode(airline.code);
    setName(airline.name);
    setRatePerKg(String(airline.ratePerKg));
    setDisplayOrder(String(airline.displayOrder));
    setIsActive(airline.isActive);
    setShowForm(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const normalizedCode = code.trim().toUpperCase();
    const normalizedName = name.trim();
    const rate = Number(ratePerKg);
    const order = Number(displayOrder);

    if (!normalizedCode || !normalizedName) {
      setErrorMessage("Enter an airline code and name.");
      return;
    }

    if (!Number.isFinite(rate) || rate <= 0) {
      setErrorMessage("The rate per kilogram must be greater than zero.");
      return;
    }

    if (!Number.isInteger(order) || order < 0) {
      setErrorMessage("Display order must be a non-negative whole number.");
      return;
    }

    try {
      if (editingAirline) {
        await updateAirline.mutateAsync({
          code: normalizedCode,
          name: normalizedName,
          ratePerKg: rate,
          displayOrder: order,
          isActive,
        });

        setSuccessMessage("Airline changes saved successfully.");
      } else {
        await createAirline.mutateAsync({
          configurationId,
          code: normalizedCode,
          name: normalizedName,
          ratePerKg: rate,
          displayOrder: order,
          isActive,
        });

        setSuccessMessage("Airline added successfully.");
      }

      resetForm();
      await refetch();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save the airline. Please try again.",
      );
    }
  };

  const saving = createAirline.isPending || updateAirline.isPending;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <CircleAlert className="mx-auto h-9 w-9 text-red-500" />
        <h3 className="mt-3 font-semibold text-slate-900">
          Unable to load airline rates
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Check your connection and permissions, then try again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page introduction */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
            <Plane size={16} />
            Air freight pricing
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Airline rate management
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Manage airline freight rates for this configuration. Rates are
            applied per kilogram when an exporter selects an airline.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => (showForm ? resetForm() : startCreate())}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
          >
            {showForm ? <X size={17} /> : <Plus size={17} />}
            {showForm ? "Close form" : "Add airline"}
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total airlines
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Plane size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {airlines.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Configured for this rate card
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Active airlines
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Check size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {activeCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Available for selection when pricing is active
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Inactive airlines
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Clock3 size={18} />
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {inactiveCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Retained for administration
          </p>
        </div>
      </div>

      {/* Feedback */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
          <button
            type="button"
            aria-label="Dismiss success message"
            onClick={() => setSuccessMessage("")}
            className="ml-auto"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add/edit form */}
      {showForm && canEdit && (
        <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-slate-100 bg-amber-50/60 px-5 py-4 sm:px-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm ring-1 ring-amber-200">
              <Plane size={19} />
            </span>
            <div>
              <h3 className="font-semibold text-slate-950">
                {editingAirline ? "Edit airline details" : "Add a new airline"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Set the airline identity, freight rate, and availability.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Airline name">
                <input
                  className={inputClass}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Example Airways"
                  maxLength={150}
                  autoComplete="organization"
                  required
                />
              </Field>

              <Field
                label="Airline code"
                hint="A unique code within this configuration."
              >
                <input
                  className={inputClass}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="e.g. EXAMPLE_AIR"
                  maxLength={50}
                  required
                />
              </Field>

              <Field
                label={`Freight rate per kilogram (${currency})`}
                hint="Applied to the shipment's entered weight."
              >
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-slate-400">
                    {currency}
                  </span>
                  <input
                    className={`${inputClass} pl-16`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={ratePerKg}
                    onChange={(event) => setRatePerKg(event.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </Field>

              <Field
                label="Display order"
                hint="Lower numbers appear first in the selector."
              >
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="1"
                  value={displayOrder}
                  onChange={(event) => setDisplayOrder(event.target.value)}
                  required
                />
              </Field>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-amber-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  Make airline available
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Active airlines can appear in the exporter calculator when
                  this configuration and rate card are eligible.
                </span>
              </span>
            </label>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !canEdit}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {saving
                  ? "Saving changes..."
                  : editingAirline
                    ? "Save airline"
                    : "Create airline"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Airline table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">
                Configured airlines
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {filteredAirlines.length} of {airlines.length} airlines
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by airline name or code..."
                aria-label="Search airlines"
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="relative md:w-48">
              <Activity
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as AirlineStatus)
                }
                aria-label="Filter by airline status"
                className={`${inputClass} appearance-none pl-9 pr-9`}
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active only</option>
                <option value="INACTIVE">Inactive only</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {airlines.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <Plane size={25} />
            </span>
            <h3 className="mt-4 font-semibold text-slate-950">
              No airlines configured yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add airline rates to let exporters select an airline and
              calculate freight using the configured rate per kilogram.
            </p>
            {canEdit && (
              <button
                type="button"
                onClick={startCreate}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Plus size={16} />
                Add your first airline
              </button>
            )}
          </div>
        ) : filteredAirlines.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Search className="mx-auto h-7 w-7 text-slate-400" />
            <h3 className="mt-3 font-semibold text-slate-900">
              No matching airlines
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or status filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="mt-3 text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Airline</th>
                    <th className="px-5 py-4 font-semibold">Freight rate</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <ArrowUpDown size={13} />
                        Display order
                      </span>
                    </th>
                    {canEdit && (
                      <th className="px-5 py-4 text-right font-semibold">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAirlines.map((airline) => (
                    <tr
                      key={airline.id}
                      className="transition hover:bg-amber-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                            <Plane size={18} />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {airline.name}
                            </p>
                            <p className="mt-1 text-xs tracking-wide text-slate-500">
                              {airline.code}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold tabular-nums text-slate-950">
                          {formatMoney(airline.ratePerKg, currency)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">per kg</p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge active={airline.isActive} />
                      </td>

                      <td className="px-5 py-4 tabular-nums text-slate-600">
                        {airline.displayOrder}
                      </td>

                      {canEdit && (
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => startEditing(airline)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                          >
                            Edit details
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Responsive cards for mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredAirlines.map((airline) => (
                <article key={airline.id} className="space-y-4 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                      <Plane size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-semibold text-slate-950">
                        {airline.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Code: {airline.code}
                      </p>
                    </div>
                    <StatusBadge active={airline.isActive} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="text-xs text-slate-500">Rate per kg</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                        {formatMoney(airline.ratePerKg, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Display order</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {airline.displayOrder}
                      </p>
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => startEditing(airline)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit airline
                    </button>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {!canEdit && (
        <p className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          This rate card is not in draft status. Airline rates are read-only
          until the pricing configuration can be edited again.
        </p>
      )}
    </div>
  );
}
