import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, LoaderCircle, Settings2 } from "lucide-react";

import RateCardConfigurationForm from "../components/RateCardConfigurationForm";
import type { CreateRateConfigurationInput } from "../types/pricing.types";
import { useCreateRateCardConfiguration } from "../hooks/use-rate-configurations";
import { useRateCard } from "../hooks/use-rate-cards";


export default function CreateRateCardConfigurationPage() {
  const { rateCardId = "" } = useParams<{ rateCardId: string }>();
  const navigate = useNavigate();
  const { data: rateCard, isLoading, isError, error, refetch } = useRateCard(rateCardId);
  const createConfiguration = useCreateRateCardConfiguration(rateCardId);
  const [pageError, setPageError] = useState("");

  async function handleSubmit(input: CreateRateConfigurationInput) {
    setPageError("");
    try {
      await createConfiguration.mutateAsync(input);
      navigate(`/quotations/rate-cards/${rateCardId}`, { replace: true, state: { configurationCreated: true } });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create configuration.";
      setPageError(message);
      throw new Error(message);
    }
  }

  if (!rateCardId) return <main className="p-6"><div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">No rate card ID was provided in the URL.</div></main>;

  if (isLoading) return <main className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-emerald-700" /><p className="mt-3 text-sm text-slate-500">Loading rate card...</p></div></main>;

  if (isError || !rateCard) return <main className="mx-auto max-w-3xl p-6"><div className="rounded-2xl border border-red-200 bg-white p-6"><AlertCircle className="h-8 w-8 text-red-600" /><h1 className="mt-3 text-lg font-semibold text-slate-900">Unable to load rate card</h1><p className="mt-2 text-sm text-slate-600">{error instanceof Error ? error.message : "The rate card could not be found."}</p><button type="button" onClick={() => refetch()} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Try again</button></div></main>;

  if (rateCard.status !== "DRAFT") return <main className="mx-auto max-w-3xl p-6"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><h1 className="font-semibold text-amber-900">Configuration editing is unavailable</h1><p className="mt-2 text-sm text-amber-800">Only draft rate cards can be configured. This rate card is currently {rateCard.status.toLowerCase()}.</p><Link to={`/quotations/rate-cards/${rateCardId}`} className="mt-4 inline-flex rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900">Return to rate card</Link></div></main>;

  return <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to={`/quotations/rate-cards/${rateCardId}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700"><ArrowLeft className="h-4 w-4" />Back to rate card</Link>
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-4"><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><Settings2 className="h-6 w-6" /></div><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{rateCard.mode} · {rateCard.direction}</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Create Configuration</h1><p className="mt-2 text-sm leading-6 text-slate-500">Choose the calculation inputs and services for this pricing setup. You will add options and pricing tables after saving.</p><p className="mt-2 text-sm font-medium text-slate-700">{rateCard.name}</p></div></div>
      </header>
      {pageError && <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" /><span>{pageError}</span></div>}
      <RateCardConfigurationForm rateCard={rateCard} isSubmitting={createConfiguration.isPending} onSubmit={handleSubmit} onCancel={() => navigate(`/quotations/rate-cards/${rateCardId}`)} />
    </div>
  </main>;
}
