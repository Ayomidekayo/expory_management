import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Eye,
  Info,
  LoaderCircle,
  Pencil,
  Plus,
  Ruler,
  Trash2,
  X,
} from "lucide-react";
import {
  useCreateWeightSlab,
  useDeleteWeightSlab,
  useUpdateWeightSlab,
  useWeightSlabs,
} from "../hooks/use-weight-slabs";
import type {
  WeightPricingSection,
  WeightSlab,
  WeightSlabInput,
} from "../types/weight-slab.types";
import SlabRatesEditor from "./SlabRatesEditor";

type Props = {
  rateCardId: string;
  configurationId: string;
  configurationName?: string;
  configurationCurrency?: string;
  rateCardStatus?: string;
  readOnly?: boolean;
  pricingSections: WeightPricingSection[];
};

type Notice = { type: "success" | "error"; message: string } | null;

const emptyForm = (): WeightSlabInput => ({
  label: "",
  minWeightKg: 0,
  maxWeightKg: null,
  displayOrder: 0,
});

const displayWeight = (value: number | string | null) =>
  value === null ? "No limit" : Number(value).toLocaleString();

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-50";

export default function WeightSlabsManager({
  rateCardId,
  configurationId,
  configurationName,
  configurationCurrency = "NGN",
  rateCardStatus = "DRAFT",
  readOnly = false,
  pricingSections,
}: Props) {
  // Slabs are shared by the configuration; rates are managed separately per slab.
  const filters = useMemo(() => ({ configurationId }), [configurationId]);
  const query = useWeightSlabs(rateCardId, filters);
  const create = useCreateWeightSlab(rateCardId);
  const update = useUpdateWeightSlab(rateCardId);
  const remove = useDeleteWeightSlab(rateCardId);

  const [editing, setEditing] = useState<WeightSlab | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<WeightSlabInput>(emptyForm());
  const [selected, setSelected] = useState<WeightSlab | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [error, setError] = useState("");

  const slabs = query.data ?? [];
  const canManage = !readOnly && rateCardStatus === "DRAFT";
  const isSaving = create.isPending || update.isPending;
  const rateCardIsLocked = !canManage;

  function startCreate() {
    setEditing(null);
    setForm({
      ...emptyForm(),
      configurationId,
      optionId: null,
      pricingSectionId: null,
      displayOrder: slabs.length,
    });
    setError("");
    setNotice(null);
    setFormOpen(true);
  }

  function startEdit(slab: WeightSlab) {
    setEditing(slab);
    setForm({
      configurationId,
      optionId: null,
      pricingSectionId: null,
      label: slab.label,
      minWeightKg: Number(slab.minWeightKg),
      maxWeightKg: slab.maxWeightKg == null ? null : Number(slab.maxWeightKg),
      displayOrder: slab.displayOrder,
    });
    setError("");
    setNotice(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm());
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice(null);

    const payload: WeightSlabInput = {
      ...form,
      configurationId,
      optionId: null,
      pricingSectionId: null,
      label: form.label.trim(),
      minWeightKg: Number(form.minWeightKg),
      maxWeightKg:
        form.maxWeightKg == null || String(form.maxWeightKg).trim() === ""
          ? null
          : Number(form.maxWeightKg),
      displayOrder: Number(form.displayOrder ?? 0),
    };

    if (!payload.label) {
      setError("Enter a label for this weight range.");
      return;
    }
    if (!Number.isFinite(payload.minWeightKg) || payload.minWeightKg < 0) {
      setError("Minimum weight must be zero or greater.");
      return;
    }
    if (
      payload.maxWeightKg != null &&
      (!Number.isFinite(payload.maxWeightKg) || payload.maxWeightKg <= payload.minWeightKg)
    ) {
      setError("Maximum weight must be greater than minimum weight.");
      return;
    }
   const displayOrder = payload.displayOrder ?? 0;

if (!Number.isInteger(displayOrder) || displayOrder < 0) {
  setError("Display order must be a whole number of zero or greater.");
  return;
}

payload.displayOrder = displayOrder;
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, input: payload });
      } else {
        await create.mutateAsync(payload);
      }
      closeForm();
      await query.refetch();
      setNotice({
        type: "success",
        message: editing ? "Weight range updated successfully." : "Weight range created successfully.",
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the weight range.");
    }
  }

  async function deleteSlab(slab: WeightSlab) {
    const confirmed = window.confirm(
      `Delete the “${slab.label}” weight range? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setError("");
    setNotice(null);
    try {
      await remove.mutateAsync(slab.id);
      if (selected?.id === slab.id) setSelected(null);
      await query.refetch();
      setNotice({ type: "success", message: `“${slab.label}” was deleted successfully.` });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete the weight range.");
    }
  }

  if (query.isLoading) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
          <LoaderCircle className="h-6 w-6 animate-spin text-emerald-700" />
        </span>
        <p className="text-sm font-semibold text-slate-800">Loading weight ranges</p>
        <p className="text-xs text-slate-500">Getting the latest pricing configuration…</p>
      </div>
    );
  }

  return (
    <section className="space-y-6 text-slate-800">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <header className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-br from-white via-white to-emerald-50/70 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/70">
              <Ruler className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">Weight slab pricing</h2>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${canManage ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                  {canManage ? "Draft · Editable" : "Read only"}
                </span>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
                {configurationName ? <><span className="font-semibold text-slate-800">{configurationName}</span><span className="mx-2 text-slate-300">/</span></> : null}
                Define each weight range once, then set its rates across the applicable pricing sections.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">Currency: <span className="font-bold text-slate-800">{configurationCurrency}</span></span>
                <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">{pricingSections.length} pricing {pricingSections.length === 1 ? "section" : "sections"}</span>
              </div>
            </div>
          </div>
          {canManage && (
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/10 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" /> Add weight range
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 gap-px border-b border-slate-100 bg-slate-100 sm:grid-cols-3">
          <div className="bg-white p-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Configured ranges</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">{slabs.length}</p>
          </div>
          <div className="bg-white p-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rates recorded</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">
              {slabs.reduce((total, slab) => total + (slab._count?.rates ?? slab.rates?.length ?? 0), 0)}
            </p>
          </div>
          <div className="bg-white p-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rate card status</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
              <span className={`h-2 w-2 rounded-full ${canManage ? "bg-amber-500" : "bg-slate-400"}`} />
              {rateCardStatus}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {notice && (
            <div
              role="status"
              aria-live="polite"
              className={`flex items-start gap-3 rounded-xl border p-4 ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-800"}`}
            >
              {notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />}
              <p className="flex-1 text-sm font-medium">{notice.message}</p>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification" className="rounded-lg p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1">{error}</p>
              <button type="button" onClick={() => setError("")} aria-label="Dismiss error" className="rounded-lg p-1 hover:bg-red-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {query.isError && (
            <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div><p className="font-semibold">Could not load weight ranges</p><p className="mt-1 text-red-700">Check your connection and permissions, then try again.</p></div>
              </div>
              <button type="button" onClick={() => void query.refetch()} className={secondaryButtonClass}>Retry</button>
            </div>
          )}

          {formOpen && (
            <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm ring-4 ring-emerald-50/80">
              <div className="flex items-start justify-between gap-4 border-b border-emerald-100 bg-emerald-50/60 px-4 py-4 sm:px-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Range details</p>
                  <h3 className="mt-1 text-base font-bold text-slate-950">{editing ? "Edit weight range" : "Create a weight range"}</h3>
                  <p className="mt-1 text-sm text-slate-600">You can add the rates after saving this range.</p>
                </div>
                <button type="button" onClick={closeForm} disabled={isSaving} aria-label="Close form" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
                <label className="text-sm font-semibold text-slate-700">Range label
                  <input required maxLength={100} value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="e.g. 0–100 kg" className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">Minimum weight (kg)
                  <input required type="number" min="0" step="0.01" value={form.minWeightKg} onChange={e => setForm(p => ({ ...p, minWeightKg: e.target.value === "" ? 0 : Number(e.target.value) }))} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">Maximum weight (kg)
                  <input type="number" min="0.01" step="0.01" value={form.maxWeightKg ?? ""} onChange={e => setForm(p => ({ ...p, maxWeightKg: e.target.value === "" ? null : Number(e.target.value) }))} placeholder="Leave blank for no limit" className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">Display order
                  <input required type="number" min="0" step="1" value={form.displayOrder ?? 0} onChange={e => setForm(p => ({ ...p, displayOrder: e.target.value === "" ? 0 : Number(e.target.value) }))} className={inputClass} />
                </label>
              </div>
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:justify-end sm:px-5">
                <button type="button" onClick={closeForm} disabled={isSaving} className={secondaryButtonClass}>Cancel</button>
                <button type="submit" disabled={isSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {isSaving ? "Saving range…" : editing ? "Save changes" : "Create range"}
                </button>
              </div>
            </form>
          )}

          {!query.isError && slabs.length === 0 && !formOpen && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200"><Ruler className="h-7 w-7" /></div>
              <h3 className="mt-4 text-base font-bold text-slate-950">No weight ranges yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Create the first range for this configuration. You’ll then be able to open Rates and enter prices across the applicable pricing sections.</p>
              {canManage && <button type="button" onClick={startCreate} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"><Plus className="h-4 w-4" />Create first range</button>}
            </div>
          )}

          {slabs.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div><h3 className="text-sm font-bold text-slate-950">Configured weight ranges</h3><p className="mt-1 text-xs text-slate-500">Manage each range and maintain its pricing values.</p></div>
                <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{slabs.length} {slabs.length === 1 ? "range" : "ranges"}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {slabs.map((slab, index) => {
                  const rateCount = slab._count?.rates ?? slab.rates?.length ?? 0;
                  return (
                    <article key={slab.id} className="group flex flex-col gap-4 px-4 py-4 transition hover:bg-emerald-50/30 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 transition group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-800">{String(index + 1).padStart(2, "0")}</div>
                        <div className="min-w-0">
                          <h4 className="break-words font-bold text-slate-900">{slab.label}</h4>
                          <p className="mt-1 text-xs text-slate-500">Display order: {slab.displayOrder}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600"><span className="font-semibold text-slate-800">{displayWeight(slab.minWeightKg)} kg</span> minimum</span>
                            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600"><span className="font-semibold text-slate-800">{displayWeight(slab.maxWeightKg)}{slab.maxWeightKg === null ? "" : " kg"}</span> maximum</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                          <span className={`h-2 w-2 rounded-full ${rateCount > 0 ? "bg-emerald-500" : "bg-amber-400"}`} />
                          <div><p className="text-xs font-bold text-slate-800">{rateCount} {rateCount === 1 ? "rate" : "rates"}</p><p className="text-[11px] text-slate-500">{rateCount > 0 ? "Values recorded" : "Rates needed"}</p></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                          <button type="button" onClick={() => setSelected(slab)} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 sm:px-4 sm:text-sm">
                            <Eye className="h-4 w-4" /> Rates <ChevronRight className="hidden h-3.5 w-3.5 sm:block" />
                          </button>
                          {canManage ? <>
                            <button type="button" onClick={() => startEdit(slab)} aria-label={`Edit ${slab.label}`} className={secondaryButtonClass}><Pencil className="h-4 w-4" /><span className="sm:hidden">Edit</span></button>
                            <button type="button" onClick={() => void deleteSlab(slab)} disabled={remove.isPending} aria-label={`Delete ${slab.label}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-500/10 disabled:opacity-50"><Trash2 className="h-4 w-4" /><span className="sm:hidden">Delete</span></button>
                          </> : <span className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500"><Info className="h-3.5 w-3.5" />View only</span>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <footer className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-3.5 text-xs leading-5 text-slate-600 sm:px-5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <p>Weight ranges must not overlap. Leave the maximum weight empty only for a range with no upper limit; open-ended ranges should be last.</p>
              </footer>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <SlabRatesEditor
          key={selected.id}
          slab={selected}
          currency={configurationCurrency}
          readOnly={rateCardIsLocked}
          pricingSections={pricingSections}
          onClose={() => setSelected(null)}
          onSaved={() => {
            const savedLabel = selected.label;
            setSelected(null);
            setNotice({
              type: "success",
              message: `Rates for ${savedLabel} saved successfully.`,
            });
            void query.refetch();
          }}
        />
      )}
    </section>
  );
}
