
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  FileText,
  Plane,
  Truck,
  Ship,
  ChevronRight,
  CalendarDays,
  Filter,
  AlertCircle,
  CheckCircle2,
  Archive,
  Layers3,
  ArrowUpRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useRateCards } from "../hooks/use-rate-cards";
import type {
  RateCard,
  QuoteMode,
  QuoteDirection,
  RateCardStatus,
} from "../types/pricing.types";

type ModeFilter = "ALL" | QuoteMode;
type DirectionFilter = "ALL" | QuoteDirection;
type StatusFilter = "ALL" | RateCardStatus;

const modeIcons = {
  AIR: Plane,
  LAND: Truck,
  SEA: Ship,
};

const modeStyles: Record<QuoteMode, string> = {
  AIR: "bg-sky-50 text-sky-700 ring-sky-200",
  LAND: "bg-orange-50 text-orange-700 ring-orange-200",
  SEA: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const statusStyles: Record<RateCardStatus, string> = {
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-200",
};

function formatDate(value?: string | null) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status: RateCardStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function ModeBadge({ mode }: { mode: QuoteMode }) {
  const Icon = modeIcons[mode];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${modeStyles[mode]}`}
    >
      <Icon size={14} />
      {mode.charAt(0) + mode.slice(1).toLowerCase()}
    </span>
  );
}

function DirectionBadge({ direction }: { direction: QuoteDirection }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-100">
      {direction.charAt(0) + direction.slice(1).toLowerCase()}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: typeof FileText;
  accent: "green" | "amber" | "slate";
}) {
  const styles = {
    green: {
      icon: "bg-emerald-50 text-emerald-700",
      line: "bg-emerald-500",
      value: "text-emerald-800",
    },
    amber: {
      icon: "bg-amber-50 text-amber-700",
      line: "bg-amber-400",
      value: "text-amber-800",
    },
    slate: {
      icon: "bg-slate-100 text-slate-600",
      line: "bg-slate-300",
      value: "text-slate-800",
    },
  }[accent];

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className={`absolute inset-x-0 top-0 h-1 ${styles.line}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">
            {label}
          </p>
          <p
            className={`mt-3 text-3xl font-bold tracking-tight ${styles.value}`}
          >
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}

function RateCardMobile({ card }: { card: RateCard }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-emerald-200 hover:shadow-md">
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-100" />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <FileText size={21} />
            </div>

            <div className="min-w-0">
              <h3 className="break-words font-bold leading-5 text-slate-900">
                {card.name}
              </h3>
              <p className="mt-1.5 text-xs font-medium text-slate-500">
                Currency: {card.currency}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                ID: {card.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <StatusBadge status={card.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <ModeBadge mode={card.mode} />
          <DirectionBadge direction={card.direction} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <CalendarDays size={13} />
              Effective from
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-800">
              {formatDate(card.effectiveFrom)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <Layers3 size={13} />
              Configurations
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-800">
              {card.configurations?.length ?? 0}
            </p>
          </div>
        </div>

        <Link
          to={`/quotations/rate-cards/${card.id}`}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
        >
          Manage rate card
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default function RateCardsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useRateCards();

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ModeFilter>("ALL");
  const [direction, setDirection] = useState<DirectionFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const rateCards: RateCard[] = Array.isArray(data)
    ? data
    : ((data as { items?: RateCard[] } | undefined)?.items ?? []);

  const filteredCards = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rateCards.filter((card) => {
      const matchesSearch =
        !query ||
        card.name.toLowerCase().includes(query) ||
        card.mode.toLowerCase().includes(query) ||
        card.direction.toLowerCase().includes(query) ||
        card.currency.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (mode === "ALL" || card.mode === mode) &&
        (direction === "ALL" || card.direction === direction) &&
        (status === "ALL" || card.status === status)
      );
    });
  }, [rateCards, search, mode, direction, status]);

  const counts = useMemo(
    () => ({
      total: rateCards.length,
      draft: rateCards.filter((card) => card.status === "DRAFT").length,
      active: rateCards.filter((card) => card.status === "ACTIVE").length,
      archived: rateCards.filter((card) => card.status === "ARCHIVED").length,
    }),
    [rateCards],
  );

  const hasFilters =
    search.trim() !== "" ||
    mode !== "ALL" ||
    direction !== "ALL" ||
    status !== "ALL";

  function clearFilters() {
    setSearch("");
    setMode("ALL");
    setDirection("ALL");
    setStatus("ALL");
  }

  return (
    <main className="min-w-0 space-y-6 bg-slate-50/50 pb-8">
      {/* Page heading */}
      <header className="relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-16 rounded-full bg-emerald-50" />
        <div className="absolute right-20 top-12 h-20 w-20 rounded-full bg-emerald-50/70" />

        <div className="relative flex flex-col justify-between gap-5 p-5 sm:p-7 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold">
              <span className="rounded-md bg-emerald-50 px-2 py-1 uppercase tracking-wider text-emerald-800">
                Pricing management
              </span>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-slate-500">Rate cards</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Rate Cards
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your import and export pricing across air, land, and sea
              freight. Configure rates and keep your pricing organised.
            </p>
          </div>

          <Link
            to="/quotations/rate-cards/new"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-100"
          >
            <Plus size={18} />
            Create rate card
          </Link>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total rate cards"
          value={isLoading ? "—" : counts.total}
          description="All pricing documents"
          icon={FileText}
          accent="green"
        />
        <SummaryCard
          label="Active rate cards"
          value={isLoading ? "—" : counts.active}
          description="Currently activated"
          icon={CheckCircle2}
          accent="green"
        />
        <SummaryCard
          label="Draft rate cards"
          value={isLoading ? "—" : counts.draft}
          description="Awaiting configuration"
          icon={Layers3}
          accent="amber"
        />
        <SummaryCard
          label="Archived rate cards"
          value={isLoading ? "—" : counts.archived}
          description="Stored for reference"
          icon={Archive}
          accent="slate"
        />
      </section>

      {/* Search and filters */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <SlidersHorizontal size={17} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Find a rate card
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Search and filter your pricing documents
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative min-w-0 xl:col-span-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search rate cards..."
                aria-label="Search rate cards"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as ModeFilter)}
              aria-label="Filter by transport mode"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            >
              <option value="ALL">All transport modes</option>
              <option value="AIR">Air freight</option>
              <option value="LAND">Land transport</option>
              <option value="SEA">Sea freight</option>
            </select>

            <select
              value={direction}
              onChange={(event) =>
                setDirection(event.target.value as DirectionFilter)
              }
              aria-label="Filter by direction"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            >
              <option value="ALL">All directions</option>
              <option value="IMPORT">Import</option>
              <option value="EXPORT">Export</option>
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StatusFilter)
              }
              aria-label="Filter by status"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            >
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {isLoading ? "—" : filteredCards.length}
              </span>{" "}
              of {isLoading ? "—" : rateCards.length} rate cards
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}

              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={isFetching ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Error state */}
      {isError && (
        <section
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">Unable to load rate cards</p>
            <p className="mt-1 break-words text-red-700">
              {error instanceof Error ? error.message : "Please try again."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-2 font-semibold underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        </section>
      )}

      {/* Loading state */}
      {isLoading && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
            >
              <div className="h-1 rounded-t-2xl bg-emerald-100" />
              <div className="space-y-4 p-5">
                <div className="h-5 w-2/3 rounded bg-slate-100" />
                <div className="h-4 w-1/3 rounded bg-slate-100" />
                <div className="h-10 rounded-lg bg-slate-100" />
                <div className="h-16 rounded-xl bg-slate-100" />
                <div className="h-10 rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filteredCards.length === 0 && (
        <section className="rounded-2xl border border-dashed border-emerald-200 bg-white px-5 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <FileText size={28} />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            {rateCards.length === 0
              ? "Create your first rate card"
              : "No matching rate cards"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {rateCards.length === 0
              ? "Start building your pricing structure for air, land, and sea import and export services."
              : "We couldn't find any rate cards matching your search. Try changing the filters or search terms."}
          </p>

          {rateCards.length === 0 ? (
            <Link
              to="/quotations/rate-cards/new"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Plus size={17} />
              Create rate card
            </Link>
          ) : (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              <Filter size={15} />
              Reset filters
            </button>
          )}
        </section>
      )}

      {/* Rate cards */}
      {!isLoading && !isError && filteredCards.length > 0 && (
        <>
          {/* Mobile layout */}
          <section className="grid gap-4 md:hidden">
            {filteredCards.map((card) => (
              <RateCardMobile key={card.id} card={card} />
            ))}
          </section>

          {/* Desktop layout */}
          <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  All rate cards
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Review and manage your configured pricing
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {filteredCards.length} result
                {filteredCards.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80">
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4">Rate card</th>
                    <th className="px-4 py-4">Transport</th>
                    <th className="px-4 py-4">Direction</th>
                    <th className="px-4 py-4">Currency</th>
                    <th className="px-4 py-4">Configurations</th>
                    <th className="px-4 py-4">Effective from</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCards.map((card) => {
                    
                    return (
                      <tr
                        key={card.id}
                        className="transition-colors hover:bg-emerald-50/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-56 break-words font-semibold text-slate-900">
                                {card.name}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-400">
                                ID: {card.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <ModeBadge mode={card.mode} />
                        </td>

                        <td className="px-4 py-4">
                          <DirectionBadge direction={card.direction} />
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700">
                            {card.currency}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-700">
                            {card.configurations?.length ?? 0}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                            <CalendarDays
                              size={14}
                              className="text-emerald-600"
                            />
                            {formatDate(card.effectiveFrom)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={card.status} />
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            to={`/quotations/rate-cards/${card.id}`}
                            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-800 transition hover:border-emerald-600 hover:bg-emerald-700 hover:text-white"
                          >
                            Manage
                            <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Displaying{" "}
                <span className="font-semibold text-slate-800">
                  {filteredCards.length}
                </span>{" "}
                of {rateCards.length} rate cards
              </p>
              <p className="text-xs text-slate-400">
                Pricing management
              </p>
            </footer>
          </section>
        </>
      )}
    </main>
  );
}
