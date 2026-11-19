import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Package,
  Plus,
  Save,
  Trash2,
  Truck,
} from "lucide-react";


import type {
  CreateTransporterPayload,
  Currency,
  Transporter,
  TransporterItemInput,
  TransporterStatus,
  TransportItemType,
  UpdateTransporterPayload,
} from "../../types/transporter";
import { useShipments } from "../../../../hooks/shipments/useShipments";

const fieldClass =
  "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";
const labelClass = "text-sm font-medium text-slate-700";

const statuses: { value: TransporterStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "LOADING", label: "Loading" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "OFFLOADING", label: "Offloading" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface ItemDraft {
  itemDate: string;
  itemType: TransportItemType;
  name: string;
  frontPlateNumber: string;
  backPlateNumber: string;
  containerName: string;
  containerNumber: string;
  status: TransporterStatus;
  chargeAmount: string;
  chargeCurrency: Currency;
  remarks: string;
}

interface Props {
  mode: "create" | "edit";
  initialData?: Transporter;
  onSubmit: (payload: CreateTransporterPayload | UpdateTransporterPayload) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

function localToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function emptyItem(type: TransportItemType = "TRUCK"): ItemDraft {
  return {
    itemDate: localToday(),
    itemType: type,
    name: "",
    frontPlateNumber: "",
    backPlateNumber: "",
    containerName: "",
    containerNumber: "",
    status: "PENDING",
    chargeAmount: "0",
    chargeCurrency: "NGN",
    remarks: "",
  };
}

export default function TransporterForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel,
}: Props) {
  const navigate = useNavigate();
  const [transportDate, setTransportDate] = useState(localToday());
  const [truckOwnerName, setTruckOwnerName] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()]);
  const [formError, setFormError] = useState("");

  const {
    data: shipmentResponse,
    isLoading: isLoadingShipments,
    isError: isShipmentError,
  } = useShipments({ page: 1, limit: 100 });
  const shipments = shipmentResponse?.data ?? [];

  useEffect(() => {
    if (!initialData) return;
    setTransportDate(new Date(initialData.transportDate).toISOString().slice(0, 10));
    setTruckOwnerName(initialData.truckOwnerName ?? "");
    setShipmentId(initialData.shipmentId ?? "");
    setRemarks(initialData.remarks ?? "");
  }, [initialData]);

  function updateItem(index: number, patch: Partial<ItemDraft>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem(type: TransportItemType) {
    setItems((current) => [...current, emptyItem(type)]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!truckOwnerName.trim()) {
      setFormError("Truck owner name is required.");
      return;
    }
    if (!transportDate) {
      setFormError("Transport date is required.");
      return;
    }

    if (mode === "create") {
      if (items.length === 0) {
        setFormError("Add at least one truck or container item.");
        return;
      }

      const invalidIndex = items.findIndex((item) => {
        if (!item.itemDate || !Number.isFinite(Number(item.chargeAmount)) || Number(item.chargeAmount) < 0) {
          return true;
        }
        if (item.itemType === "TRUCK") {
          return !item.frontPlateNumber.trim() && !item.backPlateNumber.trim();
        }
        return !item.containerName.trim() || !item.containerNumber.trim();
      });

      if (invalidIndex >= 0) {
        setFormError(`Please complete the required details for item ${invalidIndex + 1}.`);
        return;
      }

      const payload: CreateTransporterPayload = {
        transportDate,
        truckOwnerName: truckOwnerName.trim(),
        shipmentId: shipmentId || null,
        remarks: remarks.trim() || undefined,
        items: items.map((item): TransporterItemInput => ({
          itemDate: item.itemDate,
          itemType: item.itemType,
          name: item.name.trim() || undefined,
          frontPlateNumber: item.itemType === "TRUCK" ? item.frontPlateNumber.trim() || undefined : undefined,
          backPlateNumber: item.itemType === "TRUCK" ? item.backPlateNumber.trim() || undefined : undefined,
          containerName: item.itemType === "CONTAINER" ? item.containerName.trim() || undefined : undefined,
          containerNumber: item.itemType === "CONTAINER" ? item.containerNumber.trim() || undefined : undefined,
          status: item.status,
          chargeAmount: Number(item.chargeAmount),
          chargeCurrency: item.chargeCurrency,
          remarks: item.remarks.trim() || undefined,
        })),
      };
      onSubmit(payload);
      return;
    }

    const payload: UpdateTransporterPayload = {
      transportDate,
      truckOwnerName: truckOwnerName.trim(),
      shipmentId: shipmentId || null,
      remarks: remarks.trim() || null,
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Transporter information</h2>
            <p className="mt-0.5 text-sm text-slate-500">Enter the owner and movement details.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "edit" && initialData && (
            <div className="sm:col-span-2">
              <label className={labelClass}>Transporter number</label>
              <input value={initialData.transportNumber} disabled className={`${fieldClass} bg-slate-50 font-semibold text-slate-500`} />
              <p className="mt-1 text-xs text-slate-500">The generated transporter number cannot be changed.</p>
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="truckOwnerName">Truck owner name <span className="text-red-500">*</span></label>
            <input id="truckOwnerName" value={truckOwnerName} onChange={(event) => setTruckOwnerName(event.target.value)} placeholder="Enter truck owner or company name" className={fieldClass} required />
          </div>

          <div>
            <label className={labelClass} htmlFor="transportDate">Transport date <span className="text-red-500">*</span></label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input id="transportDate" type="date" value={transportDate} onChange={(event) => setTransportDate(event.target.value)} className={`${fieldClass} pl-9`} required />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="shipmentId">Shipment association</label>
            <select id="shipmentId" value={shipmentId} onChange={(event) => setShipmentId(event.target.value)} className={fieldClass}>
              <option value="">Independent transporter (not linked to a shipment)</option>
              {shipments.map((shipment: { id: string; shipmentNumber?: string }) => (
                <option key={shipment.id} value={shipment.id}>{shipment.shipmentNumber ?? shipment.id}</option>
              ))}
            </select>
            {isLoadingShipments && <p className="mt-1 text-xs text-slate-500">Loading shipments...</p>}
            {isShipmentError && <p className="mt-1 text-xs text-amber-700">Shipment list could not be loaded. You can still leave this transporter independent.</p>}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="remarks">General remarks</label>
            <textarea id="remarks" rows={3} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Add any relevant notes about this transporter record..." className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
          </div>
        </div>
      </section>

      {mode === "create" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><Package className="h-5 w-5" /></div>
              <div>
                <h2 className="font-semibold text-slate-900">Transporter items</h2>
                <p className="mt-0.5 text-sm text-slate-500">Add each truck or container and its operational status.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => addItem("TRUCK")} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100">
                <Plus className="h-4 w-4" /> Add truck
              </button>
              <button type="button" onClick={() => addItem("CONTAINER")} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-100">
                <Plus className="h-4 w-4" /> Add container
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((item, index) => (
              <div key={`${item.itemType}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                      {item.itemType === "TRUCK" ? <Truck className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">Item {index + 1} · {item.itemType === "TRUCK" ? "Truck" : "Container"}</p>
                      <p className="text-xs text-slate-500">Its movement status is tracked independently.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} disabled={items.length === 1} aria-label={`Remove item ${index + 1}`} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className={labelClass}>Item date</label>
                    <input type="date" value={item.itemDate} onChange={(event) => updateItem(index, { itemDate: event.target.value })} className={fieldClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Item type</label>
                    <select value={item.itemType} onChange={(event) => updateItem(index, { itemType: event.target.value as TransportItemType })} className={fieldClass}>
                      <option value="TRUCK">Truck</option>
                      <option value="CONTAINER">Container</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Operational status</label>
                    <select value={item.status} onChange={(event) => updateItem(index, { status: event.target.value as TransporterStatus })} className={fieldClass}>
                      {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </div>

                  {item.itemType === "TRUCK" ? (
                    <>
                      <div>
                        <label className={labelClass}>Truck / driver name</label>
                        <input value={item.name} onChange={(event) => updateItem(index, { name: event.target.value })} placeholder="Optional name" className={fieldClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Front plate number</label>
                        <input value={item.frontPlateNumber} onChange={(event) => updateItem(index, { frontPlateNumber: event.target.value.toUpperCase() })} placeholder="e.g. ABC 123 XY" className={fieldClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Back plate number</label>
                        <input value={item.backPlateNumber} onChange={(event) => updateItem(index, { backPlateNumber: event.target.value.toUpperCase() })} placeholder="e.g. ABC 123 XY" className={fieldClass} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className={labelClass}>Container name</label>
                        <input value={item.containerName} onChange={(event) => updateItem(index, { containerName: event.target.value })} placeholder="e.g. MSCU container" className={fieldClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Container number</label>
                        <input value={item.containerNumber} onChange={(event) => updateItem(index, { containerNumber: event.target.value.toUpperCase() })} placeholder="Enter container number" className={fieldClass} />
                      </div>
                    </>
                  )}

                  <div>
                    <label className={labelClass}>Charge amount</label>
                    <input type="number" min="0" step="0.01" value={item.chargeAmount} onChange={(event) => updateItem(index, { chargeAmount: event.target.value })} className={fieldClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Charge currency</label>
                    <select value={item.chargeCurrency} onChange={(event) => updateItem(index, { chargeCurrency: event.target.value as Currency })} className={fieldClass}>
                      <option value="NGN">NGN — Nigerian Naira</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="CFA">CFA</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelClass}>Item remarks</label>
                    <input value={item.remarks} onChange={(event) => updateItem(index, { remarks: event.target.value })} placeholder="Optional remarks" className={fieldClass} />
                  </div>
                </div>
                {item.itemType === "TRUCK" && !item.frontPlateNumber.trim() && !item.backPlateNumber.trim() && (
                  <p className="mt-2 text-xs text-amber-700">Enter at least one truck plate number before saving.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {formError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => navigate(-1)} disabled={isSubmitting} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Save className="h-4 w-4" />}
          {submitLabel ?? (mode === "create" ? "Create transporter" : "Save changes")}
        </button>
      </div>
    </form>
  );
}
