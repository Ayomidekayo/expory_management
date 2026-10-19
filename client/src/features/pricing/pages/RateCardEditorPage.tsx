import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useRateCardEditor } from "../hooks/use-rate-card-editor";
import ConfigurationSelector from "../components/ConfigurationSelector";
import PricingTablePreview from "../components/PricingTablePreview";

export default function RateCardEditorPage() {
  const { rateCardId = "" } = useParams<{
    rateCardId: string;
  }>();

  const { data: rateCard, isLoading, isError, error } =
    useRateCardEditor(rateCardId);

  const [selectedConfigurationId, setSelectedConfigurationId] =
    useState("");

  const configurations = rateCard?.configurations ?? [];

  const selectedConfiguration = useMemo(() => {
    if (!configurations.length) return undefined;

    return (
      configurations.find(
        (configuration) =>
          configuration.id === selectedConfigurationId,
      ) ?? configurations[0]
    );
  }, [configurations, selectedConfigurationId]);

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading rate card...
      </div>
    );
  }

  if (isError || !rateCard) {
    return (
      <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error instanceof Error
          ? error.message
          : "Unable to load this rate card."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/admin/rate-cards"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back to Rate Cards
            </Link>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {rateCard.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {rateCard.mode} · {rateCard.direction}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              rateCard.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : rateCard.status === "DRAFT"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-200 text-slate-700"
            }`}
          >
            {rateCard.status}
          </span>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Transport Mode</p>
            <p className="mt-2 font-semibold text-slate-900">
              {rateCard.mode}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Direction</p>
            <p className="mt-2 font-semibold text-slate-900">
              {rateCard.direction}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Configurations</p>
            <p className="mt-2 font-semibold text-slate-900">
              {configurations.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Default Currency</p>
            <p className="mt-2 font-semibold text-slate-900">
              {rateCard.currency}
            </p>
          </div>
        </section>

        {configurations.length === 0 ? (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-semibold text-amber-900">
              No pricing configurations
            </h2>

            <p className="mt-2 text-sm text-amber-800">
              Add a configuration before reviewing the pricing table.
            </p>
          </section>
        ) : (
          <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <ConfigurationSelector
              configurations={configurations}
              selectedId={
                selectedConfiguration?.id ?? ""
              }
              onChange={setSelectedConfigurationId}
            />

            {selectedConfiguration && (
              <PricingTablePreview
                configuration={selectedConfiguration}
              />
            )}
          </section>
        )}
      </div>
    </main>
  );
}