
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Lock,
  LockKeyhole,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Truck,
  Trash2,
  Unlock,
  Wallet,
  X,
  Container,
} from "lucide-react";
import { toast } from "sonner";

import { useTransitMovement } from "../../hooks/transit-movement/useTransitMovements";

import {
  createTransitMovementPayment,
  deleteTransitMovement,
  updateTransitMovementItemLock,
} from "../../api/transit-movement.api";

import type {
  TransitMovementItem,
  TransitMovementPaymentPayload,
  Currency,
} from "../../types/transit-movement";

const currencyFormatter = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusStyles: Record<string, string> = {
  UNPAID: "bg-red-50 text-red-700 border-red-200",
  ADVANCE: "bg-amber-50 text-amber-700 border-amber-200",
  PARTIALLY_PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusLabel: Record<string, string> = {
  UNPAID: "Unpaid",
  ADVANCE: "Advance",
  PARTIALLY_PAID: "Partially paid",
  PAID: "Paid",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        statusStyles[status] ?? "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {statusLabel[status] ?? status}
    </span>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  color: "green" | "blue" | "amber" | "purple";
}) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function TransitMovementDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const movementQuery = useTransitMovement(id ?? "");
  const movement = movementQuery.data;

  const [paymentItem, setPaymentItem] =
    useState<TransitMovementItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] =
    useState<"ADVANCE" | "REGULAR">("REGULAR");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");

  const paymentMutation = useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: TransitMovementPaymentPayload;
    }) => createTransitMovementPayment(itemId, payload),

    onSuccess: async () => {
      toast.success("Payment recorded successfully.");
      setPaymentItem(null);
      resetPaymentForm();

      await queryClient.invalidateQueries({
        queryKey: ["transit-movements"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to record payment.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (movementId: string) => deleteTransitMovement(movementId),
    onSuccess: async () => {
      toast.success("Transit movement deleted successfully.");
      setIsDeleteModalOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["transit-movements"],
      });
      navigate("/transit-movements", { replace: true });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to delete this transit movement.",
      );
    },
  });

  const itemLockMutation = useMutation({
    mutationFn: ({
      itemId,
      isLocked,
    }: {
      itemId: string;
      isLocked: boolean;
    }) => updateTransitMovementItemLock(itemId, isLocked),

    onSuccess: async () => {
      toast.success("Item lock status updated.");

      await queryClient.invalidateQueries({
        queryKey: ["transit-movements"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to update item lock.",
      );
    },
  });

  function resetPaymentForm() {
    setPaymentAmount("");
    setPaymentType("REGULAR");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setPaymentMethod("");
    setPaymentReference("");
    setPaymentDescription("");
  }

  const financialSummary = useMemo(() => {
    const summary: Record<
      string,
      { charge: number; paid: number; balance: number }
    > = {};

    movement?.items.forEach((item) => {
      const currency = item.chargeCurrency;
      const charge = Number(item.chargeAmount || 0);
      const paid =
        item.payments?.reduce(
          (total, payment) => total + Number(payment.amount || 0),
          0,
        ) ?? 0;

      if (!summary[currency]) {
        summary[currency] = {
          charge: 0,
          paid: 0,
          balance: 0,
        };
      }

      summary[currency].charge += charge;
      summary[currency].paid += paid;
      summary[currency].balance += Math.max(0, charge - paid);
    });

    return summary;
  }, [movement]);

  const totalItems = movement?.items.length ?? 0;
  const paidItems =
    movement?.items.filter((item) => item.paymentStatus === "PAID").length ?? 0;
  const lockedItems =
    movement?.items.filter((item) => item.isLocked).length ?? 0;

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!paymentItem || !paymentAmount) {
      toast.error("Enter a payment amount.");
      return;
    }

    const amount = Number(paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }

    const payload: TransitMovementPaymentPayload = {
      amount,
      paymentType,
      paymentDate: paymentDate || undefined,
      paymentMethod: paymentMethod || undefined,
      reference: paymentReference || undefined,
      description: paymentDescription || undefined,
    };

    await paymentMutation.mutateAsync({
      itemId: paymentItem.id,
      payload,
    });
  };

  const handleItemLock = (item: TransitMovementItem) => {
    if (!movement || movement.isLocked) return;

    itemLockMutation.mutate({
      itemId: item.id,
      isLocked: !item.isLocked,
    });
  };

  const handleDeleteMovement = () => {
    if (!movement || movement.isLocked || deleteMutation.isPending) return;
    deleteMutation.mutate(movement.id);
  };

  if (movementQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-emerald-600" size={30} />
          <p className="text-sm font-medium text-slate-500">
            Loading transit movement...
          </p>
        </div>
      </div>
    );
  }

  if (movementQuery.isError || !movement) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <FileText size={30} />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Transit movement not found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          The record could not be loaded. Check your connection or try again.
        </p>

        <button
          onClick={() => navigate("/transit-movements")}
          className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Back to Transit Movements
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => navigate("/transit-movements")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft size={17} />
              Back to Transit Movements
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {movement.transitNumber}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  movement.direction === "IN"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {movement.direction === "IN" ? (
                  <ArrowDownLeft size={14} />
                ) : (
                  <ArrowUpRight size={14} />
                )}
                {movement.direction === "IN" ? "INBOUND" : "OUTBOUND"}
              </span>

              {movement.isLocked && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                  <Lock size={13} />
                  LOCKED
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Review transit details, items, charges and payment records.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => movementQuery.refetch()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              disabled={movement.isLocked || deleteMutation.isPending}
              onClick={() => setIsDeleteModalOpen(true)}
              title={movement.isLocked ? "Unlock this movement before deleting it" : "Delete movement"}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete
            </button>

            <button
              type="button"
              disabled={movement.isLocked}
              onClick={() =>
                navigate(`/transit-movements/${movement.id}/edit`)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Pencil size={16} />
              Edit Movement
            </button>
          </div>
        </div>

        {/* LOCK NOTICE */}
        {movement.isLocked && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <LockKeyhole className="mt-0.5 text-red-600" size={21} />

            <div>
              <h3 className="font-semibold text-red-800">
                This transit movement is locked
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Editing and payment operations are disabled for this movement.
                You can still review its items and payment history.
              </p>
            </div>
          </div>
        )}

        {/* MOVEMENT INFORMATION */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Items"
            value={String(totalItems)}
            description="Items recorded in this movement"
            icon={Package}
            color="blue"
          />

          <SummaryCard
            title="Fully Paid Items"
            value={String(paidItems)}
            description="Items with completed payments"
            icon={CheckCircle2}
            color="green"
          />

          <SummaryCard
            title="Locked Items"
            value={String(lockedItems)}
            description="Individually locked items"
            icon={ShieldCheck}
            color="purple"
          />

          <SummaryCard
            title="Transit Date"
            value={formatDate(movement.transitDate)}
            description={`Created ${formatDate(movement.createdAt)}`}
            icon={CalendarDays}
            color="amber"
          />
        </section>

        {/* MOVEMENT INFORMATION CARD */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <FileText size={19} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Movement Information
              </h2>
              <p className="text-xs text-slate-500">
                General details about this transit record
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoField label="Transit Number" value={movement.transitNumber} />

            <InfoField
              label="Direction"
              value={movement.direction === "IN" ? "Inbound" : "Outbound"}
            />

            <InfoField
              label="Transit Date"
              value={formatDate(movement.transitDate)}
            />

            <InfoField
              label="Shipment Number"
              value={movement.shipment?.shipmentNumber ?? "Independent movement"}
            />

            <InfoField
              label="Shipment Client"
              value={movement.shipment?.client?.companyName ?? "—"}
            />

            <InfoField
              label="Movement Status"
              value={movement.isLocked ? "Locked" : "Active"}
            />

            <div className="sm:col-span-2 lg:col-span-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Remarks
              </p>
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                {movement.remarks || "No remarks provided."}
              </p>
            </div>
          </div>
        </section>

        {/* FINANCIAL SUMMARY */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
              <Wallet size={19} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Financial Summary
              </h2>
              <p className="text-xs text-slate-500">
                Charges, payments and outstanding balances by currency
              </p>
            </div>
          </div>

          {Object.keys(financialSummary).length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              No financial records available.
            </p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {Object.entries(financialSummary).map(([currency, values]) => (
                <div
                  key={currency}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">
                      {currency} Summary
                    </h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {currency}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <FinancialValue
                      label="Total Charges"
                      value={currencyFormatter(values.charge, currency)}
                      color="text-slate-900"
                    />

                    <FinancialValue
                      label="Total Paid"
                      value={currencyFormatter(values.paid, currency)}
                      color="text-emerald-700"
                    />

                    <FinancialValue
                      label="Outstanding"
                      value={currencyFormatter(values.balance, currency)}
                      color="text-orange-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ITEMS */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Transit Items
              </h2>
              <p className="text-sm text-slate-500">
                All trucks and containers recorded under this movement
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              {totalItems} {totalItems === 1 ? "Item" : "Items"}
            </span>
          </div>

          {movement.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Package className="mx-auto mb-3 text-slate-300" size={35} />
              <p className="font-semibold text-slate-700">No items recorded</p>
            </div>
          ) : (
            <div className="space-y-5">
              {movement.items.map((item, index) => {
                const paid =
                  item.payments?.reduce(
                    (sum, payment) => sum + Number(payment.amount || 0),
                    0,
                  ) ?? 0;

                const charge = Number(item.chargeAmount || 0);
                const balance = Math.max(0, charge - paid);
                const progress =
                  charge > 0 ? Math.min(100, (paid / charge) * 100) : 0;

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          {item.itemType === "TRUCK" ? (
                            <Truck size={21} />
                          ) : (
                            <Container size={21} />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              S/N {index + 1} · {item.name}
                            </h3>

                            <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-700">
                              {item.itemType}
                            </span>

                            {item.isLocked && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
                                <Lock size={11} />
                                Locked
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.clientName}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.paymentStatus} />

                        <button
                          type="button"
                          disabled={
                            movement.isLocked || itemLockMutation.isPending
                          }
                          onClick={() => handleItemLock(item)}
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            item.isLocked
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-red-200 bg-white text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {item.isLocked ? (
                            <>
                              <Unlock size={14} />
                              Unlock
                            </>
                          ) : (
                            <>
                              <Lock size={14} />
                              Lock Item
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-5 p-4 md:p-5">
                      {/* ITEM DETAILS */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoField
                          label="Item Date"
                          value={formatDate(item.itemDate)}
                        />

                        <InfoField
                          label="Client"
                          value={item.clientName}
                        />

                        {item.itemType === "TRUCK" ? (
                          <>
                            <InfoField
                              label="Front Plate Number"
                              value={item.frontPlateNumber || "—"}
                            />
                            <InfoField
                              label="Back Plate Number"
                              value={item.backPlateNumber || "—"}
                            />
                          </>
                        ) : (
                          <>
                            <InfoField
                              label="Container Name"
                              value={item.containerName || "—"}
                            />
                            <InfoField
                              label="Container Number"
                              value={item.containerNumber || "—"}
                            />
                          </>
                        )}
                      </div>

                      {/* ITEM FINANCIALS */}
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <FinancialValue
                            label="Charge Amount"
                            value={currencyFormatter(
                              charge,
                              item.chargeCurrency,
                            )}
                            color="text-slate-900"
                          />

                          <FinancialValue
                            label="Total Paid"
                            value={currencyFormatter(
                              paid,
                              item.chargeCurrency,
                            )}
                            color="text-emerald-700"
                          />

                          <FinancialValue
                            label="Balance"
                            value={currencyFormatter(
                              balance,
                              item.chargeCurrency,
                            )}
                            color="text-orange-700"
                          />
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="font-medium text-slate-500">
                              Payment progress
                            </span>
                            <span className="font-bold text-slate-700">
                              {progress.toFixed(0)}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {item.remarks && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Item Remarks
                          </p>
                          <p className="text-sm text-slate-600">
                            {item.remarks}
                          </p>
                        </div>
                      )}

                      {/* PAYMENT HISTORY */}
                      <div className="border-t border-slate-100 pt-5">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900">
                              Payment History
                            </h4>
                            <p className="text-xs text-slate-500">
                              {item.payments?.length ?? 0} payment records
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={
                              movement.isLocked ||
                              item.isLocked ||
                              balance <= 0
                            }
                            onClick={() => {
                              resetPaymentForm();
                              setPaymentItem(item);
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            <Plus size={16} />
                            Record Payment
                          </button>
                        </div>

                        {!item.payments?.length ? (
                          <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
                            <CreditCard
                              className="mx-auto mb-2 text-slate-300"
                              size={25}
                            />
                            <p className="text-sm text-slate-500">
                              No payment has been recorded for this item.
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left text-sm">
                              <thead>
                                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                                  <th className="px-3 py-3 font-semibold">
                                    Date
                                  </th>
                                  <th className="px-3 py-3 font-semibold">
                                    Type
                                  </th>
                                  <th className="px-3 py-3 font-semibold">
                                    Method
                                  </th>
                                  <th className="px-3 py-3 font-semibold">
                                    Reference
                                  </th>
                                  <th className="px-3 py-3 text-right font-semibold">
                                    Amount
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {item.payments.map((payment) => (
                                  <tr
                                    key={payment.id}
                                    className="border-b border-slate-50 last:border-0"
                                  >
                                    <td className="px-3 py-3 text-slate-600">
                                      {formatDate(payment.paymentDate)}
                                    </td>
                                    <td className="px-3 py-3">
                                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                        {payment.paymentType}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">
                                      {payment.paymentMethod || "—"}
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">
                                      {payment.reference || "—"}
                                    </td>
                                    <td className="px-3 py-3 text-right font-bold text-emerald-700">
                                      {currencyFormatter(
                                        Number(payment.amount),
                                        item.chargeCurrency,
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* DELETE CONFIRMATION MODAL */}
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !deleteMutation.isPending) {
                setIsDeleteModalOpen(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-transit-title"
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-start gap-4 border-b border-red-100 bg-red-50 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Trash2 size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 id="delete-transit-title" className="text-lg font-bold text-slate-900">
                    Delete Transit Movement?
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    You are about to delete{" "}
                    <span className="font-bold text-slate-900">
                      {movement.transitNumber}
                    </span>.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => setIsDeleteModalOpen(false)}
                  aria-label="Close delete confirmation"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <p className="text-sm leading-6 text-slate-600">
                  This action will permanently remove this transit movement and
                  its associated records, if permitted by the server. This
                  operation cannot be undone.
                </p>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Transit number</span>
                    <span className="font-semibold text-slate-900">
                      {movement.transitNumber}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Items</span>
                    <span className="font-semibold text-slate-900">
                      {totalItems}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Direction</span>
                    <span className="font-semibold text-slate-900">
                      {movement.direction === "IN" ? "Inbound" : "Outbound"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={handleDeleteMovement}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Yes, Delete Movement
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECORD PAYMENT MODAL */}
        {paymentItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Record Item Payment
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {paymentItem.name}
                  </p>
                </div>

                <button
                  onClick={() => setPaymentItem(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Total Charge</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {currencyFormatter(
                        Number(paymentItem.chargeAmount),
                        paymentItem.chargeCurrency,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-3">
                    <p className="text-xs text-orange-600">Outstanding</p>
                    <p className="mt-1 font-bold text-orange-700">
                      {currencyFormatter(
                        Math.max(
                          0,
                          Number(paymentItem.chargeAmount) -
                            (paymentItem.payments?.reduce(
                              (sum, payment) =>
                                sum + Number(payment.amount || 0),
                              0,
                            ) ?? 0),
                        ),
                        paymentItem.chargeCurrency,
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={(event) =>
                      setPaymentAmount(event.target.value)
                    }
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Payment Type *
                  </label>
                  <select
                    value={paymentType}
                    onChange={(event) =>
                      setPaymentType(
                        event.target.value as "ADVANCE" | "REGULAR",
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="REGULAR">Regular Payment</option>
                    <option value="ADVANCE">Advance Payment</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Payment Method
                  </label>
                  <input
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    placeholder="e.g. Bank transfer, cash"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Reference
                  </label>
                  <input
                    value={paymentReference}
                    onChange={(event) =>
                      setPaymentReference(event.target.value)
                    }
                    placeholder="Transaction reference"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={paymentDescription}
                    onChange={(event) =>
                      setPaymentDescription(event.target.value)
                    }
                    placeholder="Optional payment description"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setPaymentItem(null)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={paymentMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                  >
                    {paymentMutation.isPending && (
                      <RefreshCw size={16} className="animate-spin" />
                    )}
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FOOTER INFORMATION */}
        <div className="flex flex-col gap-2 border-t border-slate-200 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Transit Movement Management</p>
          <p>Last updated: {formatDateTime(movement.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function FinancialValue({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1.5 break-words text-lg font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}