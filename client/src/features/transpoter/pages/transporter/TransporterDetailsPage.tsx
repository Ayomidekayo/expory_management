import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  History,
  Loader2,
  Lock,
  Package,
  Pencil,
  Plus,
  Trash2,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAddTransporterItem,
  useCreateTransporterPayment,
  useDeleteTransporter,
  useDeleteTransporterItem,
  useTransporter,
  useTransporterItemPayments,
} from "../../hooks/transporter/useTransporters";
import { updateTransporterItem } from "../../api/transporter.api";
import { useQueryClient } from "@tanstack/react-query";
import type {
  Currency,
  ItemPaymentType,
  TransporterItem,
  TransporterItemInput,
  TransporterStatus,
  UpdateTransporterItemPayload,
} from "../../types/transporter";

const statuses: { value: TransporterStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "LOADING", label: "Loading" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "OFFLOADING", label: "Offloading" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

// Keep the transporter detail view compact on desktop and mobile.
const ITEMS_PER_PAGE = 10;

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(amount: number, currency: Currency) {
  const value = amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (currency === "NGN") return `₦${value}`;
  if (currency === "USD") return `$${value}`;
  if (currency === "EUR") return `€${value}`;
  return `CFA ${value}`;
}

function getPaid(item: TransporterItem) {
  return (item.payments ?? []).reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
}

function statusStyle(status: TransporterStatus) {
  const styles: Record<TransporterStatus, string> = {
    PENDING: "border-slate-200 bg-slate-50 text-slate-700",
    LOADING: "border-blue-200 bg-blue-50 text-blue-700",
    IN_TRANSIT: "border-indigo-200 bg-indigo-50 text-indigo-700",
    OFFLOADING: "border-amber-200 bg-amber-50 text-amber-800",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
  };
  return styles[status];
}

function StatusPill({ status }: { status: TransporterStatus }) {
  const label = statuses.find((entry) => entry.value === status)?.label ?? status;
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle(status)}`}>{label}</span>;
}

function PaymentPill({ status }: { status: string }) {
  const style: Record<string, string> = {
    UNPAID: "bg-red-50 text-red-700 border-red-200",
    ADVANCE: "bg-amber-50 text-amber-700 border-amber-200",
    PARTIALLY_PAID: "bg-blue-50 text-blue-700 border-blue-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const label: Record<string, string> = {
    UNPAID: "Unpaid",
    ADVANCE: "Advance",
    PARTIALLY_PAID: "Partially paid",
    PAID: "Paid",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style[status] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>{label[status] ?? status}</span>;
}

function SummaryCard({ title, value, caption, icon: Icon, tone }: {
  title: string;
  value: string | number;
  caption: string;
  icon: typeof Truck;
  tone: "blue" | "green" | "amber";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="min-w-0"><p className="text-xs font-medium text-slate-500">{title}</p><p className="mt-1.5 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{caption}</p></div>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></span>
    </div>
  );
}

function Modal({ title, description, onClose, children }: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-5">
          <div><h2 className="font-semibold text-slate-900">{title}</h2>{description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}</div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close dialog"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

export default function TransporterDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useTransporter(id);
  const queryClient = useQueryClient();
  const transporter = query.data;

  const [paymentItem, setPaymentItem] = useState<TransporterItem | null>(null);
  const [historyItem, setHistoryItem] = useState<TransporterItem | null>(null);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TransporterItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<TransporterItem | null>(null);

  const [itemsPage, setItemsPage] = useState(1);

  useEffect(() => {
    setItemsPage(1);
  }, [id]);

  const deleteMutation = useDeleteTransporter();
  const deleteItemMutation = useDeleteTransporterItem(id);
  const addItemMutation = useAddTransporterItem(id);

  const items = transporter?.items ?? [];
  const trucks = items.filter((item) => item.itemType === "TRUCK").length;
  const containers = items.filter((item) => item.itemType === "CONTAINER").length;
  const offloading = items.filter((item) => item.status === "OFFLOADING").length;

  const totalItemPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const currentItemsPage = Math.min(itemsPage, totalItemPages);
  const itemStartIndex = (currentItemsPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = items.slice(
    itemStartIndex,
    itemStartIndex + ITEMS_PER_PAGE,
  );

  const financialSummary = useMemo<Record<string, { charge: number; paid: number; balance: number }>>(() => {
    const summary: Record<string, { charge: number; paid: number; balance: number }> = {};
    items.forEach((item) => {
      const currency = item.chargeCurrency;
      if (!summary[currency]) summary[currency] = { charge: 0, paid: 0, balance: 0 };
      const charge = Number(item.chargeAmount ?? 0);
      const paid = getPaid(item);
      summary[currency].charge += charge;
      summary[currency].paid += paid;
      summary[currency].balance += Math.max(0, charge - paid);
    });
    return summary;
  }, [items]);
  const financialRows = Object.entries(financialSummary) as Array<[
    string,
    { charge: number; paid: number; balance: number },
  ]>;

  async function handleDeleteTransporter() {
    if (!transporter) return;
    try {
      await deleteMutation.mutateAsync(transporter.id);
      toast.success("Transporter deleted successfully.");
      navigate("/transporters", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete transporter."));
    }
  }

  async function handleDeleteItem() {
    if (!itemToDelete) return;
    try {
      await deleteItemMutation.mutateAsync(itemToDelete.id);
      toast.success("Transporter item deleted successfully.");
      setItemToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to delete this item."));
    }
  }

  async function handleStatusChange(item: TransporterItem, status: TransporterStatus) {
    if (!transporter || transporter.isLocked || item.isLocked || status === item.status) return;
    try {
      await updateTransporterItem(transporter.id, item.id, { status });
      await queryClient.invalidateQueries({ queryKey: ["transporters"] });
      toast.success(`Item status updated to ${statuses.find((entry) => entry.value === status)?.label ?? status}.`);
      await query.refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update item status."));
    }
  }

  async function handleEditItem(payload: UpdateTransporterItemPayload) {
    if (!itemToEdit) return;
    try {
      await updateTransporterItem(id, itemToEdit.id, payload);
      await queryClient.invalidateQueries({ queryKey: ["transporters"] });
      toast.success("Transporter item updated successfully.");
      setItemToEdit(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update transporter item."));
    }
  }

  async function handleAddItem(payload: TransporterItemInput) {
    try {
      await addItemMutation.mutateAsync(payload);
      toast.success("Transporter item added successfully.");
      setAddItemOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to add transporter item."));
    }
  }

  if (query.isLoading) {
    return <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" /> Loading transporter details...</div>;
  }

  if (query.isError || !transporter) {
    return <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><Truck className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-3 text-lg font-semibold text-slate-900">Transporter record not found</h2><p className="mt-1 text-sm text-slate-500">The requested transporter record could not be loaded.</p><button onClick={() => navigate("/transporters")} className="mt-5 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800">Back to transporters</button></div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 items-start gap-3">
          <button type="button" onClick={() => navigate("/transporters")} className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50" aria-label="Back to transporters"><ArrowLeft className="h-4 w-4" /></button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><h1 className="break-all text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{transporter.transportNumber}</h1><span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${transporter.isLocked ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}><Lock className="h-3 w-3" /> {transporter.isLocked ? "Locked" : "Active"}</span></div>
            <p className="mt-1 text-sm text-slate-500">Transporter record details, item progress and financial information.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <button type="button" onClick={() => navigate(`/transporters/${id}/edit`)} disabled={transporter.isLocked} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><Pencil className="h-4 w-4" /> Edit</button>
          <button type="button" onClick={() => setDeleteOpen(true)} disabled={transporter.isLocked} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-4 w-4" /> Delete</button>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4"><span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><FileText className="h-4 w-4" /></span><h2 className="font-semibold text-slate-900">Transporter information</h2></div>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          <Info label="Transporter number" value={transporter.transportNumber} strong />
          <Info label="Truck owner name" value={transporter.truckOwnerName} />
          <Info label="Transport date" value={formatDate(transporter.transportDate)} icon={<CalendarDays className="h-3.5 w-3.5" />} />
          <div><p className="text-xs text-slate-500">Shipment</p>{transporter.shipment?.id ? <Link to={`/shipments/${transporter.shipment.id}`} className="mt-1 inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100">{transporter.shipment.shipmentNumber}</Link> : <span className="mt-1 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">Independent transporter</span>}</div>
          <Info label="Total items" value={items.length.toString()} />
          <Info label="Created" value={formatDate(transporter.createdAt)} />
          <Info label="Last updated" value={formatDate(transporter.updatedAt)} />
          {transporter.remarks && <div className="sm:col-span-2 xl:col-span-3"><Info label="Remarks" value={transporter.remarks} /></div>}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard title="Total items" value={items.length} caption="Registered trucks and containers" icon={Package} tone="blue" />
        <SummaryCard title="Trucks" value={trucks} caption="Truck movements" icon={Truck} tone="green" />
        <SummaryCard title="Containers" value={containers} caption="Container movements" icon={Package} tone="amber" />
        <SummaryCard title="Offloading" value={offloading} caption="Items currently offloading" icon={Clock3} tone="amber" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4"><span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><Wallet className="h-4 w-4" /></span><div><h2 className="font-semibold text-slate-900">Financial summary</h2><p className="text-xs text-slate-500">Charges and recorded payments grouped by currency.</p></div></div>
        {financialRows.length === 0 ? <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No charges have been added to this transporter yet.</p> : <div className="space-y-3">{financialRows.map(([currency, values]) => <div key={currency} className="rounded-xl border border-slate-200 p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold text-slate-800">{currency}</p><span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Financial position</span></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><FinancialValue label="Total charges" value={formatMoney(values.charge, currency as Currency)} /><FinancialValue label="Total paid" value={formatMoney(values.paid, currency as Currency)} tone="green" /><FinancialValue label="Outstanding" value={formatMoney(values.balance, currency as Currency)} tone="amber" /></div></div>)}</div>}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3"><span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><Truck className="h-5 w-5" /></span><div><h2 className="font-semibold text-slate-900">Transporter items</h2><p className="text-xs text-slate-500">Manage vehicles, operational status, charges and payments.</p></div></div>
          <button type="button" onClick={() => setAddItemOpen(true)} disabled={transporter.isLocked} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /> Add item</button>
        </div>

        {items.length === 0 ? <div className="px-4 py-12 text-center"><Package className="mx-auto h-9 w-9 text-slate-300" /><h3 className="mt-3 font-semibold text-slate-900">No transporter items</h3><p className="mt-1 text-sm text-slate-500">Add a truck or container to start tracking its movement.</p></div> : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1250px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Item / date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Vehicle / container</th><th className="px-4 py-3">Operational status</th><th className="px-4 py-3">Charge</th><th className="px-4 py-3">Amount paid</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Payment status</th><th className="px-4 py-3">Remarks</th><th className="px-4 py-3">Manage item</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{visibleItems.map((item, index) => <tr key={item.id} className="align-top hover:bg-slate-50/70"><td className="px-4 py-4 text-xs text-slate-400">{itemStartIndex + index + 1}</td><td className="px-4 py-4"><p className="font-semibold text-slate-800">{item.name || (item.itemType === "TRUCK" ? "Truck movement" : "Container movement")}</p><p className="mt-1 text-xs text-slate-500">{formatDate(item.itemDate)}</p></td><td className="px-4 py-4"><span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{item.itemType === "TRUCK" ? <Truck className="h-3 w-3" /> : <Package className="h-3 w-3" />}{item.itemType}</span></td><td className="px-4 py-4"><p className="font-medium text-slate-800">{item.itemType === "TRUCK" ? [item.frontPlateNumber, item.backPlateNumber].filter(Boolean).join(" / ") || "—" : item.containerNumber || "—"}</p>{item.itemType === "CONTAINER" && item.containerName && <p className="mt-0.5 text-xs text-slate-500">{item.containerName}</p>}</td><td className="px-4 py-4"><select aria-label={`Update status for item ${index + 1}`} value={item.status} disabled={transporter.isLocked || item.isLocked} onChange={(event) => void handleStatusChange(item, event.target.value as TransporterStatus)} className={`h-9 min-w-[135px] rounded-lg border px-2 text-xs font-semibold outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 ${statusStyle(item.status)}`}>
                  {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                </select>{item.isLocked && <p className="mt-1 text-[11px] text-amber-700">Item locked</p>}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">{formatMoney(Number(item.chargeAmount), item.chargeCurrency)}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-emerald-700">{formatMoney(getPaid(item), item.chargeCurrency)}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-amber-700">{formatMoney(Math.max(0, Number(item.chargeAmount) - getPaid(item)), item.chargeCurrency)}</td><td className="px-4 py-4"><PaymentPill status={item.paymentStatus} /></td><td className="max-w-[180px] px-4 py-4 text-xs text-slate-500">{item.remarks || "—"}</td><td className="px-4 py-4"><div className="flex min-w-[155px] flex-col gap-1.5"><button onClick={() => setItemToEdit(item)} disabled={transporter.isLocked || item.isLocked} className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"><Pencil className="h-3.5 w-3.5" /> Edit item</button><button onClick={() => setPaymentItem(item)} disabled={transporter.isLocked || item.isLocked || item.paymentStatus === "PAID"} className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40"><CreditCard className="h-3.5 w-3.5" /> Add payment</button><button onClick={() => setHistoryItem(item)} className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 text-xs font-semibold text-violet-800 hover:bg-violet-100"><History className="h-3.5 w-3.5" /> Payment history</button><button onClick={() => setItemToDelete(item)} disabled={transporter.isLocked || item.isLocked || item.payments.length > 0} className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-red-100 bg-white px-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"><Trash2 className="h-3.5 w-3.5" /> Remove item</button></div></td></tr>)}</tbody>
              </table>
            </div>

            <div className="grid gap-3 p-3 lg:hidden sm:p-4">{visibleItems.map((item, index) => <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">{item.itemType === "TRUCK" ? <Truck className="h-4 w-4" /> : <Package className="h-4 w-4" />}</span><div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Item {itemStartIndex + index + 1} · {item.itemType}</p><h3 className="mt-0.5 break-words font-semibold text-slate-900">{item.name || (item.itemType === "TRUCK" ? "Truck movement" : item.containerName || "Container movement")}</h3><p className="mt-1 break-words text-xs text-slate-500">{item.itemType === "TRUCK" ? [item.frontPlateNumber, item.backPlateNumber].filter(Boolean).join(" / ") || "No plate number" : item.containerNumber || "No container number"}</p></div></div><span className="shrink-0 text-[11px] text-slate-400">{formatDate(item.itemDate)}</span></div><div className="mt-3 flex flex-wrap items-center gap-2"><StatusPill status={item.status} /><PaymentPill status={item.paymentStatus} />{item.isLocked && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700"><Lock className="h-3 w-3" /> Locked</span>}</div><div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3"><MoneyCompact label="Charge" value={formatMoney(Number(item.chargeAmount), item.chargeCurrency)} /><MoneyCompact label="Paid" value={formatMoney(getPaid(item), item.chargeCurrency)} tone="green" /><MoneyCompact label="Balance" value={formatMoney(Math.max(0, Number(item.chargeAmount) - getPaid(item)), item.chargeCurrency)} tone="amber" /></div><div className="mt-3"><label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400" htmlFor={`mobile-status-${item.id}`}>Operational status</label><select id={`mobile-status-${item.id}`} value={item.status} disabled={transporter.isLocked || item.isLocked} onChange={(event) => void handleStatusChange(item, event.target.value as TransporterStatus)} className={`mt-1.5 h-10 w-full rounded-xl border px-3 text-sm font-semibold outline-none focus:border-emerald-500 disabled:opacity-60 ${statusStyle(item.status)}`}>{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></div>{item.remarks && <p className="mt-3 break-words text-xs text-slate-500">{item.remarks}</p>}<div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => setItemToEdit(item)} disabled={transporter.isLocked || item.isLocked} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"><Pencil className="h-3.5 w-3.5" /> Edit item</button><button onClick={() => setPaymentItem(item)} disabled={transporter.isLocked || item.isLocked || item.paymentStatus === "PAID"} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40"><CreditCard className="h-3.5 w-3.5" /> Add payment</button><button onClick={() => setHistoryItem(item)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 text-xs font-semibold text-violet-800 hover:bg-violet-100"><History className="h-3.5 w-3.5" /> Payment history</button><button onClick={() => setItemToDelete(item)} disabled={transporter.isLocked || item.isLocked || item.payments.length > 0} className="col-span-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-white text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"><Trash2 className="h-3.5 w-3.5" /> Remove item</button></div></article>)}</div>

            {items.length > ITEMS_PER_PAGE && (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Page {currentItemsPage} of {totalItemPages}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Showing {itemStartIndex + 1}–
                    {Math.min(itemStartIndex + visibleItems.length, items.length)} of {items.length} items
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setItemsPage(Math.max(1, currentItemsPage - 1))}
                    disabled={currentItemsPage <= 1}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemsPage(Math.min(totalItemPages, currentItemsPage + 1))}
                    disabled={currentItemsPage >= totalItemPages}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {paymentItem && <PaymentDialog transporterId={id} item={paymentItem} onClose={() => setPaymentItem(null)} />}
      {itemToEdit && <EditItemDialog item={itemToEdit} onClose={() => setItemToEdit(null)} onSubmit={handleEditItem} />}
      {historyItem && <PaymentHistoryDialog transporterId={id} item={historyItem} onClose={() => setHistoryItem(null)} />}
      {addItemOpen && <AddItemDialog onClose={() => setAddItemOpen(false)} onSubmit={(payload) => void handleAddItem(payload)} isSubmitting={addItemMutation.isPending} />}
      {deleteOpen && <ConfirmDialog title="Delete transporter record?" description={`This will delete ${transporter.transportNumber}. Records with payment history cannot be deleted.`} confirmLabel="Delete transporter" isPending={deleteMutation.isPending} onCancel={() => setDeleteOpen(false)} onConfirm={() => void handleDeleteTransporter()} />}
      {itemToDelete && <ConfirmDialog title="Remove transporter item?" description="This item can only be removed if it has no recorded payments." confirmLabel="Remove item" isPending={deleteItemMutation.isPending} onCancel={() => setItemToDelete(null)} onConfirm={() => void handleDeleteItem()} />}
    </div>
  );
}

function Info({ label, value, strong = false, icon }: { label: string; value: string; strong?: boolean; icon?: ReactNode }) {
  return <div><p className="text-xs text-slate-500">{label}</p><p className={`mt-1 flex items-center gap-1.5 break-words text-sm ${strong ? "font-bold text-slate-900" : "font-medium text-slate-800"}`}>{icon}{value}</p></div>;
}

function FinancialValue({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "green" | "amber" }) {
  const toneClass = tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-slate-900";
  return <div><p className="text-xs text-slate-500">{label}</p><p className={`mt-1 break-words text-sm font-bold ${toneClass}`}>{value}</p></div>;
}

function MoneyCompact({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "green" | "amber" }) {
  const toneClass = tone === "green" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-slate-900";
  return <div className="min-w-0"><p className="text-[10px] text-slate-500">{label}</p><p className={`mt-1 break-words text-xs font-bold ${toneClass}`}>{value}</p></div>;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : fallback;
}

function ConfirmDialog({ title, description, confirmLabel, isPending, onCancel, onConfirm }: {
  title: string;
  description: string;
  confirmLabel: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return <Modal title={title} description={description} onClose={isPending ? () => undefined : onCancel}><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 className="h-5 w-5" /></div><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" disabled={isPending} onClick={onCancel} className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" disabled={isPending} onClick={onConfirm} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{isPending && <Loader2 className="h-4 w-4 animate-spin" />}{confirmLabel}</button></div></Modal>;
}

function PaymentDialog({ transporterId, item, onClose }: { transporterId: string; item: TransporterItem; onClose: () => void }) {
  const mutation = useCreateTransporterPayment(transporterId, item.id);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState<ItemPaymentType>("REGULAR");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const paid = getPaid(item);
  const balance = Math.max(0, Number(item.chargeAmount) - paid);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }
    if (numericAmount > balance) {
      toast.error("Payment cannot exceed the outstanding balance.");
      return;
    }
    try {
      await mutation.mutateAsync({ amount: numericAmount, paymentType, paymentDate: paymentDate || undefined, paymentMethod: paymentMethod.trim() || undefined, reference: reference.trim() || undefined, description: description.trim() || undefined });
      toast.success("Payment recorded successfully.");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to record payment."));
    }
  }

  return <Modal title="Record transporter payment" description={`${item.name || (item.itemType === "TRUCK" ? item.frontPlateNumber || "Truck item" : item.containerNumber || "Container item")} · ${item.chargeCurrency}`} onClose={mutation.isPending ? () => undefined : onClose}><div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3"><div><p className="text-xs text-slate-500">Outstanding</p><p className="mt-1 font-bold text-amber-700">{formatMoney(balance, item.chargeCurrency)}</p></div><div><p className="text-xs text-slate-500">Already paid</p><p className="mt-1 font-bold text-emerald-700">{formatMoney(paid, item.chargeCurrency)}</p></div></div><form onSubmit={(event) => void submit(event)} className="space-y-3"><Field label="Payment amount"><input type="number" min="0.01" max={balance} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className={fieldClass} required /></Field><div className="grid grid-cols-2 gap-3"><Field label="Payment type"><select value={paymentType} onChange={(event) => setPaymentType(event.target.value as ItemPaymentType)} className={fieldClass}><option value="REGULAR">Regular</option><option value="ADVANCE">Advance</option></select></Field><Field label="Payment date"><input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className={fieldClass} /></Field></div><Field label="Payment method"><input value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} placeholder="Bank transfer, cash..." className={fieldClass} /></Field><Field label="Reference"><input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Transaction reference" className={fieldClass} /></Field><Field label="Description"><textarea rows={2} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional payment description" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" /></Field><button type="submit" disabled={mutation.isPending || balance <= 0} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50">{mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />} Record payment</button></form></Modal>;
}

function PaymentHistoryDialog({ transporterId, item, onClose }: { transporterId: string; item: TransporterItem; onClose: () => void }) {
  const query = useTransporterItemPayments(transporterId, item.id);
  const payments = query.data ?? [];
  return <Modal title="Payment history" description={`All payment entries for this ${item.itemType.toLowerCase()} item.`} onClose={onClose}>{query.isLoading ? <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin text-emerald-700" /> Loading payments...</div> : query.isError ? <div className="py-8 text-center text-sm text-red-600">Unable to load payment history.</div> : payments.length === 0 ? <div className="py-10 text-center"><History className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-700">No payments recorded yet</p><p className="mt-1 text-xs text-slate-500">Payment entries will appear here.</p></div> : <div className="space-y-3">{payments.map((payment) => <div key={payment.id} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{formatMoney(Number(payment.amount), item.chargeCurrency)}</p><p className="mt-0.5 text-xs text-slate-500">{formatDateTime(payment.paymentDate)}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{payment.paymentType}</span></div>{payment.paymentMethod && <p className="mt-2 text-xs text-slate-600">Method: {payment.paymentMethod}</p>}{payment.reference && <p className="mt-1 break-all text-xs text-slate-600">Reference: {payment.reference}</p>}{payment.description && <p className="mt-1 text-xs text-slate-500">{payment.description}</p>}<p className="mt-2 text-[11px] text-slate-400">Recorded by {payment.recordedBy?.name || payment.recordedBy?.email || "System user"}</p></div>)}</div>}</Modal>;
}

function EditItemDialog({ item, onClose, onSubmit }: {
  item: TransporterItem;
  onClose: () => void;
  onSubmit: (payload: UpdateTransporterItemPayload) => Promise<void>;
}) {
  const [itemDate, setItemDate] = useState(item.itemDate.slice(0, 10));
  const [itemType, setItemType] = useState<"TRUCK" | "CONTAINER">(item.itemType);
  const [name, setName] = useState(item.name ?? "");
  const [frontPlateNumber, setFrontPlateNumber] = useState(item.frontPlateNumber ?? "");
  const [backPlateNumber, setBackPlateNumber] = useState(item.backPlateNumber ?? "");
  const [containerName, setContainerName] = useState(item.containerName ?? "");
  const [containerNumber, setContainerNumber] = useState(item.containerNumber ?? "");
  const [status, setStatus] = useState<TransporterStatus>(item.status);
  const [chargeAmount, setChargeAmount] = useState(String(item.chargeAmount));
  const [chargeCurrency, setChargeCurrency] = useState<Currency>(item.chargeCurrency);
  const [remarks, setRemarks] = useState(item.remarks ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (itemType === "TRUCK" && !frontPlateNumber.trim() && !backPlateNumber.trim()) {
      toast.error("Enter at least one truck plate number.");
      return;
    }
    if (itemType === "CONTAINER" && (!containerName.trim() || !containerNumber.trim())) {
      toast.error("Container name and number are required.");
      return;
    }
    const numericCharge = Number(chargeAmount);
    if (!Number.isFinite(numericCharge) || numericCharge < 0) {
      toast.error("Enter a valid charge amount.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        itemDate,
        itemType,
        name: name.trim() || null,
        frontPlateNumber: itemType === "TRUCK" ? frontPlateNumber.trim() || null : null,
        backPlateNumber: itemType === "TRUCK" ? backPlateNumber.trim() || null : null,
        containerName: itemType === "CONTAINER" ? containerName.trim() || null : null,
        containerNumber: itemType === "CONTAINER" ? containerNumber.trim() || null : null,
        status,
        chargeAmount: numericCharge,
        chargeCurrency,
        remarks: remarks.trim() || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return <Modal title="Edit transporter item" description="Update the vehicle, container, status or charge details." onClose={isSubmitting ? () => undefined : onClose}>
    <form onSubmit={(event) => void submit(event)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Item date"><input type="date" value={itemDate} onChange={(event) => setItemDate(event.target.value)} className={fieldClass} required /></Field>
        <Field label="Item type"><select value={itemType} onChange={(event) => setItemType(event.target.value as "TRUCK" | "CONTAINER")} className={fieldClass}><option value="TRUCK">Truck</option><option value="CONTAINER">Container</option></select></Field>
      </div>
      <Field label="Operational status"><select value={status} onChange={(event) => setStatus(event.target.value as TransporterStatus)} className={fieldClass}>{statuses.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></Field>
      {itemType === "TRUCK" ? <><Field label="Truck / driver name"><input value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Front plate"><input value={frontPlateNumber} onChange={(event) => setFrontPlateNumber(event.target.value.toUpperCase())} className={fieldClass} /></Field><Field label="Back plate"><input value={backPlateNumber} onChange={(event) => setBackPlateNumber(event.target.value.toUpperCase())} className={fieldClass} /></Field></div></> : <><Field label="Container name"><input value={containerName} onChange={(event) => setContainerName(event.target.value)} className={fieldClass} required /></Field><Field label="Container number"><input value={containerNumber} onChange={(event) => setContainerNumber(event.target.value.toUpperCase())} className={fieldClass} required /></Field></>}
      <div className="grid grid-cols-2 gap-3"><Field label="Charge amount"><input type="number" min="0" step="0.01" value={chargeAmount} onChange={(event) => setChargeAmount(event.target.value)} className={fieldClass} required /></Field><Field label="Currency"><select value={chargeCurrency} onChange={(event) => setChargeCurrency(event.target.value as Currency)} className={fieldClass}><option value="NGN">NGN</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="CFA">CFA</option></select></Field></div>
      <Field label="Remarks"><textarea rows={2} value={remarks} onChange={(event) => setRemarks(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" /></Field>
      <button type="submit" disabled={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />} Save item changes</button>
    </form>
  </Modal>;
}

function AddItemDialog({ onClose, onSubmit, isSubmitting }: { onClose: () => void; onSubmit: (payload: TransporterItemInput) => void; isSubmitting: boolean }) {
  const [itemType, setItemType] = useState<"TRUCK" | "CONTAINER">("TRUCK");
  const [itemDate, setItemDate] = useState(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [frontPlateNumber, setFrontPlateNumber] = useState("");
  const [backPlateNumber, setBackPlateNumber] = useState("");
  const [containerName, setContainerName] = useState("");
  const [containerNumber, setContainerNumber] = useState("");
  const [status, setStatus] = useState<TransporterStatus>("PENDING");
  const [chargeAmount, setChargeAmount] = useState("0");
  const [chargeCurrency, setChargeCurrency] = useState<Currency>("NGN");
  const [remarks, setRemarks] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (itemType === "TRUCK" && !frontPlateNumber.trim() && !backPlateNumber.trim()) {
      toast.error("Enter at least one truck plate number.");
      return;
    }
    if (itemType === "CONTAINER" && (!containerName.trim() || !containerNumber.trim())) {
      toast.error("Container name and number are required.");
      return;
    }
    onSubmit({ itemDate, itemType, name: name.trim() || undefined, frontPlateNumber: itemType === "TRUCK" ? frontPlateNumber.trim() || undefined : undefined, backPlateNumber: itemType === "TRUCK" ? backPlateNumber.trim() || undefined : undefined, containerName: itemType === "CONTAINER" ? containerName.trim() || undefined : undefined, containerNumber: itemType === "CONTAINER" ? containerNumber.trim() || undefined : undefined, status, chargeAmount: Number(chargeAmount), chargeCurrency, remarks: remarks.trim() || undefined });
  }

  return <Modal title="Add transporter item" description="Register another truck or container under this transporter." onClose={isSubmitting ? () => undefined : onClose}><form onSubmit={submit} className="space-y-3"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setItemType("TRUCK")} className={`h-10 rounded-xl border text-sm font-semibold ${itemType === "TRUCK" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600"}`}><Truck className="mr-1 inline h-4 w-4" /> Truck</button><button type="button" onClick={() => setItemType("CONTAINER")} className={`h-10 rounded-xl border text-sm font-semibold ${itemType === "CONTAINER" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600"}`}><Package className="mr-1 inline h-4 w-4" /> Container</button></div><div className="grid grid-cols-2 gap-3"><Field label="Item date"><input type="date" value={itemDate} onChange={(event) => setItemDate(event.target.value)} className={fieldClass} required /></Field><Field label="Operational status"><select value={status} onChange={(event) => setStatus(event.target.value as TransporterStatus)} className={fieldClass}>{statuses.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}</select></Field></div>{itemType === "TRUCK" ? <><Field label="Truck / driver name"><input value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Front plate"><input value={frontPlateNumber} onChange={(event) => setFrontPlateNumber(event.target.value.toUpperCase())} className={fieldClass} /></Field><Field label="Back plate"><input value={backPlateNumber} onChange={(event) => setBackPlateNumber(event.target.value.toUpperCase())} className={fieldClass} /></Field></div></> : <><Field label="Container name"><input value={containerName} onChange={(event) => setContainerName(event.target.value)} className={fieldClass} required /></Field><Field label="Container number"><input value={containerNumber} onChange={(event) => setContainerNumber(event.target.value.toUpperCase())} className={fieldClass} required /></Field></>}<div className="grid grid-cols-2 gap-3"><Field label="Charge amount"><input type="number" min="0" step="0.01" value={chargeAmount} onChange={(event) => setChargeAmount(event.target.value)} className={fieldClass} required /></Field><Field label="Currency"><select value={chargeCurrency} onChange={(event) => setChargeCurrency(event.target.value as Currency)} className={fieldClass}><option value="NGN">NGN</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="CFA">CFA</option></select></Field></div><Field label="Remarks"><textarea rows={2} value={remarks} onChange={(event) => setRemarks(event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" /></Field><button type="submit" disabled={isSubmitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add item</button></form></Modal>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<div className="mt-1.5">{children}</div></label>;
}
