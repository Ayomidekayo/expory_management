import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import {
  addAdminAdditionalCharge,
  addAdminSubtraction,
  deleteAdminAdditionalCharge,
  deleteAdminQuotationCompletely,
  editAdminAdditionalCharge,
  type AdminQuotationItem,
} from "./api/admin-quotations.api";

type Props = {
  submissionId: string;
  quoteNumber: string;
  currency: string;
  items: AdminQuotationItem[];
  canManageCharges: boolean;
  isAdmin: boolean;
  onRefresh: () => Promise<unknown> | void;
  onDeleted: () => void;
  onFeedback?: (type: "success" | "error", message: string) => void;
};

type ConfirmationState =
  | { kind: "apply-deduction" }
  | {
      kind: "delete-charge";
      chargeId: string;
      itemName: string;
      amountLabel: string;
    }
  | { kind: "delete-quotation" };

const money = (value: unknown) =>
  new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0) || 0);

export default function AdminAdditionalChargesManager({
  submissionId,
  quoteNumber,
  currency,
  items,
  canManageCharges,
  isAdmin,
  onRefresh,
  onDeleted,
  onFeedback,
}: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [deductionAmount, setDeductionAmount] = useState("");
  const [deductionReason, setDeductionReason] = useState("");
  const [deductionName, setDeductionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editReason, setEditReason] = useState("");
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);

  const cancelConfirmationRef = useRef<HTMLButtonElement | null>(null);

  const resetAddForm = () => {
    setName("");
    setAmount("");
    setReason("");
  };

  const resetEditForm = () => {
    setEditingId(null);
    setEditName("");
    setEditAmount("");
    setEditReason("");
  };

  const resetDeductionForm = () => {
    setDeductionName("");
    setDeductionAmount("");
    setDeductionReason("");
  };

  useEffect(() => {
    resetAddForm();
    resetEditForm();
    resetDeductionForm();
    setConfirmation(null);
    setLocalError("");
    setLocalSuccess("");
    // A reused detail component must not carry unsaved values into another quote.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const additionalItems = items.filter(
    (item) => String(item.itemType ?? "SERVICE").toUpperCase() !== "SERVICE",
  );

  const notifySuccess = async (message: string) => {
    setLocalError("");
    setLocalSuccess(message);
    onFeedback?.("success", message);

    // These custom events refresh the existing quotation history and notification UI.
    window.dispatchEvent(new Event("quotation-history:refresh"));
    window.dispatchEvent(new Event("quotation-notifications:refresh"));
    await onRefresh();
  };

  const notifyError = (error: unknown, fallback: string) => {
    const message = error instanceof Error ? error.message : fallback;
    setLocalError(message);
    setLocalSuccess("");
    onFeedback?.("error", message);
  };

  const addMutation = useMutation({
    mutationFn: () => {
      const numericAmount = Number(amount);
      if (name.trim().length < 2 || name.trim().length > 120) {
        throw new Error("Enter a charge name between 2 and 120 characters.");
      }
      if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error("Enter an amount greater than zero.");
      }
      if (reason.trim().length > 1000) {
        throw new Error("The reason must not exceed 1,000 characters.");
      }
      return addAdminAdditionalCharge(submissionId, {
        name: name.trim(),
        amount: numericAmount,
        reason: reason.trim() || undefined,
      });
    },
    onSuccess: async () => {
      resetAddForm();
      await notifySuccess(
        "Additional charge added. The total and VAT have been recalculated.",
      );
    },
    onError: (error) => notifyError(error, "Could not add this charge."),
  });

  const editMutation = useMutation({
    mutationFn: () => {
      const numericAmount = Number(editAmount);
      if (!editingId) throw new Error("Choose a charge to edit.");
      if (editName.trim().length < 2 || editName.trim().length > 120) {
        throw new Error("Enter a charge name between 2 and 120 characters.");
      }
      if (!editAmount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error("Enter an amount greater than zero.");
      }
      if (editReason.trim().length > 1000) {
        throw new Error("The reason must not exceed 1,000 characters.");
      }
      return editAdminAdditionalCharge(submissionId, editingId, {
        name: editName.trim(),
        amount: numericAmount,
        reason: editReason.trim() || undefined,
      });
    },
    onSuccess: async () => {
      resetEditForm();
      await notifySuccess(
        "Additional charge updated. The total and VAT have been recalculated.",
      );
    },
    onError: (error) => notifyError(error, "Could not update this charge."),
  });

  const subtractionMutation = useMutation({
    mutationFn: () => {
      const numericAmount = Number(deductionAmount);
      if (!deductionAmount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw new Error("Enter a reduction amount greater than zero.");
      }
      if (deductionReason.trim().length < 3 || deductionReason.trim().length > 1000) {
        throw new Error("Provide a reason between 3 and 1,000 characters.");
      }
      if (deductionName.trim().length < 2 || deductionName.trim().length > 120) {
        throw new Error("Enter a short adjustment name.");
      }
      return addAdminSubtraction(submissionId, {
        name: deductionName.trim(),
        amount: numericAmount,
        reason: deductionReason.trim(),
      });
    },
    onSuccess: async () => {
      resetDeductionForm();
      await notifySuccess(
        "Bonus / deduction applied. The subtotal, VAT and current total have been recalculated.",
      );
    },
    onError: (error) => notifyError(error, "Could not apply this reduction."),
  });

  const deleteMutation = useMutation({
    mutationFn: (chargeId: string) =>
      deleteAdminAdditionalCharge(submissionId, chargeId),
    onSuccess: async () => {
      resetEditForm();
      await notifySuccess("Charge removed. The total and VAT have been recalculated.");
    },
    onError: (error) => notifyError(error, "Could not delete this charge."),
  });

  const quoteDeleteMutation = useMutation({
    mutationFn: () => deleteAdminQuotationCompletely(submissionId),
    onSuccess: () => onDeleted(),
    onError: (error) => notifyError(error, "Could not delete the quotation."),
  });

  const busy =
    addMutation.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending ||
    quoteDeleteMutation.isPending ||
    subtractionMutation.isPending;

  useEffect(() => {
    if (!confirmation) return;

    cancelConfirmationRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setConfirmation(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmation, busy]);

  const startEdit = (item: AdminQuotationItem) => {
    setEditingId(item.id);
    setEditName(item.componentName);
    setEditAmount(String(item.lineTotal));
    setEditReason(item.reason ?? "");
    setLocalError("");
    setLocalSuccess("");
  };

  const closeConfirmation = () => {
    if (!busy) setConfirmation(null);
  };

  const confirmPendingAction = () => {
    if (!confirmation || busy) return;

    const action = confirmation;
    setConfirmation(null);
    setLocalError("");
    setLocalSuccess("");

    if (action.kind === "apply-deduction") {
      subtractionMutation.mutate();
      return;
    }

    if (action.kind === "delete-charge") {
      deleteMutation.mutate(action.chargeId);
      return;
    }

    quoteDeleteMutation.mutate();
  };

  const confirmationContent = (() => {
    if (!confirmation) return null;

    switch (confirmation.kind) {
      case "apply-deduction":
        return {
          icon: AlertTriangle,
          tone: "amber" as const,
          title: "Confirm quotation adjustment",
          description: `Apply ${currency} ${money(deductionAmount)} as “${deductionName.trim()}” to ${quoteNumber}? The reason will be recorded in the quotation history, and the current subtotal, VAT and total will be recalculated.`,
          confirmLabel: "Apply adjustment",
        };
      case "delete-charge":
        return {
          icon: Trash2,
          tone: "rose" as const,
          title: "Remove this charge?",
          description: `You are about to remove “${confirmation.itemName}” (${confirmation.amountLabel}). The current quotation total will be recalculated. Original selected services and the original quote will remain unchanged.`,
          confirmLabel: "Remove charge",
        };
      case "delete-quotation":
        return {
          icon: ShieldAlert,
          tone: "rose" as const,
          title: "Permanently delete quotation?",
          description: `You are about to permanently delete quotation ${quoteNumber}, including its submissions and related quotation messages, attachment records, notifications and audit records. This action cannot be undone.`,
          confirmLabel: "Permanently delete",
        };
    }
  })();

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-800">
              Charge management
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-950">
              Additional charges &amp; adjustments
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Manage extra fees, customs and transport pricing, or apply an auditable
              reduction/bonus. Changes recalculate the current subtotal, VAT and total
              while preserving the original quote.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
            <span>{additionalItems.length}</span> additional line
            {additionalItems.length === 1 ? "" : "s"}
          </span>
        </div>

        {localError && (
          <div role="alert" className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-5 text-rose-800">
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            <span>{localError}</span>
          </div>
        )}
        {localSuccess && (
          <div role="status" className="mt-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-5 text-emerald-900">
            <Check size={17} className="mt-0.5 shrink-0" />
            <span>{localSuccess}</span>
          </div>
        )}

        {canManageCharges && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setLocalError("");
              setLocalSuccess("");
              addMutation.mutate();
            }}
            className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <h3 className="text-sm font-extrabold text-slate-800">Add a charge</h3>
            </div>
            <label className="block text-sm font-semibold text-slate-700">
              Charge name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={120}
                disabled={busy}
                required
                placeholder="e.g. Documentation fee"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Amount ({currency})
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                disabled={busy}
                required
                placeholder="0.00"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
              Reason <span className="font-normal text-slate-400">(optional)</span>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={1000}
                rows={2}
                disabled={busy}
                placeholder="Explain why this fee applies…"
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
              <p className="text-xs text-slate-500">The charge will be visible in the quotation breakdown.</p>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
              >
                {addMutation.isPending ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}
                {addMutation.isPending ? "Adding charge…" : "Add charge"}
              </button>
            </div>
          </form>
        )}

        {canManageCharges && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setLocalError("");
              setLocalSuccess("");
              setConfirmation({ kind: "apply-deduction" });
            }}
            className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-700" />
                <div>
                  <h3 className="text-sm font-extrabold text-amber-950">Apply a reduction / bonus</h3>
                  <p className="mt-1 text-xs leading-5 text-amber-900/80">
                    This subtracts the amount from the current subtotal before VAT is
                    recalculated. A reason is required for the audit trail. It cannot
                    reduce the subtotal below zero.
                  </p>
                </div>
              </div>
            </div>
            <label className="block text-sm font-semibold text-slate-700">
              Adjustment label
              <input
                value={deductionName}
                onChange={(event) => setDeductionName(event.target.value)}
                maxLength={120}
                disabled={busy}
                required
                placeholder="e.g. Courtesy bonus"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:opacity-60"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Amount to subtract ({currency})
              <input
                value={deductionAmount}
                onChange={(event) => setDeductionAmount(event.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                disabled={busy}
                required
                placeholder="0.00"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:opacity-60"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700 md:col-span-2">
              Reason <span className="text-rose-600">(required)</span>
              <textarea
                value={deductionReason}
                onChange={(event) => setDeductionReason(event.target.value)}
                maxLength={1000}
                rows={2}
                disabled={busy}
                required
                minLength={3}
                placeholder="e.g. Courtesy bonus approved by operations…"
                className="mt-1.5 w-full resize-y rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:opacity-60"
              />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
              <p className="text-xs text-amber-900/80">
                A negative line item and history event will be stored. No original quote amount is overwritten.
              </p>
              <button
                type="submit"
                disabled={busy || !deductionAmount.trim() || deductionReason.trim().length < 3 || deductionName.trim().length < 2}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-800 disabled:opacity-50"
              >
                {subtractionMutation.isPending ? <LoaderCircle size={16} className="animate-spin" /> : <AlertTriangle size={16} />}
                Review reduction
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 space-y-3">
          {additionalItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-7 text-center">
              <p className="text-sm font-bold text-slate-700">No additional charge lines yet</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Customs and transport lines appear here once priced. You can also add a named charge above.
              </p>
            </div>
          ) : (
            additionalItems.map((item) => {
              const kind = String(item.itemType ?? "").toUpperCase();
              const isOther = kind === "OTHER_CHARGE";
              const isEditing = editingId === item.id;

              return (
                <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                  {isEditing && isOther ? (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        editMutation.mutate();
                      }}
                      className="grid grid-cols-1 gap-3 md:grid-cols-2"
                    >
                      <label className="text-sm font-semibold text-slate-700">
                        Charge name
                        <input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          maxLength={120}
                          required
                          disabled={busy}
                          className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                        />
                      </label>
                      <label className="text-sm font-semibold text-slate-700">
                        Amount ({currency})
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          inputMode="decimal"
                          value={editAmount}
                          onChange={(event) => setEditAmount(event.target.value)}
                          required
                          disabled={busy}
                          className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                        />
                      </label>
                      <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                        Reason <span className="font-normal text-slate-400">(optional)</span>
                        <textarea
                          rows={2}
                          maxLength={1000}
                          value={editReason}
                          onChange={(event) => setEditReason(event.target.value)}
                          disabled={busy}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                        />
                      </label>
                      <div className="flex flex-wrap gap-2 md:col-span-2">
                        <button
                          type="submit"
                          disabled={busy}
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
                        >
                          {editMutation.isPending ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
                          {editMutation.isPending ? "Saving…" : "Save edit"}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={resetEditForm}
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
                        >
                          <X size={15} /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words text-sm font-extrabold text-slate-900">{item.componentName}</h3>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                            {kind === "CUSTOMS_CHARGE"
                              ? "Customs"
                              : kind === "TRANSPORT_CHARGE"
                                ? "Transport"
                                : kind === "SUBTRACTION"
                                  ? "Deduction / bonus"
                                  : "Custom charge"}
                          </span>
                        </div>
                        {item.reason && (
                          <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-5 text-slate-500">{item.reason}</p>
                        )}
                        <p className={`mt-2 text-sm font-extrabold tabular-nums ${kind === "SUBTRACTION" ? "text-amber-800" : "text-slate-950"}`}>
                          {kind === "SUBTRACTION"
                            ? `− ${currency} ${money(Math.abs(Number(item.lineTotal)))}`
                            : `${currency} ${money(item.lineTotal)}`}
                        </p>
                      </div>
                      {canManageCharges && (
                        <div className="flex shrink-0 flex-wrap gap-2">
                          {isOther && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => startEdit(item)}
                              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setConfirmation({
                                kind: "delete-charge",
                                chargeId: item.id,
                                itemName: item.componentName,
                                amountLabel:
                                  kind === "SUBTRACTION"
                                    ? `reduction of ${currency} ${money(Math.abs(Number(item.lineTotal)))}`
                                    : `${currency} ${money(item.lineTotal)}`,
                              })
                            }
                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                          >
                            {deleteMutation.isPending ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {isAdmin && (
          <div className="mt-6 border-t border-rose-100 pt-5">
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <AlertTriangle className="mt-0.5 shrink-0 text-rose-700" size={19} />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-extrabold text-rose-900">Permanently delete quotation</h3>
                <p className="mt-1 text-xs leading-5 text-rose-800">
                  This is separate from deleting a charge. It removes quote <strong>{quoteNumber}</strong>, all submissions attached to that quote, and related quotation messages, attachment records, notifications, and audit events. This cannot be undone.
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmation({ kind: "delete-quotation" })}
                  className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-rose-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-rose-800 disabled:opacity-50"
                >
                  {quoteDeleteMutation.isPending ? <LoaderCircle size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  Delete entire quotation
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {confirmationContent && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[3px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeConfirmation();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quotation-confirmation-title"
            aria-describedby="quotation-confirmation-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/25"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                    confirmationContent.tone === "rose"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <confirmationContent.icon size={21} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="quotation-confirmation-title" className="text-base font-extrabold text-slate-950">
                    {confirmationContent.title}
                  </h2>
                  <p id="quotation-confirmation-description" className="mt-2 break-words text-sm leading-6 text-slate-600">
                    {confirmationContent.description}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close confirmation"
                  onClick={closeConfirmation}
                  disabled={busy}
                  className="-mr-1 -mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                ref={cancelConfirmationRef}
                type="button"
                onClick={closeConfirmation}
                disabled={busy}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPendingAction}
                disabled={busy}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmationContent.tone === "rose"
                    ? "bg-rose-700 hover:bg-rose-800"
                    : "bg-amber-700 hover:bg-amber-800"
                }`}
              >
                {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}
                {busy ? "Processing…" : confirmationContent.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
