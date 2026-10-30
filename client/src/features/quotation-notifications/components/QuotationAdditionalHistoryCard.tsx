import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { History, Clock3, FileText, UserRound, AlertCircle, LoaderCircle } from "lucide-react";
import { getQuotationHistory, type QuotationHistoryEvent } from "../api/quotation-notifications.api";


type Props = { submissionId: string; audience: "admin" | "exporter"; currency?: string };
const money = (value: unknown) => new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value ?? 0) || 0);
const dateLabel = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(date); };
const record = (details: unknown): Record<string, unknown> => details && typeof details === "object" && !Array.isArray(details) ? details as Record<string, unknown> : {};
const pretty = (value: unknown) => String(value ?? "").replaceAll("_", " ").replaceAll("-", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
function titleFor(event: QuotationHistoryEvent, details: Record<string, unknown>) {
  const kind = String(details.event ?? "");
  const titles: Record<string, string> = {
    EXPORTER_ADDITIONAL_CHARGE_REQUESTED: "Exporter requested additional services",
    OTHER_CHARGE_ADDED: "Additional charge added",
    OTHER_CHARGE_EDITED: "Additional charge edited",
    ADDITIONAL_CHARGE_DELETED: "Additional charge removed",
    SUBTRACTION_ADDED: "Bonus / deduction applied",
    SUBTRACTION_REMOVED: "Bonus / deduction reversed",
  };
  return titles[kind] ?? pretty(event.action || "Quotation updated");
}
function descriptionFor(event: QuotationHistoryEvent, details: Record<string, unknown>, currency: string) {
  const kind = String(details.event ?? "");
  if (kind === "EXPORTER_ADDITIONAL_CHARGE_REQUESTED") {
    const parts: string[] = [];
    if (details.customsChargeRequested) parts.push(`Customs requested for invoice value ${String(details.invoiceCurrency ?? currency)} ${money(details.invoiceValue)}.`);
    if (details.transportChargeRequested) parts.push("Additional transportation pricing requested.");
    return parts.join(" ") || "The exporter requested additional quotation services.";
  }
  if (kind === "SUBTRACTION_ADDED") return `${String(details.name ?? "Bonus / deduction")} · −${currency} ${money(details.amount)}. Reason: ${String(details.reason ?? "Not supplied")}`;
  if (kind === "SUBTRACTION_REMOVED") return `${String(details.name ?? "Bonus / deduction")} was removed. ${currency} ${money(details.removedAmount)} was restored to the current subtotal. Reason recorded: ${String(details.reason ?? "Not supplied")}`;
  if (kind === "OTHER_CHARGE_ADDED" || kind === "OTHER_CHARGE_EDITED") {
    const amount = details.amount ?? 0;
    return `${String(details.name ?? "Additional charge")} · ${currency} ${money(amount)}${details.reason ? ` · Reason: ${String(details.reason)}` : ""}`;
  }
  if (kind === "ADDITIONAL_CHARGE_DELETED") return `${String(details.name ?? "Additional charge")} was removed${details.removedAmount !== undefined ? ` (${currency} ${money(details.removedAmount)})` : ""}${details.reason ? `. Original reason: ${String(details.reason)}` : ""}.`;
  if (details.totalAmount !== undefined) return `Updated quotation total: ${currency} ${money(details.totalAmount)}${details.reason ? `. Reason: ${String(details.reason)}` : ""}.`;
  if (details.newStatus !== undefined) return `Status changed to ${pretty(details.newStatus)}${details.note ? `. Note: ${String(details.note)}` : ""}.`;
  return typeof details.message === "string" ? details.message : "An update was recorded in the quotation audit trail.";
}
function HistoryEntry({ event, currency }: { event: QuotationHistoryEvent; currency: string }) {
  const details = record(event.details);
  const heading = titleFor(event, details);
  const description = descriptionFor(event, details, currency);
  const isDeduction = String(details.event ?? "") === "SUBTRACTION_ADDED";
  return <article className={`relative rounded-xl border p-4 ${isDeduction ? "border-amber-200 bg-amber-50/60" : "border-slate-200 bg-white"}`}>
    <div className="flex items-start gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${isDeduction ? "bg-amber-100 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>{isDeduction ? <AlertCircle size={17} /> : <FileText size={17} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="text-sm font-extrabold text-slate-900">{heading}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${isDeduction ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>{pretty(event.actorType || "System")}</span></div><p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{description}</p><div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500"><span className="inline-flex items-center gap-1"><Clock3 size={12} />{dateLabel(event.createdAt)}</span><span className="inline-flex items-center gap-1"><UserRound size={12} />{event.actorUserId ? `Actor ${event.actorUserId.slice(0, 8)}` : "System recorded"}</span></div></div></div>
  </article>;
}

export default function QuotationAdditionalHistoryCard({ submissionId, audience, currency = "NGN" }: Props) {
  const queryClient = useQueryClient();
  const historyQuery = useQuery({
    queryKey: ["quotation-history", audience, submissionId],
    queryFn: () => getQuotationHistory(submissionId, audience),
    enabled: Boolean(submissionId),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
  useEffect(() => {
    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["quotation-history", audience, submissionId] });
    };
    window.addEventListener("quotation-history:refresh", refresh);
    return () => window.removeEventListener("quotation-history:refresh", refresh);
  }, [queryClient, audience, submissionId]);

  const events = historyQuery.data?.events ?? [];
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><History size={19} /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-extrabold text-slate-950 sm:text-lg">Additional details history</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-600">{historyQuery.isPending ? "…" : events.length} events</span></div><p className="mt-1 text-sm leading-6 text-slate-500">A chronological audit trail of requests, additional charges, bonuses, deductions, edits and removals.</p></div></div>
    {historyQuery.isPending ? <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500"><LoaderCircle size={17} className="animate-spin" /> Loading quotation history…</div>
    : historyQuery.isError ? <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800">The history could not be loaded. Check that the history endpoint and migration are installed.</div>
    : events.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center"><History size={23} className="mx-auto text-slate-300" /><p className="mt-2 text-sm font-bold text-slate-700">No history events yet</p><p className="mt-1 text-xs leading-5 text-slate-500">New quotation requests and adjustments will be recorded here.</p></div>
    : <div className="mt-5 space-y-3">{events.map((event) => <HistoryEntry key={event.id} event={event} currency={currency} />)}</div>}
  </section>;
}
