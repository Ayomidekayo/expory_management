import { useMemo, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileSearch,
  FilterX,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Plane,
  Ship,
  Truck,
  Package,
  ArrowLeftRight,
} from "lucide-react";
import {
  getAdminQuotations,
  type AdminQuotation,
  type QuotationStatus,
} from "./api/admin-quotations.api";

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const STATUS_OPTIONS: Array<{ label: string; value: "ALL" | QuotationStatus }> = [
  { label: "All statuses", value: "ALL" },
  { label: "Pending review", value: "PENDING_REVIEW" },
  { label: "Changes requested", value: "CHANGES_REQUESTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

const STATUS_STYLES: Record<QuotationStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-800 ring-amber-200",
  CHANGES_REQUESTED: "bg-orange-50 text-orange-800 ring-orange-200",
  APPROVED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-800 ring-rose-200",
  IN_PROGRESS: "bg-sky-50 text-sky-800 ring-sky-200",
  COMPLETED: "bg-green-50 text-green-800 ring-green-200",
  ARCHIVED: "bg-slate-100 text-slate-700 ring-slate-200",
};

function amount(value: number | string | null | undefined) {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numeric) ? numeric : 0);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusLabel(status: QuotationStatus) {
  return status.replaceAll("_", " ");
}

function StatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset ${STATUS_STYLES[status] ?? STATUS_STYLES.ARCHIVED}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  iconStyle,
}: {
  title: string;
  value: number;
  detail: string;
  icon: typeof Clock3;
  iconStyle: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value.toLocaleString()}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}>
          <Icon size={20} />
        </span>
      </div>
    </article>
  );
}

function getQuoteNumber(item: AdminQuotation) {
  return item.quote?.quoteNumber || `Submission ${item.id.slice(0, 8).toUpperCase()}`;
}

function humanize(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLocaleLowerCase()
    .replace(/\b\w/g, (character) => character.toLocaleUpperCase());
}

function getShipmentContext(item: AdminQuotation) {
  const quote = item.quote;
  const rateCard = quote?.rateCard;
  const snapshot = quote?.inputSnapshot && typeof quote.inputSnapshot === "object"
    ? quote.inputSnapshot as Record<string, unknown>
    : {};
  const configurationId = typeof snapshot.configurationId === "string"
    ? snapshot.configurationId
    : "";
  const selectedOptionIds = Array.isArray(snapshot.optionIds)
    ? snapshot.optionIds.filter((value): value is string => typeof value === "string")
    : [];
  const configurations = rateCard?.configurations ?? [];
  const configuration = configurationId
    ? configurations.find((entry) => entry.id === configurationId)
    : configurations.length === 1
      ? configurations[0]
      : undefined;
  const selectedOptionNames = (configuration?.options ?? [])
    .filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.name);

  const mode = rateCard?.mode ? humanize(rateCard.mode) : "Not specified";
  const direction = rateCard?.direction ? humanize(rateCard.direction) : "";
  const primaryOption = selectedOptionNames.length
    ? selectedOptionNames.join(", ")
    : configuration?.name || configuration?.routeLabel || configuration?.equipmentType || "Not specified";
  const secondaryParts = [
    configuration?.routeLabel,
    configuration?.equipmentType,
    selectedOptionNames.length && configuration?.name ? configuration.name : null,
  ].filter((value): value is string => Boolean(value));

  return {
    mode,
    direction,
    shipmentOption: primaryOption,
    shipmentSecondary: [...new Set(secondaryParts)].join(" · "),
  };
}

function ModeBadge({ mode }: { mode: string }) {
  const normalized = mode.toLocaleUpperCase();
  const Icon = normalized.includes("AIR") ? Plane : normalized.includes("SEA") ? Ship : normalized.includes("LAND") || normalized.includes("ROAD") ? Truck : Package;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700">
      <Icon size={14} className="text-emerald-700" />
      {mode}
    </span>
  );
}

function DirectionBadge({ direction }: { direction: string }) {
  if (!direction || direction === "Not specified") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-inset ring-emerald-100">
      <ArrowLeftRight size={11} /> {direction}
    </span>
  );
}

type AdminQuotationsPageProps = {
  /** "all" is the read-only quotations workspace; "review" is the review queue. */
  view?: "all" | "review";
};

export default function AdminQuotationsPage({ view = "review" }: AdminQuotationsPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | QuotationStatus>("ALL");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: quotations = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin", "quotation-submissions"],
    queryFn: getAdminQuotations,
  });

  const pendingCount = quotations.filter((item) => item.status === "PENDING_REVIEW").length;
  const approvedCount = quotations.filter((item) => item.status === "APPROVED").length;
  const inProgressCount = quotations.filter((item) => item.status === "IN_PROGRESS").length;
  const completedCount = quotations.filter((item) => item.status === "COMPLETED").length;

  const filteredQuotations = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return quotations.filter((item) => {
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const shipment = getShipmentContext(item);
      const searchable = [
        item.quote?.quoteNumber,
        item.exporter?.name,
        item.exporter?.email,
        item.customerName,
        item.email,
        item.quote?.goodsDescription,
        item.quote?.hsCode,
        item.quote?.rateCard?.mode,
        item.quote?.rateCard?.direction,
        shipment.shipmentOption,
        shipment.shipmentSecondary,
        item.id,
      ].filter(Boolean).join(" ").toLocaleLowerCase();
      return matchesStatus && (!term || searchable.includes(term));
    });
  }, [quotations, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredQuotations.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = filteredQuotations.length ? (safePage - 1) * pageSize : 0;
  const pageItems = filteredQuotations.slice(startIndex, startIndex + pageSize);
  const firstResult = filteredQuotations.length ? startIndex + 1 : 0;
  const lastResult = Math.min(startIndex + pageSize, filteredQuotations.length);

  const setSearchAndReset = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const setStatusAndReset = (value: "ALL" | QuotationStatus) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const openDetails = (item: AdminQuotation) => {
    const id = encodeURIComponent(item.id);
    navigate(view === "all" ? `/quotations/${id}` : `/quotations/review/${id}`);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const visiblePages = useMemo(() => {
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [safePage, totalPages]);

  const isReviewPath = location.pathname.startsWith("/quotations/review");
  const isReviewView = view === "review" || isReviewPath;

  return (
    <main className="min-h-full min-w-0 bg-[#f5f8f7] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] space-y-7">
        <header className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-emerald-800 ring-1 ring-emerald-100">
                <ShieldCheck size={15} /> Administration workspace
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{isReviewView ? "Quotation review" : "All quotations"}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {isReviewView
                  ? "Review submitted requests, communicate with exporters, and manage quotation progress."
                  : "Browse submitted quotation requests and inspect shipment details. Review actions are available only to authorized staff."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 lg:self-center"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
              Refresh list
            </button>
          </div>
          <div className="grid grid-cols-1 border-t border-slate-100 bg-gradient-to-r from-emerald-900 to-emerald-800 sm:grid-cols-3">
            <div className="flex items-center gap-3 px-6 py-4 text-white sm:px-8">
              <FileSearch size={19} className="text-emerald-200" />
              <div><p className="text-xs text-emerald-100">Total records</p><p className="text-lg font-bold">{quotations.length.toLocaleString()}</p></div>
            </div>
            <div className="flex items-center gap-3 border-t border-white/10 px-6 py-4 text-white sm:border-l sm:border-t-0 sm:px-8">
              <Clock3 size={19} className="text-amber-200" />
              <div><p className="text-xs text-emerald-100">Need review</p><p className="text-lg font-bold">{pendingCount.toLocaleString()}</p></div>
            </div>
            <div className="flex items-center gap-3 border-t border-white/10 px-6 py-4 text-white sm:border-l sm:border-t-0 sm:px-8">
              <CheckCircle2 size={19} className="text-emerald-200" />
              <div><p className="text-xs text-emerald-100">Completed</p><p className="text-lg font-bold">{completedCount.toLocaleString()}</p></div>
            </div>
          </div>
        </header>

        {isError && (
          <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Could not load quotation submissions</p>
              <p className="mt-1 break-words">{error instanceof Error ? error.message : "Check your connection, authentication, and API response."}</p>
              <button type="button" onClick={() => void refetch()} className="mt-2 font-semibold underline underline-offset-4">Try again</button>
            </div>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total submissions" value={quotations.length} detail="All quotation requests received" icon={FileSearch} iconStyle="bg-slate-100 text-slate-700" />
          <MetricCard title="Awaiting review" value={pendingCount} detail="Require an initial decision" icon={Clock3} iconStyle="bg-amber-50 text-amber-700" />
          <MetricCard title="Approved" value={approvedCount} detail="Approved requests" icon={CheckCircle2} iconStyle="bg-emerald-50 text-emerald-700" />
          <MetricCard title="In progress" value={inProgressCount} detail={`${completedCount} completed so far`} icon={TrendingUp} iconStyle="bg-sky-50 text-sky-700" />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Submitted quotations</h2>
                <p className="mt-1 text-sm text-slate-500">Search, filter, and open a dedicated detail page for any submission.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_190px] xl:w-[600px]">
                <label className="relative block">
                  <span className="sr-only">Search quotations</span>
                  <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearchAndReset(event.target.value)}
                    placeholder="Quote, exporter, mode, shipment option..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Filter by status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusAndReset(event.target.value as "ALL" | QuotationStatus)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500"><LoaderCircle size={28} className="animate-spin text-emerald-700" /><p className="text-sm">Loading submissions…</p></div>
          ) : pageItems.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><FileSearch size={26} /></span>
              <h3 className="mt-4 font-bold text-slate-900">{quotations.length === 0 ? "No submissions yet" : "No matching quotations"}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{quotations.length === 0 ? "New exporter quotation requests will appear here." : "Try another search phrase or clear your current filters."}</p>
              {(search || statusFilter !== "ALL") && <button type="button" onClick={() => { setSearchAndReset(""); setStatusAndReset("ALL"); }} className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"><FilterX size={16} /> Clear filters</button>}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1600px] text-left">
                  <thead className="bg-slate-50/90 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th scope="col" className="w-16 px-5 py-4 font-bold">S/N</th>
                      <th scope="col" className="px-6 py-4 font-bold">Quotation</th>
                      <th scope="col" className="px-6 py-4 font-bold">Exporter</th>
                      <th scope="col" className="px-6 py-4 font-bold">Mode</th>
                      <th scope="col" className="px-6 py-4 font-bold">Shipment option</th>
                      <th scope="col" className="px-6 py-4 font-bold">Direction</th>
                      <th scope="col" className="px-6 py-4 font-bold">Requested services</th>
                      <th className="px-6 py-4 font-bold">Quote total</th>
                      <th className="px-6 py-4 font-bold">Submitted</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 text-right font-bold"> </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pageItems.map((item, index) => {
                      const items = item.items ?? [];
                      const selectedCount = items.filter((service) => service.isSelected).length;
                      const shipment = getShipmentContext(item);
                      return (
                      <tr
  key={item.id}
  tabIndex={0}
  aria-label={`Open quotation ${getQuoteNumber(item)}`}
  onClick={() => openDetails(item)}
  onKeyDown={(event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetails(item);
    }
  }}
  className="group cursor-pointer transition hover:bg-emerald-50/50 focus:outline-none focus-visible:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600"
>
                          <td className="px-5 py-4 text-sm font-semibold tabular-nums text-slate-500">
                            {startIndex + index + 1}
                          </td>

                         
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{getQuoteNumber(item)}</p>
                            <p className="mt-1 max-w-56 truncate text-xs text-slate-500">{item.quote?.goodsDescription || "Goods not specified"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800">{item.exporter?.name || item.customerName || "Unknown exporter"}</p>
                            <p className="mt-1 max-w-56 truncate text-xs text-slate-500">{item.exporter?.email || item.email || "No email provided"}</p>
                          </td>
                          <td className="px-6 py-4"><ModeBadge mode={shipment.mode} /></td>
                          <td className="px-6 py-4">
                            <p className="max-w-48 font-semibold text-slate-800">{shipment.shipmentOption}</p>
                            {shipment.shipmentSecondary && (
                              <p className="mt-1 max-w-48 truncate text-xs text-slate-500" title={shipment.shipmentSecondary}>
                                {shipment.shipmentSecondary}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {shipment.direction ? (
                              <DirectionBadge direction={shipment.direction} />
                            ) : (
                              <span className="text-sm text-slate-400">Not specified</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800">{selectedCount} selected</p>
                            <p className="mt-1 text-xs text-slate-500">of {items.length} services</p>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4"><p className="font-bold text-slate-900">{item.currency || "NGN"} {amount(item.totalAmount)}</p></td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{formatDate(item.submittedAt)}</td>
                          <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                          <td className="px-6 py-4 text-right">
                            <button type="button" onClick={() => openDetails(item)} className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-sm font-bold text-emerald-800 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-700 hover:text-white hover:ring-emerald-700">
                              View details <ArrowRight size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 lg:hidden">
                {pageItems.map((item, index) => {
                  const items = item.items ?? [];
                  const selectedCount = items.filter((service) => service.isSelected).length;
                  const shipment = getShipmentContext(item);
                  return (
                    <article key={item.id} className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:shadow-sm">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-emerald-50 px-2 text-xs font-extrabold tabular-nums text-emerald-800 ring-1 ring-inset ring-emerald-100">
                          {startIndex + index + 1}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0"><p className="break-all font-bold text-slate-950">{getQuoteNumber(item)}</p><p className="mt-1 text-sm text-slate-600">{item.exporter?.name || item.customerName || "Unknown exporter"}</p></div>
                      </div>
                      <p className="mt-2 break-all text-sm text-slate-500">{item.exporter?.email || item.email || "No email provided"}</p>
                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-4">
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Mode</p>
                          <div className="mt-1"><ModeBadge mode={shipment.mode} /></div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Shipment option</p>
                          <p className="mt-1 break-words text-sm font-bold text-slate-900">{shipment.shipmentOption}</p>
                          {shipment.shipmentSecondary && <p className="mt-1 line-clamp-2 text-xs leading-4 text-slate-500">{shipment.shipmentSecondary}</p>}
                          {shipment.direction && <div className="mt-1"><DirectionBadge direction={shipment.direction} /></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Services selected</p>
                          <p className="mt-1 font-bold text-slate-900">{selectedCount} of {items.length}</p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Quotation total</p>
                          <p className="mt-1 break-words font-bold text-slate-900">{item.currency || "NGN"} {amount(item.totalAmount)}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Submitted {formatDate(item.submittedAt)}</p>
                      <button type="button" onClick={() => openDetails(item)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">Open full details <ArrowRight size={16} /></button>
                    </article>
                  );
                })}
              </div>

              <footer className="flex flex-col gap-4 border-t border-slate-100 bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span>Showing <strong className="text-slate-800">{firstResult}–{lastResult}</strong> of <strong className="text-slate-800">{filteredQuotations.length}</strong></span>
                  <label className="flex items-center gap-2">Rows per page
                    <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500">
                      {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </label>
                </div>
                <nav aria-label="Quotation pages" className="flex flex-wrap items-center gap-1.5">
                  <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage <= 1} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} /> Previous</button>
                  {visiblePages.map((page) => <button key={page} type="button" onClick={() => goToPage(page)} aria-current={safePage === page ? "page" : undefined} className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${safePage === page ? "bg-emerald-700 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50"}`}>{page}</button>)}
                  <button type="button" onClick={() => goToPage(safePage + 1)} disabled={safePage >= totalPages} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={16} /></button>
                </nav>
              </footer>
            </>
          )}
        </section>
        <p className="pb-2 text-center text-xs text-slate-400">Quotation status and decision history are managed from each quotation’s detail page.</p>
      </div>
    </main>
  );
}
