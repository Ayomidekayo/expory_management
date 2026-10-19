import { useMemo, useState } from "react";
import { useCreateWeightSlab, useDeleteWeightSlab, useUpdateWeightSlab, useWeightSlabs } from "../hooks/use-weight-slabs";
import type { WeightSlab, WeightSlabInput } from "../types/weight-slab.types";
import SlabRatesEditor from "./SlabRatesEditor";

type Props = { rateCardId: string; configurationId: string; configurationName?: string; configurationCurrency?: string; optionId?: string | null; pricingSectionId?: string | null; rateCardStatus?: string; readOnly?: boolean };
const emptyForm = (): WeightSlabInput => ({ label: "", minWeightKg: 0, maxWeightKg: null, displayOrder: 0 });
const displayWeight = (value: number | string | null) => value === null ? "No limit" : Number(value).toLocaleString();

export default function WeightSlabsManager({ rateCardId, configurationId, configurationName, configurationCurrency = "NGN", optionId, pricingSectionId, rateCardStatus = "DRAFT", readOnly = false }: Props) {
  const filters = useMemo(() => ({ configurationId, ...(optionId ? { optionId } : {}), ...(pricingSectionId ? { pricingSectionId } : {}) }), [configurationId, optionId, pricingSectionId]);
  const query = useWeightSlabs(rateCardId, filters);
  const create = useCreateWeightSlab(rateCardId);
  const update = useUpdateWeightSlab(rateCardId);
  const remove = useDeleteWeightSlab(rateCardId);
  const [editing, setEditing] = useState<WeightSlab | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<WeightSlabInput>(emptyForm());
  const [selected, setSelected] = useState<WeightSlab | null>(null);
  const [error, setError] = useState("");
  const slabs = query.data ?? [];
  const canManage = !readOnly && rateCardStatus === "DRAFT";

  function startCreate() { setEditing(null); setForm({ ...emptyForm(), configurationId, optionId: optionId ?? null, pricingSectionId: pricingSectionId ?? null, displayOrder: slabs.length }); setError(""); setFormOpen(true); }
  function startEdit(s: WeightSlab) { setEditing(s); setForm({ configurationId: s.configurationId, optionId: s.optionId, pricingSectionId: s.pricingSectionId, label: s.label, minWeightKg: Number(s.minWeightKg), maxWeightKg: s.maxWeightKg === null ? null : Number(s.maxWeightKg), displayOrder: s.displayOrder }); setError(""); setFormOpen(true); }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const payload: WeightSlabInput = { ...form, configurationId, optionId: optionId ?? null, pricingSectionId: pricingSectionId ?? null, minWeightKg: Number(form.minWeightKg), maxWeightKg: form.maxWeightKg === null || form.maxWeightKg === undefined || String(form.maxWeightKg).trim() === "" ? null : Number(form.maxWeightKg), displayOrder: Number(form.displayOrder ?? 0) };
    if (payload.maxWeightKg !== null && payload.maxWeightKg !== undefined && payload.maxWeightKg <= payload.minWeightKg) { setError("Maximum weight must be greater than minimum weight."); return; }
    try { if (editing) await update.mutateAsync({ id: editing.id, input: payload }); else await create.mutateAsync(payload); setFormOpen(false); setEditing(null); setForm(emptyForm()); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to save weight slab."); }
  }
  async function deleteSlab(s: WeightSlab) { if (!window.confirm(`Delete "${s.label}"? This cannot be undone.`)) return; setError(""); try { await remove.mutateAsync(s.id); if (selected?.id === s.id) setSelected(null); } catch (err) { setError(err instanceof Error ? err.message : "Unable to delete slab."); } }

  if (query.isLoading) return <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">Loading weight slabs…</div>;
  return <section className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-lg font-semibold text-slate-900">Weight slabs</h2><p className="mt-1 text-sm text-slate-500">{configurationName ? `${configurationName} · ` : ""}Define weight ranges and component prices for each range.</p></div>{canManage && <button type="button" onClick={startCreate} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Add weight slab</button>}</div>
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {query.isError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Could not load weight slabs. Check the API route and permissions. <button type="button" className="ml-2 underline" onClick={() => void query.refetch()}>Retry</button></div>}
    {formOpen && <form onSubmit={submit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"><div className="sm:col-span-2 lg:col-span-4 font-semibold">{editing ? "Edit weight slab" : "Create weight slab"}</div>
      <label className="space-y-1 text-sm font-medium">Label<input required maxLength={100} value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="e.g. 0–100 kg" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="space-y-1 text-sm font-medium">Minimum weight (kg)<input required type="number" min="0" step="0.01" value={form.minWeightKg} onChange={e => setForm(p => ({ ...p, minWeightKg: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="space-y-1 text-sm font-medium">Maximum weight (kg)<input type="number" min="0.01" step="0.01" value={form.maxWeightKg ?? ""} onChange={e => setForm(p => ({ ...p, maxWeightKg: e.target.value === "" ? null : Number(e.target.value) }))} placeholder="Blank = no upper limit" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="space-y-1 text-sm font-medium">Display order<input required type="number" min="0" step="1" value={form.displayOrder ?? 0} onChange={e => setForm(p => ({ ...p, displayOrder: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-4"><button disabled={create.isPending || update.isPending} type="submit" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{create.isPending || update.isPending ? "Saving…" : editing ? "Save changes" : "Create slab"}</button><button type="button" onClick={() => { setFormOpen(false); setEditing(null); }} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Cancel</button></div>
    </form>}
    {!query.isError && slabs.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center"><h3 className="font-semibold">No weight slabs yet</h3><p className="mt-1 text-sm text-slate-500">Create the first weight range for this configuration.</p>{canManage && <button type="button" onClick={startCreate} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create first slab</button>}</div>}
    {slabs.length > 0 && <div className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Label</th><th className="px-4 py-3">Min (kg)</th><th className="px-4 py-3">Max (kg)</th><th className="px-4 py-3">Rates configured</th><th className="px-4 py-3">Order</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{slabs.map(s => <tr key={s.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-medium">{s.label}</td><td className="px-4 py-3">{displayWeight(s.minWeightKg)}</td><td className="px-4 py-3">{displayWeight(s.maxWeightKg)}</td><td className="px-4 py-3">{s._count?.rates ?? s.rates?.length ?? 0}</td><td className="px-4 py-3">{s.displayOrder}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => setSelected(s)} className="rounded-md border px-3 py-1.5 text-xs font-semibold">Rates</button>{canManage && <><button type="button" onClick={() => startEdit(s)} className="rounded-md border px-3 py-1.5 text-xs font-semibold">Edit</button><button type="button" onClick={() => void deleteSlab(s)} disabled={remove.isPending} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Delete</button></>}</div></td></tr>)}</tbody></table></div><p className="border-t px-4 py-3 text-xs text-slate-500">Currency: {configurationCurrency}. “No limit” means an open-ended final slab.</p></div>}
    {selected && <SlabRatesEditor key={selected.id} slab={selected} currency={configurationCurrency} readOnly={!canManage} onClose={() => setSelected(null)} />}
  </section>;
}
