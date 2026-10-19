import { useState, type FormEvent } from "react";
import { AlertCircle, Check, LoaderCircle, Settings2 } from "lucide-react";
import type { CreateRateConfigurationInput, RateCard } from "../types/pricing.types";


type Props = {
  rateCard: RateCard;
  isSubmitting: boolean;
  onSubmit: (input: CreateRateConfigurationInput) => Promise<void>;
  onCancel: () => void;
};

type FormState = {
  name: string; code: string; currency: "NGN" | "CFA";
  routeCode: string; routeLabel: string; equipmentType: string;
  weightEnabled: boolean; freightAmountEnabled: boolean; customsValueEnabled: boolean;
  quantityEnabled: boolean; airlineSelectorEnabled: boolean; transportEnabled: boolean;
  nafdacEnabled: boolean; vatEnabled: boolean; vatPercentage: string;
  vatCalculationBasis: "SUBTOTAL" | "CUSTOMS_VALUE" | "FREIGHT_AMOUNT";
  displayOrder: string;
};

const initialState: FormState = {
  name: "", code: "", currency: "NGN", routeCode: "", routeLabel: "", equipmentType: "",
  weightEnabled: false, freightAmountEnabled: false, customsValueEnabled: false,
  quantityEnabled: false, airlineSelectorEnabled: false, transportEnabled: false,
  nafdacEnabled: false, vatEnabled: true, vatPercentage: "7.5",
  vatCalculationBasis: "SUBTOTAL", displayOrder: "0",
};

const inputClass = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const sectionClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

function Toggle({ label, description, checked, onChange, disabled = false }: {
  label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean;
}) {
  return <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${checked ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200 bg-white"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
    <input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-emerald-700" />
    <span><span className="block text-sm font-semibold text-slate-900">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span></span>
  </label>;
}

export default function RateCardConfigurationForm({ rateCard, isSubmitting, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const isAir = rateCard.mode === "AIR";
  const isLand = rateCard.mode === "LAND";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const name = form.name.trim();
    const code = form.code.trim().toUpperCase();
    if (!name || !code) return setError("Configuration name and code are required.");
    if (isLand && Boolean(form.routeCode.trim()) !== Boolean(form.routeLabel.trim())) {
      return setError("Enter both route code and route label, or leave both empty.");
    }
    const vatPercentage = Number(form.vatPercentage);
    if (form.vatEnabled && (!Number.isFinite(vatPercentage) || vatPercentage < 0 || vatPercentage > 100)) {
      return setError("VAT percentage must be between 0 and 100.");
    }

    const payload: CreateRateConfigurationInput = {
      name, code, currency: form.currency,
      weightEnabled: form.weightEnabled,
      freightAmountEnabled: form.freightAmountEnabled,
      customsValueEnabled: form.customsValueEnabled,
      quantityEnabled: form.quantityEnabled,
      airlineSelectorEnabled: isAir && form.airlineSelectorEnabled,
      transportEnabled: form.transportEnabled,
      nafdacEnabled: form.nafdacEnabled,
      vatEnabled: form.vatEnabled,
      ...(form.vatEnabled ? { vatPercentage, vatCalculationBasis: form.vatCalculationBasis } : {}),
      ...(isLand && form.routeCode.trim() && form.routeLabel.trim()
        ? { routeCode: form.routeCode.trim().toUpperCase(), routeLabel: form.routeLabel.trim() } : {}),
      ...(form.equipmentType.trim() ? { equipmentType: form.equipmentType.trim() } : {}),
      displayOrder: Number(form.displayOrder) || 0,
      isActive: true,
    };
    try { await onSubmit(payload); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to create configuration."); }
  }

  const features = [
    ["weightEnabled", "Weight-based calculation", "Ask for shipment weight and apply configured slabs or per-kg rates."],
    ["freightAmountEnabled", "Freight amount input", "Collect freight amount when a pricing rule requires it."],
    ["customsValueEnabled", "Customs value input", "Collect customs or invoice value when required."],
    ["quantityEnabled", "Quantity input", "Allow charges to be calculated per item or unit."],
    ["transportEnabled", "Transport", "Make transport available for this configuration."],
    ["nafdacEnabled", "NAFDAC", "Make NAFDAC charges available for this configuration."],
  ] as const;

  return <form onSubmit={handleSubmit} className="space-y-6">
    {error && <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" /><span>{error}</span></div>}

    <section className={sectionClass}>
      <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Settings2 className="h-5 w-5" /></div><div><h2 className="font-semibold text-slate-900">Configuration details</h2><p className="mt-1 text-sm text-slate-500">{rateCard.mode} {rateCard.direction} · define how this pricing setup works.</p></div></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Configuration name *<input className={inputClass} value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Standard Air Import" maxLength={120} required /></label>
        <label className="text-sm font-medium text-slate-700">Configuration code *<input className={inputClass} value={form.code} onChange={e => update("code", e.target.value.toUpperCase().replace(/\s+/g, "_"))} placeholder="e.g. STANDARD_AIR_IMPORT" maxLength={40} required /></label>
        <label className="text-sm font-medium text-slate-700">Currency<select className={inputClass} value={form.currency} onChange={e => update("currency", e.target.value as FormState["currency"])}><option value="NGN">NGN — Nigerian Naira</option><option value="CFA">CFA — West African CFA franc (XOF)</option></select></label>
        <label className="text-sm font-medium text-slate-700">Display order<input className={inputClass} type="number" min="0" step="1" value={form.displayOrder} onChange={e => update("displayOrder", e.target.value)} /></label>
        {isLand && <>
          <label className="text-sm font-medium text-slate-700">Route code<input className={inputClass} value={form.routeCode} onChange={e => update("routeCode", e.target.value.toUpperCase())} placeholder="e.g. COTONOU_SEME" /></label>
          <label className="text-sm font-medium text-slate-700">Route label<input className={inputClass} value={form.routeLabel} onChange={e => update("routeLabel", e.target.value)} placeholder="e.g. Cotonou → Seme" /></label>
        </>}
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Equipment type (optional)<input className={inputClass} value={form.equipmentType} onChange={e => update("equipmentType", e.target.value)} placeholder="e.g. 20FT, 40FT, Long Truck" /><span className="mt-1 block text-xs font-normal text-slate-500">For multiple selectable equipment choices, create Options after saving.</span></label>
      </div>
    </section>

    <section className={sectionClass}>
      <h2 className="font-semibold text-slate-900">Calculation features</h2><p className="mt-1 text-sm text-slate-500">Enable only the inputs and services this pricing setup needs.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {features.map(([key, label, description]) => <Toggle key={key} label={label} description={description} checked={form[key]} onChange={checked => update(key, checked)} />)}
        <Toggle label="Airline selector" description="Let the exporter choose an airline with its configured freight rate per kilogram." checked={form.airlineSelectorEnabled} disabled={!isAir} onChange={checked => update("airlineSelectorEnabled", checked)} />
      </div>
      {!isAir && <p className="mt-3 text-xs text-slate-500">Airline selection is available only for Air rate cards.</p>}
    </section>

    <section className={sectionClass}>
      <div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-slate-900">VAT settings</h2><p className="mt-1 text-sm text-slate-500">VAT applies only to selected charges marked taxable in the pricing editor.</p></div><label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.vatEnabled} onChange={e => update("vatEnabled", e.target.checked)} className="h-4 w-4 accent-emerald-700" />Enable VAT</label></div>
      {form.vatEnabled && <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">VAT percentage<div className="relative"><input className={inputClass} type="number" min="0" max="100" step="0.01" value={form.vatPercentage} onChange={e => update("vatPercentage", e.target.value)} required /><span className="absolute right-3 top-3 text-sm text-slate-400">%</span></div></label>
        <label className="text-sm font-medium text-slate-700">VAT calculation basis<select className={inputClass} value={form.vatCalculationBasis} onChange={e => update("vatCalculationBasis", e.target.value as FormState["vatCalculationBasis"])}><option value="SUBTOTAL">Subtotal of selected taxable charges</option><option value="CUSTOMS_VALUE">Customs value</option><option value="FREIGHT_AMOUNT">Freight amount</option></select></label>
      </div>}
      <p className="mt-3 text-xs leading-5 text-slate-500">Enabling VAT does not automatically make every charge taxable. Configure each charge's taxable flag separately.</p>
    </section>

    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
      <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{isSubmitting ? "Creating configuration..." : "Create Configuration"}</button>
    </div>
  </form>;
}
