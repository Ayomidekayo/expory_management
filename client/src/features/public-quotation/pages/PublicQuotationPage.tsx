import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  LockKeyhole,
  PackageCheck,
  Plane,
  Ship,
  Truck,
} from "lucide-react";
import { Field, inputClass } from "../components/Field";
import {
  useCalculatePublicQuote,
  usePublicConfigurations,
  usePublicRateCards,
} from "../hooks/use-public-quotation";
import type {
  CalculateQuoteInput,
  CalculatedQuote,
  QuoteDirection,
  QuoteMode,
} from "../types/public-quotation.types";

type LoginHandoff = {
  quoteId: string;
  quoteNumber: string;
  selectedQuoteItemIds: string[];
  quote: CalculatedQuote;
};

type Props = {
  onRequireLogin?: (handoff: LoginHandoff) => void;
};

const modes = [
  {
    value: "AIR" as const,
    label: "Air freight",
    description: "Fast international cargo",
    Icon: Plane,
  },
  {
    value: "LAND" as const,
    label: "Land transport",
    description: "Regional road movement",
    Icon: Truck,
  },
  {
    value: "SEA" as const,
    label: "Sea freight",
    description: "Container shipping",
    Icon: Ship,
  },
];

const money = (amount: number, currency: string) => {
  const normalizedCurrency = currency === "CFA" ? "XOF" : currency || "NGN";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${normalizedCurrency} ${new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0)}`;
  }
};

const primaryButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

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
  const configuration = useMemo(
    () => configurations.find((item) => item.id === configurationId),
    [configurations, configurationId],
  );

  // The public page hides internal pricing IDs. Auto-select only when there is
  // exactly one active rate card for the chosen shipment mode and direction.
  useEffect(() => {
    if (cardsQuery.isLoading || cardsQuery.isError) return;
    if (cards.length === 1 && rateCardId !== cards[0].id) {
      setRateCardId(cards[0].id);
      setConfigurationId("");
      setOptionIds([]);
      setAirlineId("");
      setQuote(null);
      setSelectedItemIds([]);
    } else if (cards.length !== 1 && rateCardId) {
      setRateCardId("");
      setConfigurationId("");
      setOptionIds([]);
      setAirlineId("");
      setQuote(null);
      setSelectedItemIds([]);
    }
  }, [cards, cardsQuery.isLoading, cardsQuery.isError, rateCardId]);

  function clearQuote() {
    setQuote(null);
    setSelectedItemIds([]);
    setFormError("");
  }

  function changeMode(next: QuoteMode) {
    setMode(next);
    setRateCardId("");
    setConfigurationId("");
    setOptionIds([]);
    setAirlineId("");
    setQuote(null);
    setSelectedItemIds([]);
    setFormError("");
  }

  function changeDirection(next: QuoteDirection) {
    setDirection(next);
    setRateCardId("");
    setConfigurationId("");
    setOptionIds([]);
    setAirlineId("");
    setQuote(null);
    setSelectedItemIds([]);
    setFormError("");
  }

  function toggleOption(id: string) {
    setOptionIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    clearQuote();
  }

  function toggleItem(id: string) {
    setSelectedItemIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setFormError("");
  }

  async function calculate() {
    setFormError("");

    if (cards.length !== 1 || !rateCardId || !configuration) {
      setFormError(
        cards.length > 1
          ? "More than one active pricing schedule matches this shipment. Please contact the quotation team."
          : "No active pricing option is available for this shipment yet.",
      );
      return;
    }
    if (configuration.weightEnabled && (!weightKg || Number(weightKg) <= 0)) {
      setFormError("Enter a shipment weight greater than zero.");
      return;
    }
    if (configuration.quantityEnabled && (!quantity || Number(quantity) <= 0)) {
      setFormError("Enter a quantity greater than zero.");
      return;
    }
    if (configuration.airlineSelectorEnabled && !airlineId) {
      setFormError("Choose an airline to continue.");
      return;
    }
    if (configuration.customsValueEnabled && Number(customsValue || 0) < 0) {
      setFormError("Customs value cannot be negative.");
      return;
    }
    if (configuration.freightAmountEnabled && Number(freightAmount || 0) < 0) {
      setFormError("Freight amount cannot be negative.");
      return;
    }

    const payload: CalculateQuoteInput = {
      rateCardId,
      configurationId: configuration.id,
      optionIds,
      ...(airlineId ? { airlineId } : {}),
      ...(configuration.weightEnabled ? { weightKg: Number(weightKg) } : {}),
      ...(configuration.quantityEnabled ? { quantity: Number(quantity) } : {}),
      ...(configuration.customsValueEnabled
        ? { customsValue: Number(customsValue || 0) }
        : {}),
      ...(configuration.freightAmountEnabled
        ? { freightAmount: Number(freightAmount || 0) }
        : {}),
      ...(goodsDescription.trim()
        ? { goodsDescription: goodsDescription.trim() }
        : {}),
      ...(hsCode.trim() ? { hsCode: hsCode.trim() } : {}),
      ...(configuration.nafdacEnabled ? { nafdacRequired } : {}),
      ...(configuration.transportEnabled ? { transportRequired } : {}),
    };

    try {
      const result = await calculateMutation.mutateAsync(payload);
      setQuote(result);
      setSelectedItemIds(result.lines.map((line) => line.quoteItemId));
      window.setTimeout(() => {
        document
          .getElementById("quotation-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (error: unknown) {
      const e = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setFormError(
        e.response?.data?.message ??
          e.message ??
          "We couldn't calculate this quotation. Please try again.",
      );
    }
  }

  function requestHelp() {
    if (!quote) return;
    if (!selectedItemIds.length) {
      setFormError("Select at least one service you want help with.");
      return;
    }
    if (!onRequireLogin) {
      setFormError(
        "The login/register handoff is not connected yet. Please contact the quotation team.",
      );
      return;
    }
    onRequireLogin({
      quoteId: quote.quoteId,
      quoteNumber: quote.quoteNumber,
      selectedQuoteItemIds: selectedItemIds,
      quote,
    });
  }

  const errorMessage = formError;
  const hasSingleCard = cards.length === 1 && Boolean(rateCardId);

  return (
    <main className="min-h-screen overflow-x-hidden bg-emerald-50/40 text-slate-900">
      <header className="border-b border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm shadow-emerald-900/10">
            <PackageCheck size={21} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-tight text-emerald-950">
              Freight quotations
            </p>
            <p className="text-xs text-slate-500">Clear pricing. Confident shipping.</p>
          </div>
          <span className="ml-auto hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 sm:flex">
            <LockKeyhole size={14} aria-hidden="true" /> Calculate before signing in
          </span>
        </div>
      </header>

      <section className="bg-gradient-to-br from-emerald-950 via-emerald-800 to-green-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-50">
            AIR · LAND · SEA
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Get a shipping quote, <span className="text-lime-300">your way.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/90 sm:text-base sm:leading-7">
            Choose your shipment, see an itemized estimate, and select the services you need. No account is needed to calculate a quote.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/90">
            <span className="rounded-full bg-white/10 px-3 py-1.5">Transparent charges</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">Itemized estimate</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">Sign in only to submit</span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl min-w-0 gap-5 px-3 py-5 sm:gap-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <section className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-7">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-extrabold text-emerald-800">1</span>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Shipment details</h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">First, choose how your goods will travel.</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {modes.map(({ value, label, description, Icon }) => {
              const selected = mode === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => changeMode(value)}
                  aria-pressed={selected}
                  className={`flex min-h-[84px] min-w-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-500/15 sm:flex-col sm:items-start sm:p-4 lg:flex-row lg:items-center ${
                    selected
                      ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                      : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
                  }`}
                >
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${selected ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{label}</span>
                    <span className="mt-1 block text-xs leading-4 text-slate-500">{description}</span>
                  </span>
                  {selected && <CheckCircle2 size={18} className="shrink-0 text-emerald-700" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <Field label="Shipment direction">
              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                {(["IMPORT", "EXPORT"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => changeDirection(value)}
                    aria-pressed={direction === value}
                    className={`min-h-11 rounded-lg text-sm font-bold transition ${direction === value ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {value === "IMPORT" ? "Import" : "Export"}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {cardsQuery.isLoading && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-800" role="status">
              <LoaderCircle size={17} className="animate-spin" /> Finding available shipment options…
            </div>
          )}

          {cardsQuery.isError && (
            <div role="alert" className="mt-5 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
              <span>We couldn't load the available shipping options.</span>
              <button type="button" onClick={() => void cardsQuery.refetch()} className="self-start font-bold underline sm:self-auto">Try again</button>
            </div>
          )}

          {!cardsQuery.isLoading && !cardsQuery.isError && cards.length === 0 && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              No shipping options are currently available for this selection. Please contact our quotation team for assistance.
            </div>
          )}

          {cards.length > 1 && (
            <div role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              More than one active pricing schedule matches this shipment. Please ask the administrator to configure one active schedule for this shipping method and direction.
            </div>
          )}

          {hasSingleCard && configsQuery.isLoading && (
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500" role="status">
              <LoaderCircle size={16} className="animate-spin" /> Loading shipment choices…
            </div>
          )}

          {configsQuery.isError && (
            <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              We couldn't load the shipment choices. <button type="button" onClick={() => void configsQuery.refetch()} className="font-bold underline">Try again</button>
            </div>
          )}

          {hasSingleCard && !configsQuery.isLoading && !configsQuery.isError && configurations.length === 0 && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              Shipment options have not been configured for this service yet.
            </div>
          )}

          {hasSingleCard && configurations.length > 0 && (
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-extrabold text-emerald-800">2</span>
                <div>
                  <h3 className="text-lg font-extrabold">Choose your shipment option</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {mode === "AIR" ? "Choose the available air freight service." : mode === "LAND" ? "Choose the route or truck type for your goods." : "Choose the container or sea freight service."}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {configurations.map((item) => {
                  const selected = configurationId === item.id;
                  const title = item.equipmentType || item.routeLabel || item.name;
                  const subtitle = [
                    item.routeLabel && item.routeLabel !== title ? item.routeLabel : "",
                    item.name && item.name !== title && item.name !== item.routeLabel ? item.name : "",
                  ].filter(Boolean).join(" · ");
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setConfigurationId(item.id);
                        setOptionIds([]);
                        setAirlineId("");
                        clearQuote();
                      }}
                      className={`flex min-h-[88px] min-w-0 items-center justify-between gap-3 rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-emerald-500/15 ${selected ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600" : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40"}`}
                    >
                      <span className="min-w-0">
                        <span className="block break-words text-sm font-bold text-slate-900">{title}</span>
                        {subtitle && <span className="mt-1 block text-xs leading-5 text-slate-500">{subtitle}</span>}
                        <span className="mt-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">{item.currency}</span>
                      </span>
                      {selected && <CheckCircle2 size={20} className="shrink-0 text-emerald-700" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {configuration && (
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Step 3</p>
                  <h3 className="mt-1 text-lg font-extrabold text-slate-900">Tell us about your shipment</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">{configuration.currency}</span>
              </div>

              {configuration.options?.filter((option) => option.isActive !== false).length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-bold">Additional shipment options</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Select all that apply.</p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {configuration.options.filter((option) => option.isActive !== false).map((option) => {
                      const selected = optionIds.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleOption(option.id)}
                          className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border p-3.5 text-left text-sm font-semibold transition ${selected ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-slate-200 hover:border-emerald-300"}`}
                        >
                          <span className="break-words">{option.name}</span>
                          {selected && <CheckCircle2 size={17} className="shrink-0 text-emerald-700" aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {configuration.weightEnabled && (
                  <Field label="Shipment weight (kg)" hint="Enter the total chargeable weight.">
                    <input className={inputClass} type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="e.g. 125" value={weightKg} onChange={(event) => { setWeightKg(event.target.value); clearQuote(); }} />
                  </Field>
                )}
                {configuration.quantityEnabled && (
                  <Field label="Quantity">
                    <input className={inputClass} type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(event) => { setQuantity(event.target.value); clearQuote(); }} />
                  </Field>
                )}
                {configuration.customsValueEnabled && (
                  <Field label={`Customs value (${configuration.currency})`}>
                    <input className={inputClass} type="number" min="0" step="0.01" inputMode="decimal" placeholder="0.00" value={customsValue} onChange={(event) => { setCustomsValue(event.target.value); clearQuote(); }} />
                  </Field>
                )}
                {configuration.freightAmountEnabled && (
                  <Field label={`Freight amount (${configuration.currency})`}>
                    <input className={inputClass} type="number" min="0" step="0.01" inputMode="decimal" placeholder="0.00" value={freightAmount} onChange={(event) => { setFreightAmount(event.target.value); clearQuote(); }} />
                  </Field>
                )}
                {configuration.airlineSelectorEnabled && (
                  <Field label="Airline">
                    <select className={inputClass} value={airlineId} onChange={(event) => { setAirlineId(event.target.value); clearQuote(); }}>
                      <option value="">Choose airline</option>
                      {configuration.airlines.filter((airline) => airline.isActive !== false).map((airline) => (
                        <option key={airline.id} value={airline.id}>{airline.name} ({airline.code})</option>
                      ))}
                    </select>
                  </Field>
                )}
                {configuration.nafdacEnabled && (
                  <Field label="NAFDAC service">
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm hover:bg-emerald-50/40">
                      <input type="checkbox" checked={nafdacRequired} onChange={(event) => { setNafdacRequired(event.target.checked); clearQuote(); }} className="h-4 w-4 accent-emerald-700" />
                      Include NAFDAC assistance
                    </label>
                  </Field>
                )}
                {configuration.transportEnabled && (
                  <Field label="Transport service">
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm hover:bg-emerald-50/40">
                      <input type="checkbox" checked={transportRequired} onChange={(event) => { setTransportRequired(event.target.checked); clearQuote(); }} className="h-4 w-4 accent-emerald-700" />
                      Include transport
                    </label>
                  </Field>
                )}
                <Field label="Goods description" hint="Optional">
                  <input className={inputClass} placeholder="What are you shipping?" value={goodsDescription} onChange={(event) => { setGoodsDescription(event.target.value); clearQuote(); }} />
                </Field>
                <Field label="HS code" hint="Optional customs classification">
                  <input className={inputClass} placeholder="Enter HS code if known" value={hsCode} onChange={(event) => { setHsCode(event.target.value); clearQuote(); }} />
                </Field>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-slate-500">Your estimate uses the current saved rates. Some variable charges may need a final review.</p>
                <button type="button" onClick={() => void calculate()} disabled={calculateMutation.isPending} className={primaryButtonClass}>
                  {calculateMutation.isPending ? <LoaderCircle size={17} className="animate-spin" /> : <ArrowRight size={17} />}
                  {calculateMutation.isPending ? "Calculating…" : "Calculate my quote"}
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800">
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {quote && (
            <section id="quotation-results" className="mt-8 scroll-mt-5 overflow-hidden rounded-2xl border border-emerald-100">
              <div className="bg-gradient-to-br from-emerald-950 to-emerald-700 p-5 text-white sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Your quotation estimate</p>
                <h2 className="mt-2 break-words text-2xl font-extrabold sm:text-3xl">{money(quote.totalAmount, quote.currency)}</h2>
                <p className="mt-2 break-words text-sm text-emerald-50">Reference: <span className="font-bold text-white">{quote.quoteNumber}</span></p>
                {quote.requiresReview ? (
                  <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm leading-5 text-amber-50">Some charges require manual review. The final amount may change after review.</p>
                ) : (
                  <p className="mt-4 flex items-center gap-2 text-sm text-lime-200"><CheckCircle2 size={17} /> Calculated from saved active rates</p>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="font-extrabold">Which services do you need help with?</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">Choose the services you want our team to handle. This does not change your original estimate.</p>
                <div className="mt-4 space-y-3">
                  {quote.lines.map((line) => {
                    const selected = selectedItemIds.includes(line.quoteItemId);
                    return (
                      <label key={line.quoteItemId} className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${selected ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200 hover:border-emerald-300"}`}>
                        <input type="checkbox" checked={selected} onChange={() => toggleItem(line.quoteItemId)} className="mt-1 h-4 w-4 shrink-0 accent-emerald-700" />
                        <span className="min-w-0 flex-1">
                          <span className="block break-words text-sm font-semibold">{line.componentName}
                            {line.isEstimate && <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">Estimate</span>}
                          </span>
                          {line.remarks && <span className="mt-1 block break-words text-xs leading-5 text-slate-500">{line.remarks}</span>}
                          {line.quantity > 1 && line.unit && <span className="mt-1 block text-xs text-slate-500">{line.quantity} {line.unit}</span>}
                        </span>
                        <span className="shrink-0 text-right text-sm font-bold tabular-nums">{money(line.lineTotal, quote.currency)}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-xl bg-emerald-50/70 p-4 sm:p-5">
                  <div className="flex justify-between gap-3 text-sm text-slate-600"><span>Subtotal</span><span className="text-right font-semibold tabular-nums">{money(quote.subtotal, quote.currency)}</span></div>
                  <div className="mt-3 flex justify-between gap-3 text-sm text-slate-600"><span>VAT / tax</span><span className="text-right font-semibold tabular-nums">{money(quote.taxAmount, quote.currency)}</span></div>
                  <div className="mt-4 flex justify-between gap-3 border-t border-emerald-100 pt-4"><span className="font-extrabold">Estimated total</span><span className="text-right text-lg font-extrabold text-emerald-800 tabular-nums">{money(quote.totalAmount, quote.currency)}</span></div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">{selectedItemIds.length} of {quote.lines.length} services selected</p>
                  <button type="button" onClick={requestHelp} className={primaryButtonClass}>
                    Continue to request help <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </section>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">How it works</p>
            <ol className="mt-4 space-y-4">
              {[
                ["Choose", "Select air, land or sea, then import or export."],
                ["Calculate", "Review an itemized estimate based on active rates."],
                ["Request", "Choose the services you need and sign in to submit."],
              ].map(([title, body], index) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800">{index + 1}</span>
                  <span><b className="text-sm">{title}</b><span className="mt-1 block text-xs leading-5 text-slate-500">{body}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="flex items-center gap-2 text-sm font-extrabold text-emerald-950"><LockKeyhole size={17} /> Calculate without an account</p>
            <p className="mt-2 text-xs leading-5 text-emerald-900/80">Review your estimate first. Sign-in is needed when you are ready to submit a service request.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-extrabold">Need a custom quote?</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">Some variable charges may need our quotation team to review your shipment details.</p>
          </div>
        </aside>
      </div>

      <footer className="border-t border-emerald-100 bg-white px-4 py-6 text-center text-xs leading-5 text-slate-500">
        Estimates use active pricing rates and may be subject to review.
      </footer>
    </main>
  );
}

export default PublicQuotationPage;
