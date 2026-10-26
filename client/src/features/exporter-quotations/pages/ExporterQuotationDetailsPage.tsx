
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowLeftRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CalendarDays,
  FileCheck2,
  FileText,
  Hash,
  LoaderCircle,
  MessageSquare,
  Package,
  Paperclip,
  Plane,
  Ship,
  Truck,
  Send,
  ShieldCheck,
  Upload,
  Weight,
  X,
} from "lucide-react";

import { useMySubmission } from "../hook/use-exporter-quotations";
import {
  sendExporterMessage,
  uploadExporterAttachment,
  type QuotationStatus,
} from "../api/exporter-quotations.api";

type ToastState = {
  id: number;
  type: "success" | "error" | "info";
  title: string;
  message: string;
} | null;

const statusStyles: Record<QuotationStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-800 ring-amber-200",
  CHANGES_REQUESTED: "bg-orange-50 text-orange-800 ring-orange-200",
  APPROVED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-800 ring-red-200",
  IN_PROGRESS: "bg-blue-50 text-blue-800 ring-blue-200",
  COMPLETED: "bg-green-50 text-green-800 ring-green-200",
  ARCHIVED: "bg-slate-100 text-slate-700 ring-slate-200",
};

const dateLabel = (value?: string | Date | null) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const money = (value: string | number, currency: string) => {
  const amount = Number(value);
  const code = currency === "CFA" ? "XOF" : currency || "NGN";

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${code} ${
      Number.isFinite(amount) ? amount.toLocaleString() : "0"
    }`;
  }
};

const humanize = (value?: string | null, fallback = "Not provided") => {
  if (!value?.trim()) return fallback;
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

function Toast({
  toast,
  onClose,
}: {
  toast: NonNullable<ToastState>;
  onClose: () => void;
}) {
  const styles = {
    success: {
      icon: CheckCircle2,
      panel: "border-emerald-200 bg-white",
      iconBg: "bg-emerald-100 text-emerald-700",
      title: "text-emerald-900",
    },
    error: {
      icon: CircleAlert,
      panel: "border-red-200 bg-white",
      iconBg: "bg-red-100 text-red-700",
      title: "text-red-900",
    },
    info: {
      icon: Clock3,
      panel: "border-blue-200 bg-white",
      iconBg: "bg-blue-100 text-blue-700",
      title: "text-blue-900",
    },
  }[toast.type];

  const Icon = styles.icon;

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      aria-live={toast.type === "error" ? "assertive" : "polite"}
      className={`quotation-toast-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-emerald-950/10 ${styles.panel}`}
    >
      <div className={`rounded-xl p-2 ${styles.iconBg}`}>
        <Icon size={21} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-bold ${styles.title}`}>
          {toast.title}
        </p>
        <p className="mt-1 text-sm leading-5 text-slate-600">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  accent = "emerald",
}: {
  icon: typeof Package;
  label: string;
  value: string;
  accent?: "emerald" | "blue" | "amber";
}) {
  const accents = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="quotation-info-card flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-950/[0.04]">
      <div className={`shrink-0 rounded-xl p-2.5 ${accents[accent]}`}>
        <Icon size={19} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ExporterQuotationDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useMySubmission(id);

  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [toast, setToast] = useState<ToastState>(null);

  const notify = (
    type: NonNullable<ToastState>["type"],
    title: string,
    messageText: string,
  ) => {
    setToast({
      id: Date.now(),
      type,
      title,
      message: messageText,
    });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast((current) =>
        current?.id === toast.id ? null : current,
      );
    }, toast.type === "error" ? 6500 : 4500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const refreshDetails = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["exporter", "quotations", id],
      }),
      queryClient.invalidateQueries({
        queryKey: ["exporter", "quotations"],
      }),
    ]);
  };

  const messageMutation = useMutation({
    mutationFn: () => sendExporterMessage(id, message.trim()),

    onSuccess: async () => {
      setMessage("");

      notify(
        "success",
        "Message sent successfully",
        "Your message has been delivered to the quotation review team.",
      );

      await refreshDetails();
    },

    onError: () => {
      notify(
        "error",
        "Message not sent",
        "We could not send your message. Your text is still available to retry.",
      );
    },
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Choose a document first.");
      return uploadExporterAttachment(id, file, remarks);
    },

    onSuccess: async () => {
      setFile(null);
      setRemarks("");

      const fileInput = document.getElementById(
        "quotation-file",
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";

      notify(
        "success",
        "Document uploaded",
        "Your supporting document has been uploaded successfully.",
      );

      await refreshDetails();
    },

    onError: () => {
      notify(
        "error",
        "Upload unsuccessful",
        "The document could not be uploaded. Please check your connection and try again.",
      );
    },
  });

  if (isLoading) {
    return (
      <main className="flex min-h-96 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-50 px-4">
        <div className="quotation-page-enter flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-emerald-950/[0.05]">
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
            <LoaderCircle size={30} className="animate-spin" />
          </div>
          <div>
            <p className="font-bold text-slate-800">
              Loading quotation details
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we retrieve your submission.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-96 bg-gradient-to-br from-emerald-50 to-slate-50 px-4 py-12">
        <div className="quotation-page-enter mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-950/[0.04]">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <CircleAlert size={27} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load quotation
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We could not retrieve this submission. Please try again or return
            to your quotation list.
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            Try again
          </button>

          <div>
            <Link
              to="/exporter/quotations"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              <ArrowLeft size={16} />
              Back to quotations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const quote = data.quote;
  const messages = data.messages ?? [];
  const attachments = data.attachments ?? [];
  const selectedItems = (data.items ?? []).filter(
    (item) => item.isSelected,
  );
  const shipmentMode = String(quote?.rateCard?.mode ?? "").toUpperCase();
  const ShipmentModeIcon =
    shipmentMode === "AIR" ? Plane : shipmentMode === "LAND" ? Truck : shipmentMode === "SEA" ? Ship : Package;
  const shipmentModeLabel =
    shipmentMode === "AIR"
      ? "Air freight"
      : shipmentMode === "LAND"
        ? "Land transport"
        : shipmentMode === "SEA"
          ? "Sea freight"
          : humanize(shipmentMode, "Not specified");
  const shipmentOptionLabel = quote?.rateCard?.name || "Not specified";
  const shipmentDirectionLabel = humanize(quote?.rateCard?.direction, "Not specified");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_#e5f7ec_0%,_#f5faf7_38%,_#f8fafc_100%)] px-3 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-10">
      <style>{`
        @keyframes quotationFadeUp {
          from { opacity: 0; transform: translate3d(0, 14px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes quotationToastIn {
          from { opacity: 0; transform: translate3d(18px, -8px, 0) scale(.98); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes quotationStatusPulse {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; }
          50% { box-shadow: 0 0 0 4px transparent; }
        }
        .quotation-page-enter { animation: quotationFadeUp .55s cubic-bezier(.2,.7,.2,1) both; }
        .quotation-section-enter { animation: quotationFadeUp .6s cubic-bezier(.2,.7,.2,1) both; }
        .quotation-delay-1 { animation-delay: .06s; }
        .quotation-delay-2 { animation-delay: .13s; }
        .quotation-delay-3 { animation-delay: .20s; }
        .quotation-toast-enter { animation: quotationToastIn .24s ease-out both; }
        .quotation-status-dot { animation: quotationStatusPulse 2.2s ease-in-out infinite; }
        .quotation-info-card { transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
        @media (prefers-reduced-motion: reduce) {
          .quotation-page-enter, .quotation-section-enter, .quotation-toast-enter, .quotation-status-dot { animation: none !important; }
          .quotation-info-card, .quotation-info-card * { transition: none !important; }
        }
      `}</style>
      {/* Toast notifications */}
      <div className="pointer-events-none fixed right-3 top-3 z-[100] flex w-[calc(100%-1.5rem)] flex-col items-end gap-3 sm:right-6 sm:top-6 sm:w-auto">
        {toast && (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      <div className="quotation-page-enter mx-auto max-w-6xl space-y-6">
        <Link
          to="/exporter/quotations"
          className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-100 bg-white/80 px-3.5 py-2 text-sm font-semibold text-emerald-900 shadow-sm shadow-emerald-950/[0.02] transition duration-200 hover:-translate-x-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
        >
          <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-0.5" />
          My quotations
        </Link>

        {/* Quotation overview */}
        <section className="quotation-section-enter overflow-hidden rounded-[1.75rem] border border-emerald-100/90 bg-white shadow-xl shadow-emerald-950/[0.045]">
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800 p-5 text-white sm:p-8 lg:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border border-white/[0.08]" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-14 size-52 rounded-full border border-white/[0.08]" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-[-5rem] right-[22%] size-40 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-50 backdrop-blur-sm">
                  <FileCheck2 size={14} aria-hidden="true" />
                  Quotation details
                </div>

                <h1 className="mt-4 break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {quote?.quoteNumber ?? "Quotation reference unavailable"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100/90">
                  Review your shipment information, communicate with the quotation team, and manage supporting documents in one place.
                </p>

                <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-emerald-100/80">
                  <CalendarDays size={14} aria-hidden="true" />
                  Submitted {dateLabel(data.submittedAt)}
                </p>
              </div>

              <span
                className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-extrabold ring-1 ring-inset shadow-sm ${
                  statusStyles[data.status] ??
                  "bg-slate-100 text-slate-700 ring-slate-200"
                }`}
                aria-label={`Quotation status: ${humanize(data.status)}`}
              >
                <span className="quotation-status-dot size-2 rounded-full bg-current" />
                {humanize(data.status)}
              </span>
            </div>

            <div className="relative mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm transition duration-200 hover:bg-white/[0.12]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/75">Mode of shipment</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100"><ShipmentModeIcon size={19} aria-hidden="true" /></span>
                  <p className="min-w-0 break-words text-sm font-bold text-white">{shipmentModeLabel}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm transition duration-200 hover:bg-white/[0.12]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/75">Shipment option</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100"><Package size={19} aria-hidden="true" /></span>
                  <p className="min-w-0 break-words text-sm font-bold text-white">{shipmentOptionLabel}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm transition duration-200 hover:bg-white/[0.12]">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/75">Direction</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100"><ArrowLeftRight size={19} aria-hidden="true" /></span>
                  <p className="min-w-0 break-words text-sm font-bold text-white">{shipmentDirectionLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-50 bg-gradient-to-b from-white to-emerald-50/20 p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-emerald-600" aria-hidden="true" />
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900">Shipment information</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            <InfoCard
              icon={Package}
              label="Cargo description"
              value={quote?.goodsDescription || "Not provided"}
            />

            <InfoCard
              icon={Hash}
              label="HS code"
              value={quote?.hsCode || "Not provided"}
              accent="blue"
            />

            <InfoCard
              icon={Weight}
              label="Shipment weight"
              value={
                quote?.weightKg != null
                  ? `${quote.weightKg} kg`
                  : "Not specified"
              }
              accent="amber"
            />

            <InfoCard
              icon={ShieldCheck}
              label="Selected services"
              value={`${selectedItems.length} service${
                selectedItems.length === 1 ? "" : "s"
              } requested`}
            />
            </div>
          </div>

          <div className="px-5 pb-5 sm:px-8 sm:pb-8">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm shadow-emerald-950/[0.03] sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Current quotation total
                  </p>
                  <p className="mt-2 break-words text-3xl font-bold tracking-tight text-emerald-800 sm:text-4xl">
                    {money(data.totalAmount, data.currency)}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    This amount is based on your submitted quotation and may
                    change if revisions are requested.
                  </p>
                </div>

                <div className="flex size-14 shrink-0 items-center justify-center self-start rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm transition duration-300 hover:rotate-3 hover:scale-105 sm:self-center">
                  <FileCheck2 size={27} />
                </div>
              </div>
            </div>
          </div>

          {data.status === "CHANGES_REQUESTED" && (
            <div className="mx-5 mb-5 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 sm:mx-8 sm:mb-8">
              <CircleAlert
                className="mt-0.5 shrink-0 text-orange-700"
                size={21}
              />
              <div>
                <p className="font-bold text-orange-900">
                  Changes requested
                </p>
                <p className="mt-1 text-sm leading-6 text-orange-800">
                  Review the administrator's message below and provide the
                  requested information or documents.
                </p>
              </div>
            </div>
          )}

          {data.adminMessage && (
            <div className="mx-5 mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:mx-8 sm:mb-8">
              <div className="flex items-center gap-2 text-blue-800">
                <MessageSquare size={18} />
                <p className="text-sm font-bold">Latest admin message</p>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                {data.adminMessage}
              </p>
            </div>
          )}
        </section>

        {/* Conversation */}
        <section className="quotation-section-enter quotation-delay-1 rounded-3xl border border-emerald-100/90 bg-white p-5 shadow-lg shadow-emerald-950/[0.035] transition duration-300 hover:shadow-xl hover:shadow-emerald-950/[0.05] sm:p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-800">
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Conversation
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Communicate directly with the quotation review team.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
                <MessageSquare
                  className="mx-auto text-slate-400"
                  size={28}
                />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No messages yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Your conversation will appear here.
                </p>
              </div>
            ) : (
              messages.map((item) => {
                const isExporter = item.senderType === "EXPORTER";

                return (
                  <article
                    key={item.id}
                    className={`quotation-info-card rounded-2xl border p-4 sm:p-5 ${
                      isExporter
                        ? "border-emerald-100 bg-emerald-50/70 sm:ml-10"
                        : "border-blue-100 bg-blue-50/50 sm:mr-10"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex size-9 items-center justify-center rounded-xl ${
                            isExporter
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isExporter ? (
                            <Package size={17} />
                          ) : (
                            <ShieldCheck size={17} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {isExporter ? "You" : "Quotation team"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {isExporter ? "Exporter" : "Administrator"}
                          </p>
                        </div>
                      </div>

                      <time className="text-xs text-slate-500">
                        {dateLabel(item.createdAt)}
                      </time>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                      {item.message}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          <form
            className="mt-6 border-t border-slate-100 pt-6"
            onSubmit={(event) => {
              event.preventDefault();

              if (!message.trim() || messageMutation.isPending) return;

              messageMutation.mutate();
            }}
          >
            <label
              htmlFor="quotation-message"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              Write a message
            </label>

            <textarea
              id="quotation-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              maxLength={5000}
              placeholder="Ask a question or provide additional information..."
              required
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                {message.length}/5000 characters
              </p>

              <button
                type="submit"
                disabled={!message.trim() || messageMutation.isPending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-green-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition duration-200 hover:-translate-y-0.5 hover:from-emerald-800 hover:to-green-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {messageMutation.isPending ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Send size={17} />
                )}
                {messageMutation.isPending
                  ? "Sending message..."
                  : "Send message"}
              </button>
            </div>
          </form>
        </section>

        {/* Documents */}
        <section className="quotation-section-enter quotation-delay-2 rounded-3xl border border-emerald-100/90 bg-white p-5 shadow-lg shadow-emerald-950/[0.035] transition duration-300 hover:shadow-xl hover:shadow-emerald-950/[0.05] sm:p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-800">
              <Paperclip size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Documents
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Upload supporting documents and access previously shared files.
              </p>
            </div>
          </div>

          <form
            className="mt-6 rounded-2xl border border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50/80 to-white p-4 transition-colors duration-200 hover:border-emerald-400 sm:p-6"
            onSubmit={(event) => {
              event.preventDefault();

              if (!file || uploadMutation.isPending) return;

              uploadMutation.mutate();
            }}
          >
            <label
              htmlFor="quotation-file"
              className="block text-sm font-bold text-slate-800"
            >
              Select a document
            </label>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              <input
                id="quotation-file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(event) =>
                  setFile(event.target.files?.[0] ?? null)
                }
                className="block w-full text-sm text-slate-600 file:mr-3 file:min-h-10 file:cursor-pointer file:rounded-xl file:border-0 file:bg-emerald-100 file:px-4 file:py-2.5 file:font-bold file:text-emerald-800 file:transition hover:file:bg-emerald-200"
              />

              {file && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50 p-3">
                  <FileText
                    className="mt-0.5 shrink-0 text-emerald-700"
                    size={19}
                  />
                  <div className="min-w-0">
                    <p className="break-all text-sm font-semibold text-slate-800">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      const input = document.getElementById(
                        "quotation-file",
                      ) as HTMLInputElement | null;
                      if (input) input.value = "";
                    }}
                    aria-label="Remove selected document"
                    className="ml-auto rounded-lg p-1 text-slate-500 hover:bg-white hover:text-red-600"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}
            </div>

            <label
              htmlFor="quotation-file-remarks"
              className="mt-5 block text-sm font-bold text-slate-800"
            >
              Document description
              <span className="font-normal text-slate-500"> (optional)</span>
            </label>

            <input
              id="quotation-file-remarks"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              maxLength={500}
              placeholder="e.g. Updated packing list"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />

            <button
              type="submit"
              disabled={!file || uploadMutation.isPending}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-green-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition duration-200 hover:-translate-y-0.5 hover:from-emerald-800 hover:to-green-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
            >
              {uploadMutation.isPending ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Upload size={17} />
              )}
              {uploadMutation.isPending
                ? "Uploading document..."
                : "Upload document"}
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-800">
              Shared documents
            </h3>

            <div className="mt-3 space-y-3">
              {attachments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <FileText
                    className="mx-auto text-slate-400"
                    size={27}
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No documents shared yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Uploaded documents will appear here.
                  </p>
                </div>
              ) : (
                attachments.map((attachment) => (
                  <article
                    key={attachment.id}
                    className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="shrink-0 rounded-xl bg-emerald-50 p-3 text-emerald-700">
                        <FileText size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="break-all text-sm font-bold text-slate-800">
                          {attachment.originalName || attachment.fileName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Uploaded by{" "}
                          {attachment.uploadedByType
                            ? attachment.uploadedByType.toLowerCase()
                            : "unknown"}
                          {" · "}
                          {dateLabel(attachment.createdAt)}
                        </p>

                        {attachment.remarks && (
                          <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                            {attachment.remarks}
                          </p>
                        )}
                      </div>
                    </div>

                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                    >
                      <FileText size={16} />
                      Open document
                    </a>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
