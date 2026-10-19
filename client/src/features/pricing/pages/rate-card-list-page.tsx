import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useRateCards } from "../hooks/use-rate-cards";
import type {
  QuoteDirection,
  QuoteMode,
  RateCard,
  RateCardStatus,
} from "../types/pricing.types";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const statusStyles: Record<RateCardStatus, string> = {
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-200",
};

function StatusBadge({ status }: { status: RateCardStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "No end date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ModeBadge({ mode }: { mode: QuoteMode }) {
  const labels: Record<QuoteMode, string> = {
    AIR: "Air Freight",
    LAND: "Land Transport",
    SEA: "Sea Freight",
  };

  return (
    <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
      {labels[mode]}
    </span>
  );
}

function DirectionBadge({
  direction,
}: {
  direction: QuoteDirection;
}) {
  return (
    <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
      {direction === "IMPORT" ? "Import" : "Export"}
    </span>
  );
}

function RateCardRow({ rateCard }: { rateCard: RateCard }) {
  const configurationCount = rateCard.configurations?.length ?? 0;
  const componentCount = rateCard.components?.length ?? 0;

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">
      <td className="px-5 py-5">
        <Link
          to={`/pricing/rate-cards/${rateCard.id}`}
          className="font-semibold text-slate-900 hover:text-blue-700"
        >
          {rateCard.name}
        </Link>

        <p className="mt-1 text-xs text-slate-500">
          Updated {formatDate(rateCard.updatedAt)}
        </p>
      </td>

      <td className="px-5 py-5">
        <ModeBadge mode={rateCard.mode} />
      </td>

      <td className="px-5 py-5">
        <DirectionBadge direction={rateCard.direction} />
      </td>

      <td className="px-5 py-5">
        <StatusBadge status={rateCard.status} />
      </td>

      <td className="px-5 py-5">
        <div className="font-medium text-slate-900">
          {rateCard.currency}
        </div>

        <p className="mt-1 text-xs text-slate-500">
          {configurationCount} configuration
          {configurationCount === 1 ? "" : "s"}
        </p>
      </td>

      <td className="px-5 py-5">
        <div className="text-sm text-slate-700">
          {formatDate(rateCard.effectiveFrom)}
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Until {formatDate(rateCard.effectiveTo)}
        </p>
      </td>

      <td className="px-5 py-5 text-right">
        <Link
          to={`/pricing/rate-cards/${rateCard.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          Manage
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </Link>

        <span className="sr-only">
          {componentCount} configured charges
        </span>
      </td>
    </tr>
  );
}

export default function RateCardListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useRateCards();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    RateCardStatus | "ALL"
  >("ALL");
  const [modeFilter, setModeFilter] = useState<QuoteMode | "ALL">(
    "ALL",
  );
  const [directionFilter, setDirectionFilter] = useState<
    QuoteDirection | "ALL"
  >("ALL");

  const rateCards = useMemo(() => {
    const cards = data ?? [];
    const searchTerm = search.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesSearch =
        !searchTerm ||
        card.name.toLowerCase().includes(searchTerm) ||
        card.currency.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || card.status === statusFilter;

      const matchesMode =
        modeFilter === "ALL" || card.mode === modeFilter;

      const matchesDirection =
        directionFilter === "ALL" ||
        card.direction === directionFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMode &&
        matchesDirection
      );
    });
  }, [data, search, statusFilter, modeFilter, directionFilter]);

  const cards = data ?? [];

  const summary = {
    total: cards.length,
    active: cards.filter((card) => card.status === "ACTIVE").length,
    draft: cards.filter((card) => card.status === "DRAFT").length,
    archived: cards.filter((card) => card.status === "ARCHIVED")
      .length,
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Pricing Management
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Rate Cards
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage import and export pricing for air, land, and sea
              transportation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/pricing/rate-cards/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <span className="text-lg leading-none">+</span>
            Create Rate Card
          </button>
        </header>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total rate cards",
              value: summary.total,
              description: "All pricing cards",
            },
            {
              label: "Active",
              value: summary.active,
              description: "Available for pricing",
            },
            {
              label: "Drafts",
              value: summary.draft,
              description: "Still being configured",
            },
            {
              label: "Archived",
              value: summary.archived,
              description: "No longer in use",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {item.label}
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {isLoading ? "—" : item.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-bold text-slate-900">
                  All pricing cards
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {rateCards.length} result
                  {rateCards.length === 1 ? "" : "s"} found
                </p>
              </div>

              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="self-start rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 lg:self-auto"
              >
                {isFetching ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="rate-card-search"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Search
                </label>

                <input
                  id="rate-card-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or currency..."
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="rate-card-status"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Status
                </label>

                <select
                  id="rate-card-status"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as RateCardStatus | "ALL",
                    )
                  }
                  className={inputClassName}
                >
                  <option value="ALL">All statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rate-card-mode"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Transport mode
                </label>

                <select
                  id="rate-card-mode"
                  value={modeFilter}
                  onChange={(event) =>
                    setModeFilter(
                      event.target.value as QuoteMode | "ALL",
                    )
                  }
                  className={inputClassName}
                >
                  <option value="ALL">All modes</option>
                  <option value="AIR">Air</option>
                  <option value="LAND">Land</option>
                  <option value="SEA">Sea</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rate-card-direction"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Direction
                </label>

                <select
                  id="rate-card-direction"
                  value={directionFilter}
                  onChange={(event) =>
                    setDirectionFilter(
                      event.target.value as QuoteDirection | "ALL",
                    )
                  }
                  className={inputClassName}
                >
                  <option value="ALL">Both directions</option>
                  <option value="IMPORT">Import</option>
                  <option value="EXPORT">Export</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <h3 className="font-semibold text-slate-900">
                Unable to load rate cards
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>

              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Try again
              </button>
            </div>
          ) : rateCards.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
                $
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                {cards.length === 0
                  ? "No rate cards yet"
                  : "No matching rate cards"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {cards.length === 0
                  ? "Create your first rate card to begin configuring charges, routes, and weight-based pricing."
                  : "Try changing your search or filters."}
              </p>

              {cards.length === 0 && (
                <button
                  type="button"
                  onClick={() => navigate("/pricing/rate-cards/new")}
                  className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Create your first rate card
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Rate card
                    </th>
                    <th className="px-5 py-4 font-semibold">Mode</th>
                    <th className="px-5 py-4 font-semibold">
                      Direction
                    </th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">
                      Currency / Configurations
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Effective period
                    </th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rateCards.map((rateCard) => (
                    <RateCardRow
                      key={rateCard.id}
                      rateCard={rateCard}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}