import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleAlert, LoaderCircle, LockKeyhole, PackageCheck, Plane, Ship, Truck } from "lucide-react";
import { Field, inputClass } from "../components/Field";
import { useCalculatePublicQuote, usePublicConfigurations, usePublicRateCards } from "../hooks/use-public-quotation";
import type { CalculateQuoteInput, CalculatedQuote, QuoteDirection, QuoteMode } from "../types/public-quotation.types";

type LoginHandoff = { quoteId: string; quoteNumber: string; selectedQuoteItemIds: string[]; quote: CalculatedQuote };
type Props = { onRequireLogin?: (handoff: LoginHandoff) => void };

const modes = [
  { value: "AIR" as const, label: "Air freight", description: "Fast international cargo", Icon: Plane },
  { value: "LAND" as const, label: "Land transport", description: "Regional road movement", Icon: Truck },
  { value: "SEA" as const, label: "Sea freight", description: "Container shipping", Icon: Ship },
];
const money = (amount: number, currency: string) => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: currency === "CFA" ? "XOF" : currency || "NGN", maximumFractionDigits: 2,
}).format(Number.isFinite(amount) ? amount : 0);

export function PublicQuotationPage({ onRequireLogin }: Props) {
  const [mode, setMode] = useState<QuoteMode>("AIR");
  const [direction, setDirection] = useState<QuoteDirection>("IMPORT");
  const [rateCardId, setRateCardId] = useState("");
  const [configurationId, setConfigurationId] = useState("");
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [airlineId, setAirlineId] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [customsValue, setCustomsValue] = useState("");
  const [freightAmount, setFreightAmount] = useState("");
  const [goodsDescription, setGoodsDescription] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [nafdacRequired, setNafdacRequired] = useState(false);
  const [transportRequired, setTransportRequired] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [quote, setQuote] = useState<CalculatedQuote | null>(null);
  const [formError, setFormError] = useState("");

  const cardsQuery = usePublicRateCards(mode, direction);
  const configsQuery = usePublicConfigurations(rateCardId);
  const calculateMutation = useCalculatePublicQuote();
  const cards = cardsQuery.data ?? [];
  const configurations = configsQuery.data?.configurations ?? [];
  const configuration = useMemo(() => configurations.find((item) => item.id === configurationId), [configurations, configurationId]);

  function clearQuote() { setQuote(null); setSelectedItemIds([]); setFormError(""); }
  function changeMode(next: QuoteMode) { setMode(next); setRateCardId(""); setConfigurationId(""); setOptionIds([]); setAirlineId(""); clearQuote(); }
  function changeDirection(next: QuoteDirection) { setDirection(next); setRateCardId(""); setConfigurationId(""); setOptionIds([]); clearQuote(); }
  function changeCard(next: string) { setRateCardId(next); setConfigurationId(""); setOptionIds([]); setAirlineId(""); clearQuote(); }
  function toggleOption(id: string) { setOptionIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); clearQuote(); }
  function toggleItem(id: string) { setSelectedItemIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }

  async function calculate() {
    setFormError("");
    if (!rateCardId || !configuration) { setFormError("Choose a rate card and pricing configuration first."); return; }
    if (configuration.weightEnabled && Number(weightKg) <= 0) { setFormError("Enter a weight greater than zero."); return; }
    if (configuration.quantityEnabled && Number(quantity) <= 0) { setFormError("Enter a quantity greater than zero."); return; }
    if (configuration.airlineSelectorEnabled && !airlineId) { setFormError("Choose an airline to continue."); return; }

    const payload: CalculateQuoteInput = {
      rateCardId, configurationId: configuration.id, optionIds,
      ...(airlineId ? { airlineId } : {}),
      ...(configuration.weightEnabled ? { weightKg: Number(weightKg) } : {}),
      ...(configuration.quantityEnabled ? { quantity: Number(quantity) } : {}),
      ...(configuration.customsValueEnabled ? { customsValue: Number(customsValue || 0) } : {}),
      ...(configuration.freightAmountEnabled ? { freightAmount: Number(freightAmount || 0) } : {}),
      ...(goodsDescription.trim() ? { goodsDescription: goodsDescription.trim() } : {}),
      ...(hsCode.trim() ? { hsCode: hsCode.trim() } : {}),
      ...(configuration.nafdacEnabled ? { nafdacRequired } : {}),
      ...(configuration.transportEnabled ? { transportRequired } : {}),
    };
    try {
      const result = await calculateMutation.mutateAsync(payload);
      setQuote(result);
      setSelectedItemIds(result.lines.map((line) => line.quoteItemId));
      window.setTimeout(() => document.getElementById("quotation-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      setFormError(e.response?.data?.message ?? e.message ?? "We couldn't calculate this quotation. Please try again.");
    }
  }

  function requestHelp() {
    if (!quote) return;
    if (!selectedItemIds.length) { setFormError("Select at least one service you want help with."); return; }
    if (!onRequireLogin) { setFormError("Connect this action to your existing login/register flow before enabling submissions."); return; }
    onRequireLogin({ quoteId: quote.quoteId, quoteNumber: quote.quoteNumber, selectedQuoteItemIds: selectedItemIds, quote });
  }

  const errorMessage = formError || (cardsQuery.isError ? "Unable to load active rate cards. Please retry." : "");

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-amber-400"><PackageCheck size={21}/></span>
        <div><p className="text-sm font-bold tracking-tight text-slate-950">Freight quotations</p><p className="text-xs text-slate-500">Clear pricing. Confident shipping.</p></div>
        <span className="ml-auto hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 sm:flex"><LockKeyhole size={14} className="text-emerald-600"/> Calculate before signing in</span>
      </div>
    </header>
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-amber-300">AIR · LAND · SEA</span>
        <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Get a shipping quote, <span className="text-amber-400">your way.</span></h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">Configure your shipment, review itemized charges, and choose the services you need help with. You can calculate before you sign in.</p>
      </div>
    </section>
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Step 1</p><h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Shipment details</h2><p className="mt-1 text-sm text-slate-500">Select your shipping method and direction.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">{modes.map(({ value, label, description, Icon }) => <button key={value} type="button" onClick={() => changeMode(value)} aria-pressed={mode === value} className={`flex min-h-20 items-center gap-3 rounded-xl border p-3 text-left transition focus:outline-none focus:ring-4 focus:ring-amber-500/15 ${mode === value ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500" : "border-slate-200 hover:bg-slate-50"}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${mode === value ? "bg-slate-950 text-amber-400" : "bg-slate-100 text-slate-600"}`}><Icon size={20}/></span><span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs text-slate-500">{description}</span></span></button>)}</div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Shipment direction"><div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">{(["IMPORT", "EXPORT"] as const).map((value) => <button key={value} type="button" onClick={() => changeDirection(value)} aria-pressed={direction === value} className={`min-h-10 rounded-lg text-sm font-semibold ${direction === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>{value === "IMPORT" ? "Import" : "Export"}</button>)}</div></Field>
          <Field label="Active rate card" hint="Only active rate cards are listed."><select className={inputClass} value={rateCardId} onChange={(e) => changeCard(e.target.value)} disabled={cardsQuery.isLoading || !cards.length}><option value="">{cardsQuery.isLoading ? "Loading rate cards…" : cards.length ? "Choose a rate card" : "No active rate cards available"}</option>{cards.map((card) => <option key={card.id} value={card.id}>{card.name}</option>)}</select>{cardsQuery.isError && <button type="button" onClick={() => void cardsQuery.refetch()} className="mt-2 text-xs font-semibold text-amber-700">Retry loading rate cards</button>}</Field>
        </div>
        {rateCardId && <div className="mt-4"><Field label="Pricing configuration" hint="Choose the route, container size or pricing option that matches your shipment."><select className={inputClass} value={configurationId} onChange={(e) => { setConfigurationId(e.target.value); setOptionIds([]); setAirlineId(""); clearQuote(); }} disabled={configsQuery.isLoading || !configurations.length}><option value="">{configsQuery.isLoading ? "Loading configurations…" : configurations.length ? "Choose a configuration" : "No active configurations available"}</option>{configurations.map((item) => <option key={item.id} value={item.id}>{[item.name, item.routeLabel, item.equipmentType].filter(Boolean).join(" · ")}</option>)}</select></Field>{configsQuery.isError && <button type="button" onClick={() => void configsQuery.refetch()} className="mt-2 text-xs font-semibold text-amber-700">Retry configurations</button>}</div>}
        {configuration && <div className="mt-7 border-t border-slate-100 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Step 2</p><h3 className="mt-1 text-lg font-bold">{configuration.name}</h3></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold">{configuration.currency}</span></div>
          {configuration.options?.filter((o) => o.isActive !== false).length > 0 && <div className="mt-5"><p className="text-sm font-semibold">Shipment options</p><p className="mt-1 text-xs text-slate-500">Select all options that apply.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{configuration.options.filter((o) => o.isActive !== false).map((option) => <button key={option.id} type="button" aria-pressed={optionIds.includes(option.id)} onClick={() => toggleOption(option.id)} className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border p-3.5 text-left text-sm font-semibold ${optionIds.includes(option.id) ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-slate-300"}`}><span>{option.name}</span>{optionIds.includes(option.id) && <CheckCircle2 size={17} className="text-amber-600"/>}</button>)}</div></div>}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {configuration.weightEnabled && <Field label="Shipment weight (kg)" hint="Enter total chargeable weight."><input className={inputClass} type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="e.g. 125" value={weightKg} onChange={(e) => { setWeightKg(e.target.value); clearQuote(); }}/></Field>}
            {configuration.quantityEnabled && <Field label="Quantity"><input className={inputClass} type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(e) => { setQuantity(e.target.value); clearQuote(); }}/></Field>}
            {configuration.customsValueEnabled && <Field label={`Customs value (${configuration.currency})`}><input className={inputClass} type="number" min="0" step="0.01" inputMode="decimal" placeholder="0.00" value={customsValue} onChange={(e) => { setCustomsValue(e.target.value); clearQuote(); }}/></Field>}
            {configuration.freightAmountEnabled && <Field label={`Freight amount (${configuration.currency})`}><input className={inputClass} type="number" min="0" step="0.01" inputMode="decimal" placeholder="0.00" value={freightAmount} onChange={(e) => { setFreightAmount(e.target.value); clearQuote(); }}/></Field>}
            {configuration.airlineSelectorEnabled && <Field label="Airline"><select className={inputClass} value={airlineId} onChange={(e) => { setAirlineId(e.target.value); clearQuote(); }}><option value="">Choose airline</option>{configuration.airlines.filter((a) => a.isActive !== false).map((airline) => <option key={airline.id} value={airline.id}>{airline.name} ({airline.code})</option>)}</select></Field>}
            {configuration.nafdacEnabled && <Field label="NAFDAC service"><span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-3"><input type="checkbox" checked={nafdacRequired} onChange={(e) => { setNafdacRequired(e.target.checked); clearQuote(); }} className="h-4 w-4 accent-amber-500"/>Include NAFDAC assistance</span></Field>}
            {configuration.transportEnabled && <Field label="Transport service"><span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-3"><input type="checkbox" checked={transportRequired} onChange={(e) => { setTransportRequired(e.target.checked); clearQuote(); }} className="h-4 w-4 accent-amber-500"/>Include transport</span></Field>}
            <Field label="Goods description" hint="Optional"><input className={inputClass} placeholder="What are you shipping?" value={goodsDescription} onChange={(e) => { setGoodsDescription(e.target.value); clearQuote(); }}/></Field>
            <Field label="HS code" hint="Optional customs classification"><input className={inputClass} placeholder="Enter HS code if known" value={hsCode} onChange={(e) => { setHsCode(e.target.value); clearQuote(); }}/></Field>
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-md text-xs leading-5 text-slate-500">The backend calculates using saved active rates. Variable charges may require manual review.</p><button type="button" onClick={() => void calculate()} disabled={calculateMutation.isPending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 sm:w-auto">{calculateMutation.isPending ? <LoaderCircle size={17} className="animate-spin"/> : <ArrowRight size={17} />}{calculateMutation.isPending ? "Calculating…" : "Calculate quotation"}</button></div>
        </div>}
        {errorMessage && <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><CircleAlert size={18} className="mt-0.5 shrink-0"/><span>{errorMessage}</span></div>}
        {quote && <section id="quotation-results" className="mt-8 scroll-mt-5 overflow-hidden rounded-2xl border border-slate-200"><div className="bg-slate-950 p-5 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-widest text-amber-400">Quotation estimate</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{money(quote.totalAmount, quote.currency)}</h2><p className="mt-2 text-sm text-slate-300">Reference: <span className="font-semibold text-white">{quote.quoteNumber}</span></p>{quote.requiresReview ? <p className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">Some charges require manual review; the total may change after review.</p> : <p className="mt-4 flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={17}/>Calculated from saved active rates</p>}</div>
          <div className="p-4 sm:p-6"><h3 className="font-bold">Choose services you need help with</h3><p className="mt-1 text-sm text-slate-500">Your selections are recorded separately and do not alter the original quote.</p><div className="mt-4 space-y-3">{quote.lines.map((line) => <label key={line.quoteItemId} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${selectedItemIds.includes(line.quoteItemId) ? "border-amber-400 bg-amber-50/60" : "border-slate-200 hover:border-slate-300"}`}><input type="checkbox" checked={selectedItemIds.includes(line.quoteItemId)} onChange={() => toggleItem(line.quoteItemId)} className="mt-1 h-4 w-4 accent-amber-500"/><span className="min-w-0 flex-1"><span className="block font-semibold">{line.componentName}{line.isEstimate && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">Estimate</span>}</span>{line.remarks && <span className="mt-1 block text-xs leading-5 text-slate-500">{line.remarks}</span>}{line.quantity > 1 && line.unit && <span className="mt-1 block text-xs text-slate-500">{line.quantity} {line.unit}</span>}</span><span className="shrink-0 text-right text-sm font-bold tabular-nums">{money(line.lineTotal, quote.currency)}</span></label>)}</div>
            <div className="mt-5 rounded-xl bg-slate-50 p-4 sm:p-5"><div className="flex justify-between gap-3 text-sm text-slate-600"><span>Subtotal</span><span className="font-semibold tabular-nums">{money(quote.subtotal, quote.currency)}</span></div><div className="mt-3 flex justify-between gap-3 text-sm text-slate-600"><span>VAT / tax</span><span className="font-semibold tabular-nums">{money(quote.taxAmount, quote.currency)}</span></div><div className="mt-4 flex justify-between gap-3 border-t border-slate-200 pt-4"><span className="font-bold">Estimated total</span><span className="text-lg font-bold tabular-nums">{money(quote.totalAmount, quote.currency)}</span></div></div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">{selectedItemIds.length} of {quote.lines.length} services selected</p><button type="button" onClick={requestHelp} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-400/30">Request help with selected services <ArrowRight size={17}/></button></div>
          </div>
        </section>}
      </section>
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">How it works</p><ol className="mt-4 space-y-4">{[["Choose", "Select mode, direction and configuration."], ["Calculate", "Get an itemized estimate using active rates."], ["Request", "Choose services and sign in before submitting."]].map(([title, body], index) => <li key={title} className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold">{index + 1}</span><span><b className="text-sm">{title}</b><span className="mt-1 block text-xs leading-5 text-slate-500">{body}</span></span></li>)}</ol></div><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="flex items-center gap-2 text-sm font-bold text-emerald-950"><LockKeyhole size={17}/>Calculate without an account</p><p className="mt-2 text-xs leading-5 text-emerald-900/80">You can review the estimate first. Sign-in is required when you are ready to send a request.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-bold">Need a custom quote?</p><p className="mt-2 text-xs leading-5 text-slate-500">Variable charges and unavailable rates may require the quotation team to review your shipment.</p></div></aside>
    </div>
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">Rates follow the active pricing configuration and may be subject to review.</footer>
  </main>;
}

export default PublicQuotationPage;
