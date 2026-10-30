import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  Box,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  History,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Plane,
  Printer,
  Receipt,
  Send,
  ShieldCheck,
  Ship,
  Truck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { getAdminQuotations, sendAdminQuotationMessage, updateAdminQuotationStatus, updateAdminQuotationCharges, uploadAdminQuotationAttachment, type AdminQuotation, type AdminQuotationAttachment, type QuotationStatus } from "./api/admin-quotations.api";
import { useAuthStore } from "../../store/auth.store";
import AdminAdditionalChargesManager from "./AdminAdditionalChargesManager";
import QuotationAdditionalHistoryCard from "../quotation-notifications/components/QuotationAdditionalHistoryCard";




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
    <div className="section-heading mb-4 flex items-start gap-3">
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

function ShipmentFact({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof FileText;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="shipment-fact group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/30 sm:p-5 print-break-inside-avoid">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 transition-colors group-hover:bg-emerald-100 print-hidden">
          <Icon size={18} strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
          <dd className="mt-1.5 break-words text-sm font-bold leading-5 text-slate-900 sm:text-[15px]">{value || "Not specified"}</dd>
          {hint && <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>}
        </div>
      </div>
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

function quotationItemKind(item: { itemType?: string | null }) {
  const type = String(item.itemType ?? "SERVICE").trim().toUpperCase();
  if (type === "CUSTOMS_CHARGE") return "Customs charge";
  if (type === "TRANSPORT_CHARGE") return "Transportation charge";
  if (type === "OTHER_CHARGE") return "Additional charge";
  if (type === "SUBTRACTION") return "Bonus / deduction";
  return "Requested service";
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
  const [customsChargeAmount, setCustomsChargeAmount] = useState("");
  const [transportChargeAmount, setTransportChargeAmount] = useState("");
  // Authorized staff can record a request even if the exporter did not select
  // additional assistance during the public quote flow. Entering an invoice
  // value enables the customs request; transport is an explicit opt-in.
  const [customsRequestEnabled, setCustomsRequestEnabled] = useState(false);
  const [transportRequestEnabled, setTransportRequestEnabled] = useState(false);
  const [invoiceAssessmentValue, setInvoiceAssessmentValue] = useState("");
  const [invoiceAssessmentCurrency, setInvoiceAssessmentCurrency] = useState("NGN");
  const { user } = useAuthStore();
  const userPermissions = (user as (typeof user & { permissions?: string[] }) | null)?.permissions ?? [];
  const canManageCharges = user?.role === "ADMIN" || userPermissions.includes("MANAGE_QUOTE_CHARGES");

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

  useEffect(() => {
    if (!quotation) return;
    const customs = quotation.items?.find((item) => item.itemType === "CUSTOMS_CHARGE");
    const transport = quotation.items?.find((item) => item.itemType === "TRANSPORT_CHARGE");
    setCustomsChargeAmount(customs ? String(customs.lineTotal) : "");
    setTransportChargeAmount(transport ? String(transport.lineTotal) : "");
    setCustomsRequestEnabled(Boolean(quotation.customsChargeRequested || quotation.invoiceValue != null));
    setTransportRequestEnabled(Boolean(quotation.transportChargeRequested));
    setInvoiceAssessmentValue(quotation.invoiceValue == null ? "" : String(quotation.invoiceValue));
    setInvoiceAssessmentCurrency(quotation.invoiceCurrency || quotation.currency || "NGN");
  }, [quotation?.id, quotation?.updatedAt, quotation?.items, quotation?.customsChargeRequested, quotation?.transportChargeRequested, quotation?.invoiceValue, quotation?.invoiceCurrency, quotation?.currency]);

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

  const chargesMutation = useMutation({
    mutationFn: () => {
      if (!quotation) throw new Error("Quotation is not loaded.");
      const payload: {
        customsChargeRequested?: boolean;
        transportChargeRequested?: boolean;
        invoiceValue?: number;
        invoiceCurrency?: string;
        customsChargeAmount?: number;
        transportChargeAmount?: number;
      } = {};

      // Request flags are additive: staff can enable a request, but this form
      // never silently withdraws an existing request.
      if (customsRequestEnabled && !quotation.customsChargeRequested) {
        payload.customsChargeRequested = true;
      }
      if (transportRequestEnabled && !quotation.transportChargeRequested) {
        payload.transportChargeRequested = true;
      }

      // An invoice value is the trigger for customs assistance. Validate and
      // send it whenever the customs request is active, even before a price exists.
      if (customsRequestEnabled) {
        const invoiceNumber = Number(invoiceAssessmentValue);
        if (!invoiceAssessmentValue.trim() || !Number.isFinite(invoiceNumber) || invoiceNumber <= 0) {
          throw new Error("Enter a commercial invoice value greater than zero to request customs assistance.");
        }
        const currencyCode = invoiceAssessmentCurrency.trim().toUpperCase();
        if (!/^[A-Z]{3}$/.test(currencyCode)) {
          throw new Error("Enter a valid three-letter invoice currency code.");
        }
        payload.invoiceValue = invoiceNumber;
        payload.invoiceCurrency = currencyCode;
      }

      // Blank price fields mean "not changing the price", not zero and not delete.
      if (customsRequestEnabled && customsChargeAmount.trim()) {
        payload.customsChargeAmount = Number(customsChargeAmount);
      }
      if (transportRequestEnabled && transportChargeAmount.trim()) {
        payload.transportChargeAmount = Number(transportChargeAmount);
      }
      if (Object.keys(payload).length === 0) {
        throw new Error("Enter an invoice value, enable an additional request, or provide a charge amount.");
      }
      for (const [label, value] of [["Customs", payload.customsChargeAmount], ["Transportation", payload.transportChargeAmount]] as const) {
        if (value !== undefined && value !== null && (!Number.isFinite(value) || value < 0)) {
          throw new Error(`${label} charge must be a valid amount greater than or equal to zero.`);
        }
      }
      return updateAdminQuotationCharges(quotation.id, payload);
    },
    onSuccess: async () => {
      setFeedback({ type: "success", text: "Additional-service requests and charges saved. The quotation totals and VAT have been recalculated where a price was provided." });
      await refreshQuotations();
    },
    onError: (mutationError) => setFeedback({ type: "error", text: getErrorMessage(mutationError, "Could not save additional charges.") }),
  });

  const busy = statusMutation.isPending || messageMutation.isPending || uploadMutation.isPending || chargesMutation.isPending;
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

  // The SERVICE rows are the exporter-selected baseline. Operations add customs
  // and transport as separate item types, so the original amount can be safely
  // reconstructed without relying on a mutable submission total.
  const quotationWithVat = quotation as AdminQuotation & {
    vatEnabled?: boolean;
    vatPercentage?: number | string | null;
  };
  const allSubmissionItems = quotation.items ?? [];
  const originalServiceItems = allSubmissionItems.filter(
    (item) => String((item as typeof item & { itemType?: string }).itemType ?? "SERVICE").toUpperCase() === "SERVICE",
  );
  const pricedAdditionalItems = allSubmissionItems.filter((item) => {
    const itemType = String((item as typeof item & { itemType?: string }).itemType ?? "").toUpperCase();
    return itemType === "CUSTOMS_CHARGE" || itemType === "TRANSPORT_CHARGE" || itemType === "OTHER_CHARGE" || itemType === "SUBTRACTION";
  });
  const otherAdditionalItems = pricedAdditionalItems.filter(
    (item) => String((item as typeof item & { itemType?: string }).itemType ?? "").toUpperCase() === "OTHER_CHARGE",
  );
  const customsChargeItem = pricedAdditionalItems.find(
    (item) => String((item as typeof item & { itemType?: string }).itemType ?? "").toUpperCase() === "CUSTOMS_CHARGE",
  );
  const transportChargeItem = pricedAdditionalItems.find(
    (item) => String((item as typeof item & { itemType?: string }).itemType ?? "").toUpperCase() === "TRANSPORT_CHARGE",
  );
  const fallbackServiceSubtotal = Math.round((originalServiceItems.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0) + Number.EPSILON) * 100) / 100;
  const additionalChargesSubtotal = Math.round((pricedAdditionalItems.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0) + Number.EPSILON) * 100) / 100;
  const currentSubtotal = Number(quotation.subtotal) || 0;
  const currentTax = Number(quotation.taxAmount) || 0;
  const currentTotal = Number(quotation.totalAmount) || 0;

  type OriginalPriceSnapshot = {
    subtotal?: number | string | null;
    taxAmount?: number | string | null;
    totalAmount?: number | string | null;
    vatEnabled?: boolean;
    vatPercentage?: number | string | null;
  };
  const originalQuote = quotation.quote as (NonNullable<AdminQuotation["quote"]> & {
    subtotal?: number | string | null;
    taxAmount?: number | string | null;
    totalAmount?: number | string | null;
    pricingSnapshot?: unknown;
  }) | null | undefined;
  const originalSnapshot = originalQuote?.pricingSnapshot && typeof originalQuote.pricingSnapshot === "object"
    ? originalQuote.pricingSnapshot as OriginalPriceSnapshot
    : {};
  const readMoney = (value: unknown): number | null => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const snapshotSubtotal = readMoney(originalSnapshot.subtotal) ?? readMoney(originalQuote?.subtotal);
  const snapshotTax = readMoney(originalSnapshot.taxAmount) ?? readMoney(originalQuote?.taxAmount);
  const snapshotTotal = readMoney(originalSnapshot.totalAmount) ?? readMoney(originalQuote?.totalAmount);

  const storedVatPercentage = Number(quotationWithVat.vatPercentage ?? originalSnapshot.vatPercentage);
  const vatPercentage = Number.isFinite(storedVatPercentage) && storedVatPercentage >= 0
    ? storedVatPercentage
    : currentSubtotal > 0
      ? (currentTax / currentSubtotal) * 100
      : 0;
  const vatEnabled = typeof quotationWithVat.vatEnabled === "boolean"
    ? quotationWithVat.vatEnabled
    : typeof originalSnapshot.vatEnabled === "boolean"
      ? originalSnapshot.vatEnabled
      : currentTax > 0;

  // Preserve the pre-submission quote exactly where its immutable pricing
  // snapshot is available. Fall back to the selected SERVICE rows for older data.
  const originalServiceSubtotal = snapshotSubtotal ?? fallbackServiceSubtotal;
  const originalServiceTax = snapshotTax ?? (vatEnabled
    ? Math.round((originalServiceSubtotal * vatPercentage / 100 + Number.EPSILON) * 100) / 100
    : 0);
  const originalServiceTotal = snapshotTotal ?? Math.round((originalServiceSubtotal + originalServiceTax + Number.EPSILON) * 100) / 100;
  const totalChangeAfterCharges = Math.round((currentTotal - originalServiceTotal + Number.EPSILON) * 100) / 100;
  const hasAdditionalChargeRequest = Boolean(quotation.customsChargeRequested || quotation.transportChargeRequested || pricedAdditionalItems.length > 0);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8 quotation-detail-page">
      <style>{`
        @page { size: A4; margin: 12mm 13mm 15mm; }
        @media print {
          html, body, #root { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          .quotation-print-document, .quotation-print-document * { visibility: visible !important; }
          .quotation-print-document { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; background: #fff !important; color: #1f2937 !important; font-size: 9pt !important; line-height: 1.35 !important; }
          .quotation-screen-header, .print-hidden, .print-internal-only { display: none !important; }
          .quotation-print-header { display: flex !important; align-items: flex-start !important; justify-content: space-between !important; gap: 16px !important; margin: 0 0 12px !important; padding: 0 0 10px !important; border-bottom: 2.5px solid #047857 !important; break-inside: avoid !important; page-break-inside: avoid !important; }
          .quotation-print-header p { margin-top: 0 !important; margin-bottom: 0 !important; }
          .quotation-print-brand { color: #0f2740 !important; font-size: 16pt !important; font-weight: 800 !important; letter-spacing: 1.1px !important; line-height: 1.1 !important; }
          .quotation-print-subbrand { margin-top: 4px !important; color: #047857 !important; font-size: 7.5pt !important; font-weight: 800 !important; letter-spacing: 1px !important; }
          .quotation-print-reference { min-width: 150px !important; max-width: 45% !important; text-align: right !important; }
          .quotation-print-reference .quotation-ref-value { overflow-wrap: anywhere !important; color: #0f2740 !important; font-size: 12pt !important; font-weight: 800 !important; }
          .quotation-print-reference .quotation-ref-label { color: #64748b !important; font-size: 7pt !important; font-weight: 700 !important; letter-spacing: .5px !important; text-transform: uppercase !important; }
          .quotation-print-document h1, .quotation-print-document h2, .quotation-print-document h3 { color: #0f2740 !important; }
          .quotation-print-document h2 { font-size: 11pt !important; }
          .quotation-print-document .space-y-7 > :not([hidden]) ~ :not([hidden]) { margin-top: 12px !important; }
          .quotation-print-document .quotation-document-body { padding: 0 !important; }
          .print-break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
          a { color: #0f172a !important; text-decoration: none !important; }
          .quotation-shipment-summary { margin: 0 0 11px !important; overflow: visible !important; border: 1px solid #cbd5e1 !important; border-radius: 2px !important; break-inside: avoid !important; page-break-inside: avoid !important; }
          .quotation-shipment-summary > div:first-child { padding: 8px 10px !important; border-bottom: 1px solid #cbd5e1 !important; background: #f8fafc !important; }
          .quotation-shipment-summary dl { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 0 !important; padding: 0 !important; }
          .quotation-shipment-summary .shipment-fact { border: 0 !important; border-right: 1px solid #e2e8f0 !important; border-bottom: 1px solid #e2e8f0 !important; border-radius: 0 !important; background: #fff !important; padding: 8px !important; }
          .quotation-shipment-summary .shipment-fact dd { font-size: 8pt !important; }
          .quotation-document-section { margin-top: 10px !important; }
          .quotation-document-section > div > dl { gap: 8px !important; }
          .quotation-document-section dl { font-size: 8pt !important; }
          .quotation-document-section dt { font-size: 7pt !important; }
          .quotation-document-section dd { font-size: 8.2pt !important; line-height: 1.25 !important; }
          .quotation-document-section .section-heading { margin-bottom: 6px !important; }
          .quotation-item-table { width: 100% !important; min-width: 0 !important; table-layout: fixed !important; border-collapse: collapse !important; }
          .quotation-item-table thead { display: table-header-group !important; }
          .quotation-item-table tfoot { display: table-row-group !important; }
          .quotation-item-table tr { break-inside: avoid !important; page-break-inside: avoid !important; }
          .quotation-item-table th { background: #0f2740 !important; color: #fff !important; border: 1px solid #334155 !important; padding: 7px 6px !important; font-size: 7pt !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: .35px !important; }
          .quotation-item-table td { border: 1px solid #dbe3e8 !important; padding: 7px 6px !important; color: #1f2937 !important; font-size: 8pt !important; vertical-align: top !important; overflow-wrap: anywhere !important; }
          .quotation-item-table tbody tr:nth-child(even) td { background: #f8fafc !important; }
          .quotation-item-table .charge-kind { display: block !important; margin-top: 3px !important; color: #64748b !important; font-size: 6.5pt !important; font-weight: 700 !important; text-transform: uppercase !important; }
          .quotation-item-table .pending-pricing-row td { background: #fffbeb !important; color: #92400e !important; font-style: italic !important; }
          .quotation-total-card { width: 100% !important; max-width: 78mm !important; margin-left: auto !important; padding: 10px !important; border: 1px solid #cbd5e1 !important; border-radius: 2px !important; background: #f8fafc !important; }
          .quotation-total-card .quotation-total-value { color: #047857 !important; font-size: 15pt !important; }
          .quotation-before-after { margin-top: 10px !important; border: 1px solid #cbd5e1 !important; border-radius: 2px !important; box-shadow: none !important; break-inside: avoid !important; page-break-inside: avoid !important; }
          .quotation-before-after > div:first-child { padding: 8px 10px !important; background: #f8fafc !important; }
          .quotation-before-after-cards { display: none !important; }
          .quotation-before-after-print-table { display: block !important; padding: 0 !important; }
          .quotation-before-after-print-table table { width: 100% !important; border-collapse: collapse !important; }
          .quotation-before-after-print-table thead { display: table-header-group !important; }
          .quotation-before-after-print-table th { padding: 6px 8px !important; background: #0f2740 !important; color: #fff !important; border: 1px solid #334155 !important; text-align: left !important; font-size: 7pt !important; text-transform: uppercase !important; }
          .quotation-before-after-print-table td { padding: 6px 8px !important; border: 1px solid #dbe3e8 !important; color: #1f2937 !important; font-size: 8pt !important; vertical-align: top !important; }
          .quotation-before-after-print-table td:last-child { text-align: right !important; font-weight: 700 !important; font-variant-numeric: tabular-nums !important; }
          .quotation-before-after-print-table .summary-total td { background: #ecfdf5 !important; color: #064e3b !important; font-weight: 800 !important; }
          .quotation-before-after-print-table .summary-note td { background: #fffbeb !important; color: #92400e !important; text-align: left !important; font-size: 7pt !important; font-weight: 500 !important; }
          .quotation-before-after > div:last-child { padding: 7px 10px !important; }
          .quotation-before-after > div:last-child p { font-size: 7pt !important; }
          .quotation-screen-operations-instructions { display: none !important; }
          .print-only-row { display: table-row !important; }
          .quotation-print-footer { margin-top: 12px !important; padding-top: 8px !important; border-top: 1px solid #cbd5e1 !important; }
          .quotation-print-footer p { font-size: 7pt !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1440px] space-y-5 sm:space-y-6">
        <div className="print-hidden flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => navigate(backTo)} className="inline-flex items-center gap-2 rounded-xl px-1 py-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-800"><ArrowLeft size={17} /> Back to quotations</button>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void refetch()} disabled={isFetching} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><Clock3 size={16} className={isFetching ? "animate-spin" : ""} /> Refresh details</button>
            {!readOnly && <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-900"><Printer size={16} /> Print quotation</button>}
          </div>
        </div>

        <div className={`grid min-w-0 items-start gap-5 xl:gap-7 ${readOnly ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1fr)_340px]"}`}>
          <article className="quotation-print-document min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 print-break-inside-avoid">
            <div className="quotation-print-header hidden items-start justify-between gap-6 text-slate-900 print:flex">
              <div className="min-w-0">
                <p className="quotation-print-brand">OGW KAY IMPEX</p>
                <p className="quotation-print-subbrand">EXPORT &amp; IMPORT MANAGEMENT</p>
                {(DOCUMENT_ISSUER.address || DOCUMENT_ISSUER.email || DOCUMENT_ISSUER.phone || DOCUMENT_ISSUER.website) && (
                  <div className="mt-2 space-y-0.5 text-[8px] leading-4 text-slate-600">
                    {DOCUMENT_ISSUER.address && <p>{DOCUMENT_ISSUER.address}</p>}
                    {[DOCUMENT_ISSUER.phone, DOCUMENT_ISSUER.email, DOCUMENT_ISSUER.website].filter(Boolean).length > 0 && (
                      <p>{[DOCUMENT_ISSUER.phone, DOCUMENT_ISSUER.email, DOCUMENT_ISSUER.website].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="quotation-print-reference shrink-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-800">Official quotation</p>
                <p className="quotation-ref-label mt-2">Quotation reference</p>
                <p className="quotation-ref-value mt-1">{quoteReference}</p>
                <p className="quotation-ref-label mt-2">Date issued</p>
                <p className="mt-1 text-[9px] font-semibold text-slate-800">{formatDate(quotation.submittedAt || quotation.createdAt)}</p>
                <p className="mt-1 text-[8px] font-semibold text-slate-600">Status: {prettyStatus(quotation.status)}</p>
              </div>
            </div>
            <header className="quotation-screen-header relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-white sm:p-8">
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

            {/* Responsive shipment overview: icon-led facts on mobile, tablet and desktop. */}
            <section className="quotation-shipment-summary overflow-hidden border-x border-b border-slate-200 bg-white print-break-inside-avoid" aria-label="Shipment overview">
              <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/90 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-sm print-hidden">
                    {rateCard?.mode?.toUpperCase() === "AIR" ? <Plane size={21} /> : rateCard?.mode?.toUpperCase() === "SEA" ? <Ship size={21} /> : <Truck size={21} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-800">Shipment overview</p>
                    <h2 className="mt-1 break-words text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">{shipment.shipmentOption || "Shipment details"}</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">A quick summary of the shipment selected for this quotation.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900">
                    <ArrowLeftRight size={13} /> {shipment.direction || "Direction not specified"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
                    <PackageCheck size={13} /> {shipment.mode || "Mode not specified"}
                  </span>
                </div>
              </div>
              <dl className="grid grid-cols-1 gap-3 bg-white p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-3">
                <ShipmentFact
                  icon={rateCard?.mode?.toUpperCase() === "AIR" ? Plane : rateCard?.mode?.toUpperCase() === "SEA" ? Ship : Truck}
                  label="Transport mode"
                  value={shipment.mode}
                  hint="Air, land or sea freight"
                />
                <ShipmentFact
                  icon={PackageCheck}
                  label="Shipment option"
                  value={shipment.shipmentOption}
                  hint="Selected route, haul type or container option"
                />
                <ShipmentFact
                  icon={MapPin}
                  label="Route / lane"
                  value={shipment.route}
                  hint="Configured route for this rate card"
                />
                <ShipmentFact
                  icon={Box}
                  label="Equipment type"
                  value={shipment.equipment}
                  hint="Container or handling equipment, where applicable"
                />
                <ShipmentFact
                  icon={Compass}
                  label="Rate configuration"
                  value={shipment.configuration}
                  hint={rateCard?.name ? `Rate card: ${rateCard.name}` : "Pricing configuration used for this quote"}
                />
                <ShipmentFact
                  icon={ArrowLeftRight}
                  label="Shipment direction"
                  value={shipment.direction}
                  hint="Import or export"
                />
              </dl>
            </section>

            <div className="quotation-document-body space-y-7 p-4 sm:p-6 lg:p-8">
              <section className="quotation-document-section print-break-inside-avoid">
                <SectionHeading eyebrow="01 / Customer" title="Exporter information" icon={UserRound} />
                <dl className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 sm:p-5">
                  <DetailField label="Exporter / company name" value={exporter?.name || quotation.customerName || "Not provided"} />
                  <DetailField label="Email address" value={exporter?.email || quotation.email || "Not provided"} />
                  <DetailField label="Phone number" value={exporter?.phone || quotation.phone || "Not provided"} />
                  <div className="print-hidden"><DetailField label="Exporter account ID" value={exporter?.id || "Not available"} /></div>
                </dl>
              </section>

              <section className="quotation-document-section print-break-inside-avoid">
                <SectionHeading eyebrow="02 / Shipment" title="Shipment and rate details" icon={PackageCheck} />
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Goods description" value={quote?.goodsDescription || "Not provided"} /></div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="HS code" value={quote?.hsCode || "Not provided"} /></div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Gross weight" value={quote?.weightKg != null ? `${quote.weightKg} kg` : "Not provided"} /></div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Quantity" value={quote?.quantity != null ? String(quote.quantity) : "Not provided"} /></div>
                  {quote?.customsValue != null && <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Declared customs value" value={`${quotation.currency || "NGN"} ${amount(quote.customsValue)}`} /></div>}
                  {quote?.freightAmount != null && <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Freight value supplied" value={`${quotation.currency || "NGN"} ${amount(quote.freightAmount)}`} /></div>}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Rate card" value={rateCard?.name || "Rate card details unavailable"} /></div>
                  {quote?.validUntil && <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Quotation valid until" value={formatDate(quote.validUntil)} /></div>}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Route / lane" value={shipment.route} /></div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Equipment type" value={shipment.equipment} /></div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Configuration" value={shipment.configuration} /></div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Manual review required" value={quote?.requiresReview ? "Yes — review needed" : quote ? "No" : "Unknown"} /></div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4"><DetailField label="Currency" value={quotation.currency || "NGN"} /></div>
                </dl>
              </section>

              {(quote?.requiresReview || quotation.status === "PENDING_REVIEW" || quotation.status === "CHANGES_REQUESTED") && (
                <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 print-break-inside-avoid">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em]">Estimate — subject to review</p>
                  <p className="mt-1 text-sm leading-5">The quotation requires confirmation by the operations team. The amounts shown are based on the saved calculation and should not be treated as a final invoice.</p>
                </section>
              )}

              {(quotation.customsChargeRequested || quotation.transportChargeRequested || quotation.invoiceValue != null) && (
                <section className="print-break-inside-avoid rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                  <SectionHeading eyebrow="03 / Operations requests" title="Additional charges requested" icon={PackageCheck} />
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <DetailField
                      label="Customs duties and charges"
                      value={!quotation.customsChargeRequested
                        ? "Not requested"
                        : customsChargeItem
                          ? `Requested · Priced at ${quotation.currency} ${amount(customsChargeItem.lineTotal)}`
                          : "Requested · Awaiting operations pricing"}
                    />
                    {quotation.customsChargeRequested && quotation.invoiceValue != null && (
                      <DetailField label="Commercial invoice value" value={`${quotation.invoiceCurrency || quotation.currency} ${amount(quotation.invoiceValue)}`} />
                    )}
                    <DetailField
                      label="Transportation pricing"
                      value={!quotation.transportChargeRequested
                        ? "Not requested"
                        : transportChargeItem
                          ? `Requested · Priced at ${quotation.currency} ${amount(transportChargeItem.lineTotal)}`
                          : "Requested · Awaiting operations pricing"}
                    />
                  </dl>
                  <p className="quotation-screen-operations-instructions mt-3 text-xs leading-5 text-slate-600">Enter only the charges requested by the exporter. Saving them updates the same itemized quotation and recalculates VAT using the saved VAT policy.</p>
                </section>
              )}

              <section className="quotation-document-section print-break-inside-avoid">
                <SectionHeading eyebrow="04 / Cost breakdown" title="Requested services and additional charges" icon={FileText} />
                <div className="rounded-2xl border border-slate-200 bg-white">
                  {/* Mobile and tablet: service cards keep every value, including Amount, visible without horizontal scrolling. */}
                  <div className="space-y-3 p-3 sm:p-4 xl:hidden print:hidden">
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
                  <div className="hidden overflow-x-auto xl:block print:block print:overflow-visible">
                    <table className="quotation-item-table w-full min-w-[760px] table-fixed text-left xl:min-w-0 print:min-w-0">
                      <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                          <th scope="col" className="w-[7%] px-3 py-3 font-bold">S/N</th>
                          <th scope="col" className="w-[25%] px-3 py-3 font-bold">Service / charge</th>
                          <th scope="col" className="w-[19%] px-3 py-3 font-bold">Code / type</th>
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
                            <td className="break-all px-3 py-3 text-xs text-slate-500">
                              <span className="block font-semibold text-slate-700">{item.componentCode || "—"}</span>
                              <span className="charge-kind mt-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">{quotationItemKind(item as typeof item & { itemType?: string })}</span>
                            </td>
                            <td className="break-words px-3 py-3 text-right text-sm tabular-nums text-slate-600">{item.quantity}</td>
                            <td className="break-words px-3 py-3 text-right text-sm tabular-nums text-slate-600">{quotation.currency} {amount(item.rateApplied)}</td>
                            <td className={`break-words px-3 py-3 text-right text-sm font-bold tabular-nums ${String((item as typeof item & { itemType?: string }).itemType ?? "").toUpperCase() === "SUBTRACTION" ? "text-amber-800" : "text-slate-900"}`}>{String((item as typeof item & { itemType?: string }).itemType ?? "").toUpperCase() === "SUBTRACTION" ? `− ${quotation.currency} ${amount(Math.abs(Number(item.lineTotal)))}` : `${quotation.currency} ${amount(item.lineTotal)}`}</td>
                          </tr>
                        ))}
                        {quotation.customsChargeRequested && !customsChargeItem && (
                          <tr className="hidden print:table-row print-only-row pending-pricing-row">
                            <td className="px-3 py-3 text-sm">—</td>
                            <td className="px-3 py-3 text-sm font-semibold">Customs duties and charges</td>
                            <td className="px-3 py-3 text-xs">Requested by exporter</td>
                            <td className="px-3 py-3 text-right">—</td>
                            <td className="px-3 py-3 text-right">—</td>
                            <td className="px-3 py-3 text-right font-bold">Awaiting pricing</td>
                          </tr>
                        )}
                        {quotation.transportChargeRequested && !transportChargeItem && (
                          <tr className="hidden print:table-row print-only-row pending-pricing-row">
                            <td className="px-3 py-3 text-sm">—</td>
                            <td className="px-3 py-3 text-sm font-semibold">Additional transportation charge</td>
                            <td className="px-3 py-3 text-xs">Requested by exporter</td>
                            <td className="px-3 py-3 text-right">—</td>
                            <td className="px-3 py-3 text-right">—</td>
                            <td className="px-3 py-3 text-right font-bold">Awaiting pricing</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="quotation-total-card mt-4 ml-auto max-w-sm rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 print-break-inside-avoid">
                  <div className="flex justify-between gap-4 text-sm text-slate-600"><span>Subtotal</span><span>{quotation.currency} {amount(quotation.subtotal)}</span></div>
                  <div className="mt-2 flex justify-between gap-4 text-sm text-slate-600"><span>Tax</span><span>{quotation.currency} {amount(quotation.taxAmount)}</span></div>
                  <div className="my-4 border-t border-emerald-200" />
                  <div className="flex items-end justify-between gap-4"><span className="text-sm font-bold text-slate-800">Quotation total</span><span className="quotation-total-value text-xl font-extrabold tracking-tight text-emerald-900">{quotation.currency} {amount(quotation.totalAmount)}</span></div>
                  <p className="mt-3 text-[10px] leading-5 text-slate-500">This amount reflects the saved quotation calculation and is not necessarily the final approved charge.</p>
                </div>
                {hasAdditionalChargeRequest && (
                  <section className="quotation-before-after mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print-break-inside-avoid" aria-labelledby="quotation-before-after-heading">
                    <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 print-hidden"><History size={19} /></span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-800">Price history</p>
                        <h3 id="quotation-before-after-heading" className="mt-1 text-base font-extrabold text-slate-950 sm:text-lg">Before and after additional charges</h3>
                        <p className="mt-1 text-xs leading-5 text-slate-600">The original figure is read from the saved quote calculation and stays unchanged. The current figure reflects the submitted services plus any additional charges priced by operations.</p>
                      </div>
                    </div>
                    <div className="quotation-before-after-cards grid gap-3 p-3 sm:grid-cols-2 sm:p-4">
                      <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                        <div className="flex items-center gap-2 text-slate-600"><Receipt size={17} /><p className="text-xs font-extrabold uppercase tracking-[0.12em]">Original estimate</p></div>
                        <p className="mt-3 text-xs text-slate-500">Before additional charges</p>
                        <p className="mt-1 break-words text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{quotation.currency} {amount(originalServiceTotal)}</p>
                        <dl className="mt-4 space-y-2.5 border-t border-slate-200 pt-3">
                          <div className="flex items-start justify-between gap-3 text-sm"><dt className="text-slate-600">Original quote subtotal</dt><dd className="text-right font-semibold tabular-nums text-slate-800">{quotation.currency} {amount(originalServiceSubtotal)}</dd></div>
                          <div className="flex items-start justify-between gap-3 text-sm"><dt className="text-slate-600">VAT{vatEnabled ? ` (${amount(vatPercentage)}%)` : ""}</dt><dd className="text-right font-semibold tabular-nums text-slate-800">{quotation.currency} {amount(originalServiceTax)}</dd></div>
                          <div className="flex items-start justify-between gap-3 text-sm"><dt className="text-slate-600">Extra charges</dt><dd className="text-right font-semibold tabular-nums text-slate-800">{quotation.currency} 0.00</dd></div>
                        </dl>
                        <p className="mt-3 text-xs leading-5 text-slate-500">Uses the immutable original quote calculation where available; older records fall back to submitted service rows.</p>
                      </div>
                      <div className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
                        <div className="flex items-center gap-2 text-emerald-800"><CircleDollarSign size={17} /><p className="text-xs font-extrabold uppercase tracking-[0.12em]">Current quotation</p></div>
                        <p className="mt-3 text-xs text-slate-600">After operations pricing</p>
                        <p className="mt-1 break-words text-2xl font-extrabold tracking-tight text-emerald-950 sm:text-3xl">{quotation.currency} {amount(currentTotal)}</p>
                        <dl className="mt-4 space-y-2.5 border-t border-emerald-200 pt-3">
                          <div className="flex items-start justify-between gap-3 text-sm"><dt className="text-slate-600">Updated subtotal</dt><dd className="text-right font-semibold tabular-nums text-slate-900">{quotation.currency} {amount(currentSubtotal)}</dd></div>
                          <div className="flex items-start justify-between gap-3 text-sm"><dt className="text-slate-600">VAT{vatEnabled ? ` (${amount(vatPercentage)}%)` : ""}</dt><dd className="text-right font-semibold tabular-nums text-slate-900">{quotation.currency} {amount(currentTax)}</dd></div>
                          <div className="flex items-start justify-between gap-3 text-sm"><dt className="text-slate-600">Net additional charges / reductions</dt><dd className="text-right font-semibold tabular-nums text-slate-900">{quotation.currency} {amount(additionalChargesSubtotal)}</dd></div>
                        </dl>
                        <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-white/80 px-3 py-3">
                          <div className="min-w-0"><p className="text-xs font-bold text-slate-700">Change from original</p><p className="mt-1 text-[11px] leading-4 text-slate-500">Including VAT effect</p></div>
                          <p className={`break-words text-right text-sm font-extrabold tabular-nums ${totalChangeAfterCharges > 0 ? "text-emerald-800" : totalChangeAfterCharges < 0 ? "text-rose-700" : "text-slate-800"}`}>{totalChangeAfterCharges > 0 ? "+" : totalChangeAfterCharges < 0 ? "−" : ""}{quotation.currency} {amount(Math.abs(totalChangeAfterCharges))}</p>
                        </div>
                      </div>
                    </div>
                    <div className="quotation-before-after-print-table hidden print:block">
                      <table aria-label="Original and current quotation comparison">
                        <thead>
                          <tr><th scope="col">Price component</th><th scope="col">Before additional charges</th><th scope="col">Current quotation</th></tr>
                        </thead>
                        <tbody>
                          <tr><td>Original quote subtotal</td><td>{quotation.currency} {amount(originalServiceSubtotal)}</td><td>{quotation.currency} {amount(currentSubtotal)}</td></tr>
                          <tr><td>VAT{vatEnabled ? ` (${amount(vatPercentage)}%)` : " (not applicable)"}</td><td>{quotation.currency} {amount(originalServiceTax)}</td><td>{quotation.currency} {amount(currentTax)}</td></tr>
                          <tr><td>Customs duties and charges</td><td>Not included</td><td>{!quotation.customsChargeRequested ? "Not requested" : customsChargeItem ? `${quotation.currency} ${amount(customsChargeItem.lineTotal)}` : "Requested — awaiting pricing"}</td></tr>
                          <tr><td>Additional transportation</td><td>Not included</td><td>{!quotation.transportChargeRequested ? "Not requested" : transportChargeItem ? `${quotation.currency} ${amount(transportChargeItem.lineTotal)}` : "Requested — awaiting pricing"}</td></tr>
                          {otherAdditionalItems.map((item) => <tr key={item.id}><td>{item.componentName}{item.reason ? ` — ${item.reason}` : ""}</td><td>Not included</td><td>{quotation.currency} {amount(item.lineTotal)}</td></tr>)}
                          {pricedAdditionalItems.filter((item) => String((item as typeof item & { itemType?: string }).itemType ?? "").toUpperCase() === "SUBTRACTION").map((item) => <tr key={item.id}><td>{item.componentName}{item.reason ? ` — ${item.reason}` : ""}</td><td>Bonus / deduction</td><td>−{quotation.currency} {amount(Math.abs(Number(item.lineTotal)))}</td></tr>)}
                          <tr className="summary-total"><td>Quotation total</td><td>{quotation.currency} {amount(originalServiceTotal)}</td><td>{quotation.currency} {amount(currentTotal)}</td></tr>
                          <tr><td>Change from original (including VAT)</td><td>—</td><td>{totalChangeAfterCharges > 0 ? "+" : totalChangeAfterCharges < 0 ? "−" : ""}{quotation.currency} {amount(Math.abs(totalChangeAfterCharges))}</td></tr>
                          {((quotation.customsChargeRequested && !customsChargeItem) || (quotation.transportChargeRequested && !transportChargeItem)) && (
                            <tr className="summary-note"><td colSpan={3}>One or more requested additional charges have not yet been priced. They are not included in the current saved quotation total.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-start gap-2 border-t border-slate-200 px-4 py-3 sm:px-5">
                      <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-700 print-hidden" />
                      <p className="text-xs leading-5 text-slate-600">{pricedAdditionalItems.length > 0 ? "The before figure uses the original quote pricing snapshot, preserving the price shown before additional charges were added." : "Additional services may be pending pricing. The current total changes only after an authorized user saves or removes a priced charge."}</p>
                    </div>
                  </section>
                )}
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
                <div className="quotation-print-footer flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-700">OGW KAY IMPEX · Quotation document</p><p className="mt-1 text-xs leading-5 text-slate-500">EXPORT &amp; IMPORT MANAGEMENT · Generated on {formatDate(new Date().toISOString())}</p></div>
                  <p className="text-xs font-semibold text-slate-500">Reference: {quoteReference}</p>
                </div>
              </footer>
            </div>
          </article>

          {/* Staff with charge-management permission can price additional charges even
              from the read-only quotation details route; other review controls stay hidden. */}
          {readOnly && canManageCharges && (
            <section className="print-hidden rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-1">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-800"><PackageCheck size={19} /></span>
                <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">Operations pricing</p><h2 className="mt-1 text-lg font-bold text-slate-950">Add requested charges</h2></div>
              </div>
              <p className="mt-2 text-sm leading-5 text-slate-600">You can record a new additional-service request even when it was not selected during the original quote. Entering a commercial invoice value activates customs assistance; transport can be requested separately.</p>
              <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <div>
                  <label htmlFor="readonly-invoice-assessment-value" className="block text-sm font-semibold text-slate-700">Commercial invoice value</label>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Entering a value greater than zero triggers the customs-assistance request.</p>
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_100px] gap-2">
                    <input id="readonly-invoice-assessment-value" type="number" min="0.01" step="0.01" inputMode="decimal" value={invoiceAssessmentValue} onChange={(event) => { const value = event.target.value; setInvoiceAssessmentValue(value); if (value.trim() && Number.isFinite(Number(value)) && Number(value) > 0) setCustomsRequestEnabled(true); }} disabled={busy} placeholder="Enter invoice value" className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                    <input aria-label="Invoice currency" maxLength={3} value={invoiceAssessmentCurrency} onChange={(event) => setInvoiceAssessmentCurrency(event.target.value.toUpperCase().slice(0, 3))} disabled={busy} placeholder="NGN" className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm uppercase outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${customsRequestEnabled ? "text-emerald-700" : "text-slate-500"}`}>{customsRequestEnabled ? "Customs assistance requested / will be saved" : "Customs assistance has not been requested"}</p>
                </div>
                <label className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={transportRequestEnabled} onChange={(event) => { if (event.target.checked) setTransportRequestEnabled(true); }} disabled={busy || quotation.transportChargeRequested} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500 disabled:opacity-60" />
                  <span>Request additional transportation pricing<span className="mt-1 block text-xs font-normal leading-5 text-slate-500">Use this for a request added after the quote was originally calculated.</span></span>
                </label>
              </div>
              {customsRequestEnabled && (
                <div className="mt-4">
                  <label htmlFor="readonly-customs-charge-amount" className="block text-sm font-semibold text-slate-700">Customs duties and charges ({quotation.currency})</label>
                  <p className="mt-1 text-xs text-slate-500">Commercial invoice: {quotation.invoiceValue != null ? `${quotation.invoiceCurrency || quotation.currency} ${amount(quotation.invoiceValue)}` : "Not supplied"}</p>
                  <input id="readonly-customs-charge-amount" type="number" min="0" step="0.01" inputMode="decimal" value={customsChargeAmount} onChange={(event) => setCustomsChargeAmount(event.target.value)} disabled={busy} placeholder="Enter customs charge" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                </div>
              )}
              {transportRequestEnabled && (
                <div className="mt-4">
                  <label htmlFor="readonly-transport-charge-amount" className="block text-sm font-semibold text-slate-700">Additional transportation charge ({quotation.currency})</label>
                  <input id="readonly-transport-charge-amount" type="number" min="0" step="0.01" inputMode="decimal" value={transportChargeAmount} onChange={(event) => setTransportChargeAmount(event.target.value)} disabled={busy} placeholder="Enter transport charge" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                </div>
              )}
              <button type="button" disabled={busy} onClick={() => { setFeedback(null); chargesMutation.mutate(); }} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50">
                {chargesMutation.isPending ? <LoaderCircle size={17} className="animate-spin" /> : <CheckCircle2 size={17} />} {chargesMutation.isPending ? "Saving and recalculating…" : "Save requests and recalculate VAT"}
              </button>
              {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`mt-3 rounded-xl p-3 text-sm ${feedback.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{feedback.text}</p>}
            </section>
          )}

          {!readOnly && <aside className="space-y-5 print-hidden">
            {feedback && <div role={feedback.type === "error" ? "alert" : "status"} className={`rounded-2xl border p-4 text-sm leading-6 ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{feedback.text}</div>}

            {canManageCharges && (
              <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-800"><PackageCheck size={19} /></span>
                  <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">Operations pricing</p><h2 className="mt-1 text-lg font-bold text-slate-950">Add requested charges</h2></div>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-600">Record an additional-service request if needed, then enter only confirmed operations prices. Saved prices are added to the same itemized quotation and applicable VAT is recalculated.</p>
                <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div>
                    <label htmlFor="invoice-assessment-value" className="block text-sm font-semibold text-slate-700">Commercial invoice value</label>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Entering a value greater than zero triggers the customs-assistance request.</p>
                    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_100px] gap-2">
                      <input id="invoice-assessment-value" type="number" min="0.01" step="0.01" inputMode="decimal" value={invoiceAssessmentValue} onChange={(event) => { const value = event.target.value; setInvoiceAssessmentValue(value); if (value.trim() && Number.isFinite(Number(value)) && Number(value) > 0) setCustomsRequestEnabled(true); }} disabled={busy} placeholder="Enter invoice value" className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                      <input aria-label="Invoice currency" maxLength={3} value={invoiceAssessmentCurrency} onChange={(event) => setInvoiceAssessmentCurrency(event.target.value.toUpperCase().slice(0, 3))} disabled={busy} placeholder="NGN" className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm uppercase outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                    </div>
                    <p className={`mt-2 text-xs font-semibold ${customsRequestEnabled ? "text-emerald-700" : "text-slate-500"}`}>{customsRequestEnabled ? "Customs assistance requested / will be saved" : "Customs assistance has not been requested"}</p>
                  </div>
                  <label className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={transportRequestEnabled} onChange={(event) => { if (event.target.checked) setTransportRequestEnabled(true); }} disabled={busy || quotation.transportChargeRequested} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500 disabled:opacity-60" />
                    <span>Request additional transportation pricing<span className="mt-1 block text-xs font-normal leading-5 text-slate-500">Use this for a request added after the quote was originally calculated.</span></span>
                  </label>
                </div>
                {customsRequestEnabled && (
                  <div className="mt-4">
                    <label htmlFor="customs-charge-amount" className="block text-sm font-semibold text-slate-700">Customs duties and charges ({quotation.currency})</label>
                    <p className="mt-1 text-xs text-slate-500">Invoice value: {quotation.invoiceValue != null ? `${quotation.invoiceCurrency || quotation.currency} ${amount(quotation.invoiceValue)}` : "Not supplied"}</p>
                    <input id="customs-charge-amount" type="number" min="0" step="0.01" inputMode="decimal" value={customsChargeAmount} onChange={(event) => setCustomsChargeAmount(event.target.value)} disabled={busy} placeholder="Enter customs charge" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                    <p className="mt-1 text-xs text-slate-500">Leave blank to leave this charge unchanged. Enter 0 only if the confirmed charge is zero.</p>
                  </div>
                )}
                {transportRequestEnabled && (
                  <div className="mt-4">
                    <label htmlFor="transport-charge-amount" className="block text-sm font-semibold text-slate-700">Additional transportation charge ({quotation.currency})</label>
                    <input id="transport-charge-amount" type="number" min="0" step="0.01" inputMode="decimal" value={transportChargeAmount} onChange={(event) => setTransportChargeAmount(event.target.value)} disabled={busy} placeholder="Enter transport charge" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60" />
                    <p className="mt-1 text-xs text-slate-500">Leave blank to leave this charge unchanged. Enter 0 only if the confirmed charge is zero.</p>
                  </div>
                )}
                <button type="button" disabled={busy} onClick={() => { setFeedback(null); chargesMutation.mutate(); }} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50">
                  {chargesMutation.isPending ? <LoaderCircle size={17} className="animate-spin" /> : <CheckCircle2 size={17} />} {chargesMutation.isPending ? "Saving and recalculating…" : "Save requests and recalculate VAT"}
                </button>
              </section>
            )}

            <AdminAdditionalChargesManager
              submissionId={quotation.id}
              quoteNumber={quotation.quote?.quoteNumber ?? quotation.id}
              currency={quotation.currency}
              items={quotation.items ?? []}
              canManageCharges={canManageCharges}
              isAdmin={user?.role === "ADMIN"}
              onRefresh={refreshQuotations}
              onDeleted={() => navigate("/quotations")}
              onFeedback={(type, text) => setFeedback({ type, text })}
            />

            <QuotationAdditionalHistoryCard submissionId={quotation.id} audience="admin" currency={quotation.currency} />

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