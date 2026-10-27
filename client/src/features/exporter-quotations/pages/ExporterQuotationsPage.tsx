import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  LoaderCircle,
  PackageCheck,
  Plane,
  Plus,
  RefreshCw,
  Ship,
  Sparkles,
  Truck,
} from "lucide-react";
import { useMySubmissions } from "../hook/use-exporter-quotations";

const money = (value: string | number, currency: string) => {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const normalizedCurrency = currency === "CFA" ? "XOF" : currency || "NGN";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${normalizedCurrency} ${safeAmount.toLocaleString("en-NG", {
      maximumFractionDigits: 2,
    })}`;
  }
};

const statusConfig: Record<
  string,
  { label: string; classes: string; Icon: typeof Clock3; dot: string }
> = {
  PENDING_REVIEW: {
    label: "Awaiting review",
    classes: "border-amber-200 bg-amber-50 text-amber-800",
    Icon: Clock3,
    dot: "bg-amber-500",
  },
  CHANGES_REQUESTED: {
    label: "Changes requested",
    classes: "border-orange-200 bg-orange-50 text-orange-800",
    Icon: CircleAlert,
    dot: "bg-orange-500",
  },
  APPROVED: {
    label: "Approved",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Icon: BadgeCheck,
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    classes: "border-rose-200 bg-rose-50 text-rose-800",
    Icon: CircleAlert,
    dot: "bg-rose-500",
  },
  IN_PROGRESS: {
    label: "In progress",
    classes: "border-blue-200 bg-blue-50 text-blue-800",
    Icon: RefreshCw,
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    classes: "border-green-200 bg-green-50 text-green-800",
    Icon: CheckCircle2,
    dot: "bg-green-500",
  },
  ARCHIVED: {
    label: "Archived",
    classes: "border-slate-200 bg-slate-100 text-slate-600",
    Icon: FileText,
    dot: "bg-slate-400",
  },
};

const modeConfig = {
  AIR: { label: "Air freight", Icon: Plane },
  LAND: { label: "Land transport", Icon: Truck },
  SEA: { label: "Sea freight", Icon: Ship },
} as const;

function formatDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatCard({
  label,
  value,
  supportingText,
  Icon,
  index,
}: {
  label: string;
  value: number;
  supportingText: string;
  Icon: typeof FileText;
  index: number;
}) {
  return (
    <article
      className="quotation-enter group relative overflow-hidden rounded-2xl border border-emerald-100/80 bg-white p-5 shadow-[0_2px_12px_rgba(6,78,59,0.035)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_14px_32px_rgba(6,78,59,0.10)] sm:p-6"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 tabular-nums sm:text-4xl">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{supportingText}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-800 transition duration-300 group-hover:scale-105 group-hover:bg-emerald-700 group-hover:text-white">
          <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
        </span>
      </div>
      <span className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-emerald-50/70 transition duration-500 group-hover:scale-150" />
    </article>
  );
}

export default function ExporterQuotationsPage() {
  const { data = [], isLoading, isError, refetch, isFetching } =
    useMySubmissions();

  const count = (status: string) =>
    data.filter((item) => item.status === status).length;

  const stats = [
    {
      label: "Total requests",
      value: data.length,
      supportingText: "All your submitted quotations",
      Icon: FileText,
    },
    {
      label: "Awaiting review",
      value: count("PENDING_REVIEW"),
      supportingText: "Waiting for our team",
      Icon: Clock3,
    },
    {
      label: "Approved",
      value: count("APPROVED"),
      supportingText: "Approved and ready for the next step",
      Icon: BadgeCheck,
    },
    {
      label: "Completed",
      value: count("COMPLETED"),
      supportingText: "Requests successfully completed",
      Icon: CheckCircle2,
    },
  ];

  return (
    <main className="quotation-page w-full min-w-0 overflow-x-clip bg-[#F2F8F4] text-slate-900">
      <style>{`
        @keyframes quotation-enter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes quotation-glow {
          0%, 100% { opacity: .22; transform: scale(1); }
          50% { opacity: .38; transform: scale(1.06); }
        }
        .quotation-enter { animation: quotation-enter .55s cubic-bezier(.2,.75,.25,1) both; }
        .quotation-glow { animation: quotation-glow 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .quotation-enter, .quotation-glow { animation: none !important; }
          .quotation-page *, .quotation-page *::before, .quotation-page *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <div className="mx-auto w-full min-w-0 max-w-6xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 md:px-6 lg:px-8">
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#052E24] via-[#065F46] to-[#047857] text-white shadow-[0_16px_42px_rgba(6,78,59,0.12)]">
        <div className="quotation-glow pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-[28%] h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />

        <div className="relative mx-auto w-full min-w-0 max-w-7xl px-4 pb-7 pt-5 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-200/20 bg-white/10 text-lime-200 shadow-inner">
                <PackageCheck size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-wide text-white">Exporter workspace</p>
                <p className="mt-0.5 text-xs text-emerald-100/75">Quotation management</p>
              </div>
            </div>
            <Link
              to="/get-a-quote"
              className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-lime-300 px-3.5 text-sm font-extrabold text-[#073B2E] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-lime-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-lime-200/50 sm:px-5"
            >
              <Plus size={17} strokeWidth={2.5} aria-hidden="true" />
              <span className="hidden sm:inline">Create quotation</span>
              <span className="sm:hidden">New quote</span>
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 grid items-end gap-6 md:mt-12 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="quotation-enter min-w-0 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-200/25 bg-lime-200/10 px-3 py-1.5 text-xs font-semibold text-lime-100">
                <Sparkles size={14} aria-hidden="true" />
                Your shipping activity, in one place
              </div>
              <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                My quotations<span className="text-lime-300">.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/85 sm:text-base sm:leading-7">
                Follow every request from submission to completion. Check your estimated charges, monitor progress, and open a request whenever you need the details.
              </p>
            </div>
            <div className="quotation-enter flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100/15 bg-white/[0.07] p-3.5 backdrop-blur-sm sm:p-4 md:min-w-52" style={{ animationDelay: "120ms" }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lime-200">
                <CalendarDays size={19} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium text-emerald-100/75">Account overview</p>
                <p className="mt-1 text-sm font-bold text-white">{data.length} {data.length === 1 ? "request" : "requests"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-7">
        {isLoading ? (
          <section aria-label="Loading quotations" aria-live="polite">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="h-3 w-28 rounded bg-slate-200" />
                  <div className="mt-5 h-9 w-16 rounded bg-slate-200" />
                  <div className="mt-4 h-3 w-36 rounded bg-slate-100" />
                </div>
              ))}
            </div>
            <div className="mt-6 animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-5 w-56 rounded bg-slate-200" />
              <div className="mt-6 h-24 rounded-xl bg-slate-100" />
              <div className="mt-3 h-24 rounded-xl bg-slate-100" />
            </div>
          </section>
        ) : isError ? (
          <section role="alert" className="quotation-enter rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-700">
              <CircleAlert size={23} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900">We couldn’t load your quotations</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Your requests haven’t been removed. Check your connection and try loading them again.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFetching ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {isFetching ? "Retrying…" : "Try again"}
            </button>
          </section>
        ) : (
          <>
            <section aria-label="Quotation statistics" className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <StatCard key={stat.label} {...stat} index={index} />
              ))}
            </section>

            <section className="quotation-enter min-w-0 overflow-hidden rounded-2xl border border-emerald-100/80 bg-white shadow-[0_4px_22px_rgba(6,78,59,0.045)]" style={{ animationDelay: "180ms" }}>
              <div className="flex min-w-0 flex-col gap-3 border-b border-emerald-100/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
                <div>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
                      <FileText size={18} aria-hidden="true" />
                    </span>
                    <h2 className="min-w-0 text-base font-bold tracking-tight text-slate-950 sm:text-lg">Recent quotation requests</h2>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">A clear view of the quotations you’ve submitted.</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {data.length} {data.length === 1 ? "request" : "requests"} total
                </div>
              </div>

              {data.length === 0 ? (
                <div className="px-5 py-14 text-center sm:px-8 sm:py-16">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-emerald-100 bg-emerald-50 text-emerald-800">
                    <PackageCheck size={29} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">Your quotation list starts here</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    You haven’t submitted a quotation yet. Calculate an estimate for your shipment and submit it to start tracking progress here.
                  </p>
                  <Link
                    to="/get-a-quote"
                    className="group mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25"
                  >
                    <Plus size={17} aria-hidden="true" />
                    Calculate a quote
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-emerald-50">
                  {data.map((item, index) => {
                    const status = statusConfig[item.status] ?? {
                      label: item.status.replaceAll("_", " "),
                      classes: "border-slate-200 bg-slate-50 text-slate-700",
                      Icon: Clock3,
                      dot: "bg-slate-400",
                    };
                    const StatusIcon = status.Icon;
                    const mode = modeConfig[item.quote.rateCard.mode as keyof typeof modeConfig];
                    const ModeIcon = mode?.Icon ?? PackageCheck;

                    return (
                      <Link
                        key={item.id}
                        to={`/exporter/quotations/${item.id}`}
                        aria-label={`Open quotation ${item.quote.quoteNumber} details`}
                        className="quotation-enter group group/row grid min-w-0 cursor-pointer gap-4 px-4 py-5 text-left no-underline transition-colors duration-200 hover:bg-emerald-50/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                        style={{ animationDelay: `${Math.min(index * 55, 330)}ms` }}
                      >
                        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                          <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-800 transition duration-300 group-hover:border-emerald-200 group-hover:bg-emerald-100">
                            <ModeIcon size={20} strokeWidth={1.8} aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                              <h3 className="break-all text-sm font-bold text-slate-950 sm:text-base">
                                {item.quote.quoteNumber}
                              </h3>
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                <ModeIcon size={11} aria-hidden="true" />
                                {mode?.label ?? item.quote.rateCard.mode}
                              </span>
                            </div>
                            <p className="mt-1.5 break-words text-sm font-medium text-slate-700">
                              {item.quote.rateCard.name}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-500">
                              <span className="rounded-md border border-emerald-100 bg-emerald-50/60 px-2 py-1 text-emerald-800">{item.quote.rateCard.direction}</span>
                              <span aria-hidden="true" className="hidden text-slate-300 sm:inline">•</span>
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays size={13} aria-hidden="true" />
                                Submitted {formatDate(item.submittedAt)}
                              </span>
                            </div>
                            <p className="mt-2 max-w-2xl break-words text-sm leading-5 text-slate-500">
                              {item.quote.goodsDescription?.trim() || "Cargo description not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 flex-col gap-3 border-t border-emerald-100/80 pt-4 sm:flex-row sm:items-center sm:justify-between lg:border-0 lg:pt-0">
                          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:justify-start lg:flex-col lg:items-end lg:gap-2">
                            <p className="text-base font-bold tracking-tight text-slate-950 tabular-nums sm:text-lg">
                              {money(item.totalAmount, item.currency)}
                            </p>
                            <span className={`inline-flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-bold ${status.classes}`}>
                              <StatusIcon size={13} aria-hidden="true" />
                              {status.label}
                            </span>
                          </div>
                          <span
                            aria-hidden="true"
                            className="group/cta inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-sm font-bold text-emerald-900 transition duration-200 group-hover/row:border-emerald-300 group-hover/row:bg-emerald-50 sm:w-auto lg:ml-4"
                          >
                            View details
                            <ArrowRight size={15} className="transition-transform group-hover/row:translate-x-0.5" aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p>Quotation status and amounts reflect the latest information available in your account.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-stretch rounded-lg px-3 font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-60 sm:self-auto"
              >
                <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
                {isFetching ? "Refreshing…" : "Refresh list"}
              </button>
            </div>
          </>
        )}
      </div>
      </div>
    </main>
  );
}
