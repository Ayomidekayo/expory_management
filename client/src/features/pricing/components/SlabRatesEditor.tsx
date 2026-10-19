import { useMemo, useState } from "react";
import { useRateComponents } from "../hooks/use-rate-components";
import { useSetWeightSlabRates, useWeightSlab } from "../hooks/use-weight-slabs";
import type { WeightSlab, WeightSlabRate } from "../types/weight-slab.types";

type Props = { slab: WeightSlab; currency: string; readOnly: boolean; onClose: () => void };
const rateAmount = (rate?: WeightSlabRate) => rate?.amount == null ? "" : String(rate.amount);

export default function SlabRatesEditor({ slab, currency, readOnly, onClose }: Props) {
  const slabQuery = useWeightSlab(slab.id);
  const componentsQuery = useRateComponents(slab.rateCardId);
  const saveRates = useSetWeightSlabRates(slab.rateCardId);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const current = slabQuery.data ?? slab;
  const components = useMemo(() => (componentsQuery.data ?? []).filter(c => {
    if (c.calculationType !== "WEIGHT_SLAB" || !c.isActive) return false;
    if (current.configurationId && c.configurationId !== current.configurationId) return false;
    if (current.optionId && c.optionId !== current.optionId) return false;
    if (current.pricingSectionId && c.pricingSectionId !== current.pricingSectionId) return false;
    return true;
  }), [componentsQuery.data, current.configurationId, current.optionId, current.pricingSectionId]);
  const saved = current.rates ?? [];
  const valueFor = (id: string) => Object.prototype.hasOwnProperty.call(amounts, id) ? amounts[id] : rateAmount(saved.find(r => r.componentId === id));

  async function submit() {
    setError("");
    const rates = components.filter(c => valueFor(c.id).trim() !== "").map(c => ({ componentId: c.id, amount: Number(valueFor(c.id)) }));
    if (rates.some(r => !Number.isFinite(r.amount) || r.amount < 0)) { setError("Enter valid non-negative amounts."); return; }
    if (!rates.length) { setError("Enter at least one component rate before saving."); return; }
    try { await saveRates.mutateAsync({ weightSlabId: current.id, input: { rates } }); await slabQuery.refetch(); setAmounts({}); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to save slab rates."); }
  }

  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><header className="flex flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-start"><div><h3 className="font-semibold text-slate-900">Rates for {current.label}</h3><p className="mt-1 text-sm text-slate-500">Enter the price of each active weight-based component in {currency}.</p></div><button type="button" onClick={onClose} className="self-start rounded-lg border px-3 py-2 text-sm">Close</button></header>
    {(componentsQuery.isError || slabQuery.isError) && <div role="alert" className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Unable to load components or saved rates. Check the API response and try again.</div>}
    {error && <div role="alert" className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {componentsQuery.isLoading || slabQuery.isLoading ? <p className="p-5 text-sm text-slate-500">Loading component rates…</p> : components.length === 0 ? <p className="p-6 text-sm text-slate-500">No active WEIGHT_SLAB components match this pricing scope. Create or update the relevant rate components first.</p> : <><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Component</th><th className="px-4 py-3">Taxable</th><th className="px-4 py-3">Amount ({currency})</th></tr></thead><tbody className="divide-y divide-slate-100">{components.map(c => <tr key={c.id}><td className="px-4 py-3"><div className="font-medium text-slate-900">{c.name}</div>{c.code && <div className="text-xs text-slate-500">{c.code}</div>}{c.isOptional && <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Optional</span>}</td><td className="px-4 py-3">{c.isTaxable ? "Yes" : "No"}</td><td className="px-4 py-3"><input type="number" min="0" step="0.01" disabled={readOnly || saveRates.isPending} value={valueFor(c.id)} onChange={e => setAmounts(p => ({ ...p, [c.id]: e.target.value }))} placeholder="Enter rate" className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100" /></td></tr>)}</tbody></table></div>{!readOnly && <footer className="flex flex-col justify-between gap-3 border-t p-4 sm:flex-row sm:items-center"><p className="text-xs text-slate-500">Blank fields are not submitted. With the current backend, previously saved rates remain if omitted.</p><button type="button" onClick={() => void submit()} disabled={saveRates.isPending} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saveRates.isPending ? "Saving rates…" : "Save rates"}</button></footer>}</>}
  </section>;
}
