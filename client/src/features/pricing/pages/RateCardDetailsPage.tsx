import { Fragment, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Settings2,
  Plus,
  Layers3,
  Package,
  Weight,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ChevronRight,
  Pencil,
  Eye,
} from "lucide-react";

import { useRateCard } from "../hooks/use-rate-cards";

import type {
  QuoteMode,
  QuoteDirection,
  RateCardStatus,
} from "../types/pricing.types";
import { useRateCardConfigurations } from "../hooks/use-rate-configurations";
import RateCardOptionsManager from "../components/RateCardOptionsManager";
import PricingSectionsManager from "../components/PricingSectionsManager";
import { useRateCardOptions } from "../hooks/use-rate-card-options";
import RateComponentsManager from "../components/RateComponentsManager";
import WeightSlabsManager from "../components/WeightSlabsManager";
import type { PricingSectionCurrency } from "./pricing-section.types";
import RateCardPricingPreview from "../components/RateCardPricingPreview";
import RateCardAirlineManager from "../components/rate-card-airline-manager";

const modeLabels: Record<QuoteMode, string> = {
  AIR: "Air Freight",
  LAND: "Land Transport",
  SEA: "Sea Freight",
};

const directionLabels: Record<QuoteDirection, string> = {
  IMPORT: "Import",
  EXPORT: "Export",
};

const statusStyles: Record<RateCardStatus, string> = {
  DRAFT: "bg-amber-50 text-amber-700 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-200",
};

function formatDate(value?: string | null) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof Layers3;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
      </div>
    </div>
  );
}

export default function RateCardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: rateCard,
    isLoading,
    isError,
    error,
    refetch,
  } = useRateCard(id ?? "");

  const {
    data: configurations = [],
    isLoading: configurationsLoading,
    isError: configurationsError,
    refetch: refetchConfigurations,
  } = useRateCardConfigurations(id ?? "");

  const [refreshing, setRefreshing] = useState(false);
  const [optionsConfigurationId, setOptionsConfigurationId] =
    useState<string | null>(null);
  const { data: options = [] } = useRateCardOptions(optionsConfigurationId ?? "");

  async function refreshPage() {
    setRefreshing(true);

    try {
      await Promise.all([
        refetch(),
        refetchConfigurations(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }

  if (!id) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          No rate card ID was provided.
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-emerald-700" />
          <p className="mt-3 text-sm text-slate-500">
            Loading rate card...
          </p>
        </div>
      </main>
    );
  }

  if (isError || !rateCard) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6">
          <AlertCircle className="h-8 w-8 text-red-600" />

          <h1 className="mt-3 text-lg font-semibold text-slate-900">
            Unable to load rate card
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {error instanceof Error
              ? error.message
              : "The requested rate card could not be found."}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Try again
            </button>

            <Link
              to="/quotations/rate-cards"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Back to rate cards
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const configurationList = Array.isArray(configurations)
    ? configurations
    : [];

  const activeConfigurations = configurationList.filter(
    (configuration) => configuration.isActive,
  ).length;

  const canConfigure = rateCard.status === "DRAFT";

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Breadcrumb */}
        <Link
          to="/quotations/rate-cards"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rate Cards
        </Link>

        {/* Header */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
              <Layers3 className="h-7 w-7 text-emerald-700" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {rateCard.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[rateCard.status]}`}
                >
                  {rateCard.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {modeLabels[rateCard.mode]} ·{" "}
                {directionLabels[rateCard.direction]} ·{" "}
                {rateCard.currency}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Created {formatDate(rateCard.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={refreshPage}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <LoaderCircle
                className={`h-4 w-4 ${refreshing ? "animate-spin" : "hidden"}`}
              />
              Refresh
            </button>

            {canConfigure && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/quotations/rate-cards/${rateCard.id}/configurations/new`,
                    
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
              >
                <Plus className="h-4 w-4" />
                Add Configuration
              </button>
            )}
          </div>
        </header>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Transport Mode"
            value={rateCard.mode}
            description={modeLabels[rateCard.mode]}
            icon={Package}
          />

          <StatCard
            label="Direction"
            value={rateCard.direction}
            description={`${directionLabels[rateCard.direction]} pricing`}
            icon={Layers3}
          />

          <StatCard
            label="Configurations"
            value={configurationList.length}
            description={`${activeConfigurations} active configurations`}
            icon={Settings2}
          />

          <StatCard
            label="Pricing Status"
            value={rateCard.status}
            description={
              canConfigure
                ? "Pricing setup can be edited"
                : "Editing is restricted by status"
            }
            icon={CheckCircle2}
          />
        </section>

        {/* Validity */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-slate-900">
            Rate Card Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Rate Card Name
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {rateCard.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Currency
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {rateCard.currency}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Effective From
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {formatDate(rateCard.effectiveFrom)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Effective Until
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {formatDate(rateCard.effectiveTo)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Transport Mode
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {modeLabels[rateCard.mode]}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Direction
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {directionLabels[rateCard.direction]}
              </p>
            </div>
          </div>
        </section>

        {/* Configuration list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Pricing Configurations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure routes, equipment types, options, pricing
                sections and calculation features.
              </p>
            </div>

            {canConfigure && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/quotations/rate-cards/${rateCard.id}/configurations/new`,
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4" />
                Add Configuration
              </button>
            )}
          </div>

          {configurationsLoading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Loading configurations...
            </div>
          ) : configurationsError ? (
            <div className="p-6">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">
                  Unable to load configurations.
                </p>
                <button
                  type="button"
                  onClick={() => refetchConfigurations()}
                  className="mt-2 text-sm font-semibold text-red-800 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : configurationList.length === 0 ? (
            <div className="px-5 py-14 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Settings2 className="h-7 w-7 text-slate-500" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No configurations yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Add a configuration for this rate card. For example,
                Land Import can have separate Cotonou–Seme and
                Seme–Lagos configurations with their respective currencies.
              </p>

              {canConfigure && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/quotations/rate-cards/${rateCard.id}/configurations/new`,
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  <Plus className="h-4 w-4" />
                  Create First Configuration
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {configurationList.map((configuration) => (
                <Fragment key={configuration.id}>
                <article
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Settings2 className="h-5 w-5 text-slate-600" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {configuration.name}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            configuration.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {configuration.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Code: {configuration.code} · Currency:{" "}
                        {configuration.currency}
                      </p>

                      {(configuration.routeLabel ||
                        configuration.equipmentType) && (
                        <p className="mt-1 text-sm text-slate-600">
                          {[
                            configuration.routeLabel,
                            configuration.equipmentType,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {configuration.weightEnabled && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            <Weight className="h-3 w-3" />
                            Weight
                          </span>
                        )}

                        {configuration.vatEnabled && (
                          <span className="rounded-md bg-purple-50 px-2 py-1 text-xs text-purple-700">
                            VAT {configuration.vatPercentage}%
                          </span>
                        )}

                        {configuration.airlineSelectorEnabled && (
                          <span className="rounded-md bg-sky-50 px-2 py-1 text-xs text-sky-700">
                            Airline selection
                          </span>
                        )}
                        {configuration.nafdacEnabled && (
                          <span className="rounded-md bg-orange-50 px-2 py-1 text-xs text-orange-700">
                            NAFDAC
                          </span>
                        )}

                        {configuration.transportEnabled && (
                          <span className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
                            Transport
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/quotations/configurations/${configuration.id}/edit`,
                        )
                      }
                      disabled={!canConfigure}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/quotations/configurations/${configuration.id}`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      <Eye className="h-4 w-4" />
                      Manage Pricing
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    {true && (
                      <button
                        type="button"
                        onClick={() =>
                          setOptionsConfigurationId((current) =>
                            current === configuration.id ? null : configuration.id,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
                      >
                        <Settings2 className="h-4 w-4" />
                        {optionsConfigurationId === configuration.id
                          ? "Hide Pricing Tools"
                          : "Manage Pricing"}
                      </button>
                    )}
                  </div>
                </article>
                {optionsConfigurationId === configuration.id && (
                  <div className="space-y-6 border-t border-slate-200 bg-slate-50 p-5 sm:p-6">
                    {rateCard.mode !== "AIR" && (
                      <RateCardOptionsManager
                        configurationId={configuration.id}
                        configurationName={configuration.name}
                        mode={rateCard.mode}
                        rateCardStatus={rateCard.status}
                      />
                    )}

                   <PricingSectionsManager
  configurationId={configuration.id}
  configurationName={configuration.name}
  configurationCurrency={
    configuration.currency as PricingSectionCurrency
  }
  rateCardStatus={rateCard.status}
  options={options}
/>

                    <RateComponentsManager
                      rateCardId={rateCard.id}
                      configurationId={configuration.id}
                      rateCardStatus={rateCard.status}
                      currency={configuration.currency}
                    />

                    {rateCard.mode === "AIR" && (
                      <RateCardAirlineManager
                        rateCardId={rateCard.id}
                        configurationId={configuration.id}
                        currency={configuration.currency}
                        canEdit={canConfigure}
                      />
                    )}

                    {configuration.weightEnabled && (
                      <WeightSlabsManager
                        rateCardId={rateCard.id}
                        configurationId={configuration.id}
                        configurationName={configuration.name}
                        configurationCurrency={configuration.currency}
                        rateCardStatus={rateCard.status}
                      />
                    )}

                  
                  </div>
                  
                )}
                </Fragment>
              ))}
            </div>
          )}
        </section>

        {/* Saved pricing table preview and activation */}
<RateCardPricingPreview
  rateCardId={rateCard.id}
  rateCardName={rateCard.name}
  rateCardStatus={rateCard.status}
  configurations={configurationList}
  onStatusChanged={refreshPage}
/>

        {/* Next steps */}
        {canConfigure && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <div>
                <h2 className="font-semibold text-amber-900">
                  Before activation
                </h2>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Complete the required configurations, add pricing
                  components and applicable weight slabs, then validate
                  the rate card. When enabled, VAT is calculated on the
                  configured quotation subtotal. Preview the saved pricing
                  table before activating the rate card.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}