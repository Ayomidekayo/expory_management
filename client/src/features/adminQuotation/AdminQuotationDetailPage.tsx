import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  LoaderCircle,
  Mail,
  MessageSquare,
  PackageCheck,
  Printer,
  Send,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { getAdminQuotations, sendAdminQuotationMessage, updateAdminQuotationStatus, uploadAdminQuotationAttachment, type AdminQuotation, type AdminQuotationAttachment, type QuotationStatus } from "./api/admin-quotations.api";


const STATUS_OPTIONS: Array<{ label: string; value: QuotationStatus}> = [
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

/** Populate these values with the business's verified details before issuing quotations externally. */
const DOCUMENT_ISSUER = {
  businessName: "",
  address: "",
  email: "",
  phone: "",
  website: "",
};

/** Add only company-approved commercial terms here; leave blank to omit the section. */
const DOCUMENT_TERMS = "";

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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function prettyStatus(status: QuotationStatus) {
  return status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }: { status: QuotationStatus }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${STATUS_STYLES[status] ?? STATUS_STYLES.ARCHIVED}`}>
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
      {prettyStatus(status)}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  icon?: typeof FileText;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {Icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 print-hidden"><Icon size={19} /></span>}
      <div>
        {eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">{eyebrow}</p>}
        <h2 className="text-base font-bold text-slate-950 sm:text-lg">{title}</h2>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">{value || "—"}</dd>
    </div>
  );
}

function formatFileSize(value: number | null | undefined) {
  if (!value || value < 0) return "File size unavailable";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown, fallback: string) {
  const maybeAxios = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return maybeAxios?.response?.data?.message || maybeAxios?.message || fallback;
}

function getQuoteRef(quotation: AdminQuotation) {
  return quotation.quote?.quoteNumber || `SUB-${quotation.id.slice(0, 8).toUpperCase()}`;
}

function humanize(value: string | null | undefined) {
  if (!value) return "Not specified";
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLocaleLowerCase()
    .replace(/\b\w/g, (character) => character.toLocaleUpperCase());
}

function getShipmentContext(quotation: AdminQuotation) {
  const quote = quotation.quote;
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
  const selectedOptions = (configuration?.options ?? [])
    .filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.name);

  return {
    mode: humanize(rateCard?.mode),
    direction: humanize(rateCard?.direction),
    shipmentOption: selectedOptions.length
      ? selectedOptions.join(", ")
      : configuration?.name || configuration?.routeLabel || configuration?.equipmentType || "Not specified",
    route: configuration?.routeLabel || configuration?.routeCode || "Not specified",
    equipment: configuration?.equipmentType || "Not specified",
    configuration: configuration?.name || "Not specified",
  };
}

function AttachmentRow({ attachment }: { attachment: AdminQuotationAttachment }) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center print-break-inside-avoid">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 print-hidden"><FileText size={18} /></span>
        <div className="min-w-0">
          <p className="break-all text-sm font-bold text-slate-800">{attachment.originalName || attachment.fileName}</p>
          <p className="mt-1 text-xs text-slate-500">
            {attachment.uploadedByType === "ADMIN" ? "Uploaded by admin" : "Uploaded by exporter"}
            {" · "}{formatDate(attachment.createdAt)}{" · "}{formatFileSize(attachment.fileSize)}
          </p>
          {attachment.remarks && <p className="mt-1 text-sm leading-5 text-slate-600">{attachment.remarks}</p>}
        </div>
      </div>
      <a href={attachment.fileUrl} target="_blank" rel="noreferrer" className="print-hidden inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50">
        <Download size={14} /> Open file
      </a>
      <span className="hidden break-all text-xs text-slate-500 print:block">{attachment.fileUrl}</span>
    </div>
  );
}

type AdminQuotationDetailsPageProps = {
  /** Read-only presentation for staff who can view quotations but cannot review them. */
  readOnly?: boolean;
};

export default function AdminQuotationDetailsPage({ readOnly = false }: AdminQuotationDetailsPageProps) {
  const { id = "" } = useParams<{ id: string }>();
  const backTo = readOnly ? "/quotations" : "/quotations/review";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nextStatus, setNextStatus] = useState<QuotationStatus>("PENDING_REVIEW");
  const [statusNote, setStatusNote] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const quotation = quotations.find((item) => item.id === id);

  useEffect(() => {
    if (quotation) setNextStatus(quotation.status);
  }, [quotation?.id, quotation?.status]);

  const refreshQuotations = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "quotation-submissions"] });
  };

  const statusMutation = useMutation({
    mutationFn: () => updateAdminQuotationStatus(quotation!.id, nextStatus, statusNote),
    onSuccess: async () => {
      setStatusNote("");
      setFeedback({ type: "success", text: "Quotation status saved successfully." });
      await refreshQuotations();
    },
    onError: (mutationError) => setFeedback({ type: "error", text: getErrorMessage(mutationError, "Could not update quotation status.") }),
  });

  const messageMutation = useMutation({
    mutationFn: () => sendAdminQuotationMessage(quotation!.id, message.trim()),
    onSuccess: async () => {
      setMessage("");
      setFeedback({ type: "success", text: "Your message has been sent to the exporter." });
      await refreshQuotations();
    },
    onError: (mutationError) => setFeedback({ type: "error", text: getErrorMessage(mutationError, "Could not send the message.") }),
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Choose a file to upload first.");
      return uploadAdminQuotationAttachment(quotation!.id, file, remarks);
    },
    onSuccess: async () => {
      setFile(null);
      setRemarks("");
      const input = document.getElementById("admin-detail-upload") as HTMLInputElement | null;
      if (input) input.value = "";
      setFeedback({ type: "success", text: "Document uploaded successfully." });
      await refreshQuotations();
    },
    onError: (mutationError) => setFeedback({ type: "error", text: getErrorMessage(mutationError, "Could not upload the document.") }),
  });

  const busy = statusMutation.isPending || messageMutation.isPending || uploadMutation.isPending;
  const selectedItems = useMemo(() => (quotation?.items ?? []).filter((item) => item.isSelected), [quotation?.items]);
  const allAttachments = useMemo(() => {
    const attached = quotation?.attachments ?? [];
    const inMessages = (quotation?.messages ?? []).flatMap((entry) => entry.attachments ?? []);
    const combined = [...attached, ...inMessages];
    return combined.filter((item, index) => combined.findIndex((candidate) => candidate.id === item.id) === index);
  }, [quotation?.attachments, quotation?.messages]);

  if (isLoading) {
    return <main className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-600"><LoaderCircle size={25} className="animate-spin text-emerald-700" /> Loading quotation details…</main>;
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm" role="alert">
          <AlertCircle size={25} className="text-rose-600" />
          <h1 className="mt-3 text-xl font-bold text-slate-950">Unable to load quotation</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{getErrorMessage(error, "Check your connection and your permissions, then try again.")}</p>
          <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void refetch()} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white">Try again</button><Link to={backTo} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Back to quotations</Link></div>
        </div>
      </main>
    );
  }

  if (!quotation) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <FileText size={30} className="mx-auto text-slate-400" />
          <h1 className="mt-4 text-xl font-bold text-slate-950">Quotation not found</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">This submission may have been removed, or it is not included in the current admin list.</p>
          <Link to={backTo} className="mt-5 inline-flex rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800">Back to quotations</Link>
        </div>
      </main>
    );
  }

  const quote = quotation.quote;
  const exporter = quotation.exporter;
  const rateCard = quote?.rateCard;
  const quoteReference = getQuoteRef(quotation);
  const shipment = getShipmentContext(quotation);
  const messages = quotation.messages ?? [];

  return (
    <main className="min-h-screen bg-[#f4f7f6] px-3 py-5 sm:px-6 sm:py-8 lg:px-8 quotation-detail-page">
      <style>{`
        @page { size: A4; margin: 13mm; }
        @media print {
          html, body, #root { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          .quotation-print-document, .quotation-print-document * { visibility: visible !important; }
          .quotation-print-document { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; border: 0 !important; box-shadow: none !important; background: #fff !important; }
          .print-hidden, .print-internal-only { display: none !important; }
          .quotation-print-document { color: #0f172a !important; font-size: 10pt !important; }
          .quotation-print-document header { background: #fff !important; color: #0f172a !important; border-bottom: 2px solid #047857 !important; }
          .quotation-print-document header p { color: #475569 !important; }
          .quotation-print-document header h1 { color: #0f172a !important; }
          .quotation-print-document .space-y-7 > :not([hidden]) ~ :not([hidden]) { margin-top: 16px !important; }
          .print-break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
          a { color: #0f172a !important; text-decoration: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border-bottom: 1px solid #dbe3e8 !important; padding: 8px !important; }
          .quotation-shipment-summary { border: 1px solid #cbd5e1 !important; break-inside: avoid !important; page-break-inside: avoid !important; }
          .quotation-shipment-summary table { width: 100% !important; table-layout: fixed !important; }
          .quotation-shipment-summary thead th { background: #0f2740 !important; color: #ffffff !important; font-weight: 800 !important; font-size: 9pt !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; padding: 10px 8px !important; border: 1px solid #334155 !important; }
          .quotation-shipment-summary tbody td { background: #ecfdf5 !important; color: #0f2740 !important; font-weight: 800 !important; padding: 12px 8px !important; border: 1px solid #d1fae5 !important; vertical-align: top !important; overflow-wrap: anywhere !important; }
          .quotation-shipment-summary tbody td span { overflow-wrap: anywhere !important; }
          .quotation-print-document section { box-shadow: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-5">
        <div className="print-hidden flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => navigate(backTo)} className="inline-flex items-center gap-2 rounded-xl px-1 py-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-800"><ArrowLeft size={17} /> Back to quotations</button>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void refetch()} disabled={isFetching} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><Clock3 size={16} className={isFetching ? "animate-spin" : ""} /> Refresh details</button>
            {!readOnly && <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900"><Printer size={16} /> Print quotation</button>}
          </div>
        </div>

        <div className={`grid items-start gap-6 ${readOnly ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_330px]"}`}>
          <article className="quotation-print-document min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 print-break-inside-avoid">
            <header className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white sm:p-8">
              <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute -right-3 -top-12 h-44 w-44 rounded-full border border-white/10" />
              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100"><ShieldCheck size={13} /> Export operations · Admin record</div>
                  <p className="print-hidden text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100">Import &amp; export services</p>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl print-hidden">Quotation details</h1>
                  <h1 className="mt-4 hidden text-3xl font-extrabold tracking-tight text-white print:block print:text-slate-950">IMPORT / EXPORT QUOTATION</h1>
                  {(DOCUMENT_ISSUER.businessName || DOCUMENT_ISSUER.address || DOCUMENT_ISSUER.email || DOCUMENT_ISSUER.phone || DOCUMENT_ISSUER.website) && (
                    <div className="mt-3 space-y-1 text-xs leading-5 print:text-slate-600">
                      {DOCUMENT_ISSUER.businessName && <p className="font-bold">{DOCUMENT_ISSUER.businessName}</p>}
                      {DOCUMENT_ISSUER.address && <p>{DOCUMENT_ISSUER.address}</p>}
                      {[DOCUMENT_ISSUER.phone, DOCUMENT_ISSUER.email, DOCUMENT_ISSUER.website].filter(Boolean).length > 0 && (
                        <p>{[DOCUMENT_ISSUER.phone, DOCUMENT_ISSUER.email, DOCUMENT_ISSUER.website].filter(Boolean).join(" · ")}</p>
                      )}
                    </div>
                  )}
                  <p className="mt-2 text-sm leading-6 text-emerald-100 print-hidden">Review the shipment details, requested services and saved quotation amount.</p>
                </div>
                <div className="relative min-w-[180px] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm print:bg-white print:text-slate-900">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100 print:text-slate-500">Quotation reference</p>
                  <p className="mt-2 break-all text-xl font-bold tracking-tight">{quoteReference}</p>
                  <div className="mt-3 print:hidden"><StatusBadge status={quotation.status} /></div>
                  <p className="mt-2 hidden text-sm font-bold print:block">Status: {prettyStatus(quotation.status)}</p>
                </div>
              </div>
              <div className="relative mt-7 grid gap-3 border-t border-white/15 pt-5 text-sm sm:grid-cols-3">
                <div><p className="text-xs text-emerald-200 print:text-slate-500"><span className="print-hidden">Date submitted</span><span className="hidden print:inline">Date issued</span></p><p className="mt-1 font-semibold print:text-slate-900">{formatDate(quotation.submittedAt || quotation.createdAt)}</p></div>
                <div className="print-hidden"><p className="text-xs text-emerald-200">Last updated</p><p className="mt-1 font-semibold">{formatDate(quotation.updatedAt)}</p></div>
                <div className="print-hidden"><p className="text-xs text-emerald-200">Record ID</p><p className="mt-1 break-all font-mono text-xs font-semibold">{quotation.id}</p></div>
              </div>
            </header>

            {/* Prominent shipment summary — included in the printable quotation */}
            <div className="quotation-shipment-summary overflow-hidden border-x border-b border-slate-200 bg-white print-break-inside-avoid">
              <table className="w-full table-fixed border-collapse text-left">
                <thead>
                  <tr className="bg-[#0F2740]">
                    <th scope="col" className="w-[25%] border-r border-white/20 px-3 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white sm:px-5 sm:text-xs">
                      Mode
                    </th>
                    <th scope="col" className="w-[50%] border-r border-white/20 px-3 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white sm:px-5 sm:text-xs">
                      Shipment option
                    </th>
                    <th scope="col" className="w-[25%] px-3 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white sm:px-5 sm:text-xs">
                      Direction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-emerald-50">
                    <td className="border-r border-t border-emerald-100 px-3 py-4 align-top sm:px-5">
                      <span className="block break-words text-sm font-extrabold text-[#0F2740] sm:text-base">
                        {shipment.mode || "Not specified"}
                      </span>
                      <span className="mt-1 block text-[10px] font-medium text-slate-500 sm:text-xs">
                        Transport mode
                      </span>
                    </td>
                    <td className="border-r border-t border-emerald-100 px-3 py-4 align-top sm:px-5">
                      <span className="block break-words text-sm font-extrabold leading-5 text-[#0F2740] sm:text-base sm:leading-6">
                        {shipment.shipmentOption || "Not specified"}
                      </span>
                      {shipment.route !== "Not specified" && (
                        <span className="mt-1 block break-words text-[10px] font-medium text-slate-500 sm:text-xs">
                          Route: {shipment.route}
                        </span>
                      )}
                      {shipment.equipment !== "Not specified" && (
                        <span className="mt-1 block break-words text-[10px] font-medium text-slate-500 sm:text-xs">
                          Equipment: {shipment.equipment}
                        </span>
                      )}
                    </td>
                    <td className="border-t border-emerald-100 px-3 py-4 align-top sm:px-5">
                      <span className="inline-flex max-w-full break-words rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-xs font-extrabold uppercase leading-4 text-emerald-800 sm:px-3 sm:text-sm">
                        {shipment.direction || "Not specified"}
                      </span>
                      <span className="mt-2 block text-[10px] font-medium text-slate-500 sm:text-xs">
                        Shipment direction
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-7 p-5 sm:p-8">
              <section className="print-break-inside-avoid">
                <SectionHeading eyebrow="01 / Customer" title="Exporter information" icon={UserRound} />
                <dl className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 sm:p-5">
                  <DetailField label="Exporter / company name" value={exporter?.name || quotation.customerName || "Not provided"} />
                  <DetailField label="Email address" value={exporter?.email || quotation.email || "Not provided"} />
                  <DetailField label="Phone number" value={exporter?.phone || quotation.phone || "Not provided"} />
                  <div className="print-hidden"><DetailField label="Exporter account ID" value={exporter?.id || "Not available"} /></div>
                </dl>
              </section>

              <section className="print-break-inside-avoid">
                <SectionHeading eyebrow="02 / Shipment" title="Shipment and rate details" icon={PackageCheck} />
                <dl className="grid gap-5 rounded-2xl border border-slate-200 p-4 sm:grid-cols-2 sm:p-5">
                  <DetailField label="Goods description" value={quote?.goodsDescription || "Not provided"} />
                  <DetailField label="HS code" value={quote?.hsCode || "Not provided"} />
                  <DetailField label="Gross weight" value={quote?.weightKg != null ? `${quote.weightKg} kg` : "Not provided"} />
                  <DetailField label="Quantity" value={quote?.quantity != null ? String(quote.quantity) : "Not provided"} />
                  {quote?.customsValue != null && <DetailField label="Declared customs value" value={`${quotation.currency || "NGN"} ${amount(quote.customsValue)}`} />}
                  {quote?.freightAmount != null && <DetailField label="Freight value supplied" value={`${quotation.currency || "NGN"} ${amount(quote.freightAmount)}`} />}
                  <DetailField label="Rate card" value={rateCard?.name || "Rate card details unavailable"} />
                  {quote?.validUntil && <DetailField label="Quotation valid until" value={formatDate(quote.validUntil)} />}
                  <DetailField label="Route / lane" value={shipment.route} />
                  <DetailField label="Equipment type" value={shipment.equipment} />
                  <DetailField label="Configuration" value={shipment.configuration} />
                  <DetailField label="Manual review required" value={quote?.requiresReview ? "Yes — review needed" : quote ? "No" : "Unknown"} />
                  <DetailField label="Currency" value={quotation.currency || "NGN"} />
                </dl>
              </section>

              {(quote?.requiresReview || quotation.status === "PENDING_REVIEW" || quotation.status === "CHANGES_REQUESTED") && (
                <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 print-break-inside-avoid">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em]">Estimate — subject to review</p>
                  <p className="mt-1 text-sm leading-5">The quotation requires confirmation by the operations team. The amounts shown are based on the saved calculation and should not be treated as a final invoice.</p>
                </section>
              )}

              <section className="print-break-inside-avoid">
                <SectionHeading eyebrow="03 / Cost breakdown" title="Requested services" icon={FileText} />
                <div className="rounded-2xl border border-slate-200 bg-white">
                  {/* Mobile and tablet: service cards keep every value, including Amount, visible without horizontal scrolling. */}
                  <div className="space-y-3 p-3 sm:p-4 lg:hidden print:hidden">
                    {selectedItems.length === 0 ? (
                      <p className="px-2 py-6 text-center text-sm text-slate-500">
                        No selected service items are available for this quotation.
                      </p>
                    ) : selectedItems.map((item, index) => (
                      <article key={item.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-extrabold tabular-nums text-emerald-800">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="break-words text-sm font-bold leading-5 text-slate-900">
                              {item.componentName}
                            </h3>
                            <p className="mt-1 break-all text-[11px] leading-4 text-slate-500">
                              <span className="font-semibold text-slate-600">Code:</span> {item.componentCode || "—"}
                            </p>
                          </div>
                        </div>

                        <dl className="mt-4 grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 border-t border-slate-100 pt-3">
                          <div className="min-w-0">
                            <dt className="text-[11px] font-medium text-slate-500">Quantity</dt>
                            <dd className="mt-1 break-words text-sm font-semibold tabular-nums text-slate-800">{item.quantity}</dd>
                          </div>
                          <div className="min-w-0 text-right">
                            <dt className="text-[11px] font-medium text-slate-500">Unit rate</dt>
                            <dd className="mt-1 break-words text-sm font-semibold tabular-nums text-slate-800">
                              <span className="block text-[10px] font-medium text-slate-500">{quotation.currency}</span>
                              {amount(item.rateApplied)}
                            </dd>
                          </div>
                          <div className="col-span-2 flex min-w-0 items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-3">
                            <dt className="shrink-0 text-xs font-bold text-emerald-950">Amount</dt>
                            <dd className="min-w-0 break-words text-right text-sm font-extrabold tabular-nums text-emerald-900">
                              {quotation.currency} {amount(item.lineTotal)}
                            </dd>
                          </div>
                        </dl>
                      </article>
                    ))}
                  </div>

                  {/* Desktop: retain the full itemized table. The scroll container protects narrower laptop windows. */}
                  <div className="hidden overflow-x-auto lg:block print:block print:overflow-visible">
                    <table className="w-full min-w-[760px] table-fixed text-left lg:min-w-0 print:min-w-0">
                      <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                          <th scope="col" className="w-[7%] px-3 py-3 font-bold">S/N</th>
                          <th scope="col" className="w-[25%] px-3 py-3 font-bold">Service / charge</th>
                          <th scope="col" className="w-[19%] px-3 py-3 font-bold">Code</th>
                          <th scope="col" className="w-[9%] px-3 py-3 text-right font-bold">Qty</th>
                          <th scope="col" className="w-[19%] px-3 py-3 text-right font-bold">Unit rate</th>
                          <th scope="col" className="w-[21%] px-3 py-3 text-right font-bold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedItems.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">No selected service items are available for this quotation.</td></tr>
                        ) : selectedItems.map((item, index) => (
                          <tr key={item.id} className="align-top">
                            <td className="break-words px-3 py-3 text-sm font-semibold tabular-nums text-slate-500">{index + 1}</td>
                            <td className="break-words px-3 py-3 text-sm font-semibold text-slate-800">{item.componentName}</td>
                            <td className="break-all px-3 py-3 text-xs text-slate-500">{item.componentCode || "—"}</td>
                            <td className="break-words px-3 py-3 text-right text-sm tabular-nums text-slate-600">{item.quantity}</td>
                            <td className="break-words px-3 py-3 text-right text-sm tabular-nums text-slate-600">{quotation.currency} {amount(item.rateApplied)}</td>
                            <td className="break-words px-3 py-3 text-right text-sm font-bold tabular-nums text-slate-900">{quotation.currency} {amount(item.lineTotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 ml-auto max-w-sm rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 print-break-inside-avoid">
                  <div className="flex justify-between gap-4 text-sm text-slate-600"><span>Subtotal</span><span>{quotation.currency} {amount(quotation.subtotal)}</span></div>
                  <div className="mt-2 flex justify-between gap-4 text-sm text-slate-600"><span>Tax</span><span>{quotation.currency} {amount(quotation.taxAmount)}</span></div>
                  <div className="my-4 border-t border-emerald-200" />
                  <div className="flex items-end justify-between gap-4"><span className="text-sm font-bold text-slate-800">Quotation total</span><span className="text-xl font-extrabold tracking-tight text-emerald-900">{quotation.currency} {amount(quotation.totalAmount)}</span></div>
                  <p className="mt-3 text-[10px] leading-5 text-slate-500">This amount reflects the saved quotation calculation and is not necessarily the final approved charge.</p>
                </div>
                {DOCUMENT_TERMS.trim() && (
                  <div className="mt-5 rounded-xl border border-slate-200 p-4 print-break-inside-avoid">
                    <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-700">Quotation terms and notes</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{DOCUMENT_TERMS}</p>
                  </div>
                )}
                <section className="hidden grid-cols-2 gap-8 pt-8 print:grid print-break-inside-avoid">
                  <div className="pt-8">
                    <div className="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-700">Prepared by / Authorized representative</div>
                    <p className="mt-1 text-xs text-slate-500">Name, signature and date</p>
                  </div>
                  <div className="pt-8">
                    <div className="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-700">Customer acceptance</div>
                    <p className="mt-1 text-xs text-slate-500">Name, signature and date</p>
                  </div>
                </section>
              </section>

              <section className="print-internal-only grid gap-4 sm:grid-cols-2 print-break-inside-avoid">
                <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Original exporter note</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{quotation.customerMessage || "No message was included when the quotation was submitted."}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Latest admin note</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{quotation.adminMessage || "No admin note has been recorded."}</p>
                </div>
              </section>

              <section className="print-internal-only print-break-inside-avoid">
                <SectionHeading eyebrow="04 / Communication" title="Conversation history" icon={MessageSquare} />
                <div className="space-y-3">
                  {messages.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No follow-up messages are recorded in the data returned by the API.</p> : messages.map((entry) => (
                    <article key={entry.id} className={`rounded-xl border p-4 ${entry.senderType === "ADMIN" ? "border-emerald-100 bg-emerald-50/60" : "border-slate-200 bg-slate-50"} print-break-inside-avoid`}>
                      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-extrabold uppercase tracking-wide text-slate-700">{entry.senderType === "ADMIN" ? "Administration" : "Exporter"}</p><time className="text-xs text-slate-500">{formatDate(entry.createdAt)}</time></div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{entry.message}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="print-internal-only print-break-inside-avoid">
                <SectionHeading eyebrow="05 / Supporting records" title="Documents and attachments" icon={Download} />
                <div className="space-y-3">
                  {allAttachments.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No quotation documents have been uploaded, or attachments are not included in the API response.</p> : allAttachments.map((attachment) => <AttachmentRow key={attachment.id} attachment={attachment} />)}
                </div>
              </section>

              <footer className="border-t border-slate-200 pt-5 print-break-inside-avoid">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Quotation document</p><p className="mt-1 text-xs leading-5 text-slate-500">Generated from the quotation management system · Print date: {formatDate(new Date().toISOString())}</p></div>
                  <p className="text-xs font-semibold text-slate-500">Reference: {quoteReference}</p>
                </div>
              </footer>
            </div>
          </article>

          {!readOnly && <aside className="space-y-5 print-hidden">
            {feedback && <div role={feedback.type === "error" ? "alert" : "status"} className={`rounded-2xl border p-4 text-sm leading-6 ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{feedback.text}</div>}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">Workflow</p><h2 className="mt-1 text-lg font-bold text-slate-950">Manage status</h2></div><span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-800"><ShieldCheck size={19} /></span></div>
              <div className="mt-4"><p className="mb-2 text-xs font-semibold text-slate-500">Current status</p><StatusBadge status={quotation.status} /></div>
              <label htmlFor="quotation-status" className="mt-5 block text-sm font-semibold text-slate-700">Set new status</label>
              <select id="quotation-status" value={nextStatus} onChange={(event) => setNextStatus(event.target.value as QuotationStatus)} disabled={busy} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60">
                {STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
              <label htmlFor="quotation-status-note" className="mt-4 block text-sm font-semibold text-slate-700">Decision note <span className="font-normal text-slate-400">(optional)</span></label>
              <textarea id="quotation-status-note" rows={4} maxLength={5000} value={statusNote} onChange={(event) => setStatusNote(event.target.value)} disabled={busy} placeholder="Explain the decision or what the exporter should do next…" className="mt-2 w-full resize-y rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
              <button type="button" disabled={busy || nextStatus === quotation.status} onClick={() => { setFeedback(null); statusMutation.mutate(); }} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50">
                {statusMutation.isPending ? <LoaderCircle size={17} className="animate-spin" /> : <CheckCircle2 size={17} />} Save status
              </button>
              <p className="mt-3 text-xs leading-5 text-slate-500">Status changes and notes are submitted to the backend audit workflow.</p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><Mail size={18} className="text-emerald-800" /><h2 className="text-base font-bold text-slate-950">Message exporter</h2></div>
              <p className="mt-2 text-sm leading-5 text-slate-500">Send a note directly into this quotation conversation.</p>
              <form onSubmit={(event) => { event.preventDefault(); if (!message.trim() || busy) return; setFeedback(null); messageMutation.mutate(); }} className="mt-4 space-y-3">
                <textarea rows={5} maxLength={5000} required value={message} onChange={(event) => setMessage(event.target.value)} disabled={busy} placeholder="Write a clear message to the exporter…" className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                <div className="flex items-center justify-between text-xs text-slate-400"><span>Keep messages under 5,000 characters</span><span>{message.length}/5000</span></div>
                <button type="submit" disabled={busy || !message.trim()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-50">{messageMutation.isPending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />} Send message</button>
              </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><UploadCloud size={19} className="text-emerald-800" /><h2 className="text-base font-bold text-slate-950">Upload a document</h2></div>
              <p className="mt-2 text-sm leading-5 text-slate-500">Attach a rate sheet, revised quotation, or supporting document.</p>
              <form onSubmit={(event) => { event.preventDefault(); if (!file || busy) return; setFeedback(null); uploadMutation.mutate(); }} className="mt-4 space-y-3">
                <label htmlFor="admin-detail-upload" className="block text-sm font-semibold text-slate-700">Choose file</label>
                <input id="admin-detail-upload" type="file" required disabled={busy} onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full min-w-0 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-emerald-900" />
                {file && <p className="break-all text-xs text-slate-500">Selected: {file.name} · {formatFileSize(file.size)}</p>}
                <label htmlFor="admin-detail-remarks" className="block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
                <input id="admin-detail-remarks" value={remarks} maxLength={1000} onChange={(event) => setRemarks(event.target.value)} disabled={busy} placeholder="e.g. Final quotation document" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                <button type="submit" disabled={busy || !file} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">{uploadMutation.isPending ? <LoaderCircle size={16} className="animate-spin" /> : <UploadCloud size={16} />} Upload document</button>
              </form>
            </section>

            <Link to={backTo} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"><span className="inline-flex items-center gap-2"><ArrowLeft size={16} /> Return to all quotations</span><ChevronRight size={16} /></Link>
          </aside>}
        </div>
      </div>
    </main>
  );
}