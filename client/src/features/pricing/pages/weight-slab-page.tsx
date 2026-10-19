import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Layers3,
  RefreshCw,
} from "lucide-react";

import WeightSlabTable from "../components/weight-slab-table";

import { useRateCard } from "../hooks/use-rate-cards";
import { useRateConfiguration } from "../hooks/use-rate-configurations";
import { useRateComponents } from "../hooks/use-rate-components";

import {
  useWeightSlabs,
  useCreateWeightSlab,
  useUpdateWeightSlab,
  useDeleteWeightSlab,
  useUpdateWeightSlabRates,
} from "../hooks/use-weight-slabs";

import type {
  CreateWeightSlabInput,
  UpdateWeightSlabInput,
  UpdateWeightSlabRatesInput,
} from "../types/pricing.types";

export default function WeightSlabPage() {
  const { rateCardId, configurationId } = useParams<{
    rateCardId: string;
    configurationId: string;
  }>();

  const cardId = rateCardId ?? "";
  const configId = configurationId ?? "";

  const [pageError, setPageError] = useState("");

  const {
    data: rateCard,
    isLoading: cardLoading,
    isError: cardError,
    refetch: refetchCard,
  } = useRateCard(cardId);

  const {
    data: configuration,
    isLoading: configurationLoading,
    isError: configurationError,
    refetch: refetchConfiguration,
  } = useRateConfiguration(cardId, configId);

  const {
    data: components,
    isLoading: componentsLoading,
    isError: componentsError,
    refetch: refetchComponents,
  } = useRateComponents(cardId, configId);

  const {
    data: slabs,
    isLoading: slabsLoading,
    isError: slabsError,
    error: slabsQueryError,
    refetch: refetchSlabs,
  } = useWeightSlabs(cardId, configId);

  const createMutation = useCreateWeightSlab(cardId);
  const updateMutation = useUpdateWeightSlab(cardId);
  const deleteMutation = useDeleteWeightSlab(cardId);
  const updateRatesMutation = useUpdateWeightSlabRates(cardId);

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    updateRatesMutation.isPending;

  const isLoading =
    cardLoading ||
    configurationLoading ||
    componentsLoading ||
    slabsLoading;

  const backUrl =
    `/pricing/rate-cards/${cardId}/configurations/${configId}/charges`;

  async function refreshPage() {
    await Promise.all([
      refetchCard(),
      refetchConfiguration(),
      refetchComponents(),
      refetchSlabs(),
    ]);
  }

  async function handleCreate(
    input: Omit<CreateWeightSlabInput, "configurationId">,
  ) {
    setPageError("");

    try {
      await createMutation.mutateAsync({
        ...input,
        configurationId: configId,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create the weight slab.";

      setPageError(message);
      throw error;
    }
  }

  async function handleUpdate(
    slabId: string,
    input: UpdateWeightSlabInput,
  ) {
    setPageError("");

    try {
      await updateMutation.mutateAsync({
        slabId,
        input,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update the weight slab.";

      setPageError(message);
      throw error;
    }
  }

  async function handleDelete(slabId: string) {
    setPageError("");

    try {
      await deleteMutation.mutateAsync(slabId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to delete the weight slab.";

      setPageError(message);
      throw error;
    }
  }

  async function handleSaveRates(
    slabId: string,
    rates: Array<{ componentId: string; amount: number }>,
  ) {
    setPageError("");

    const input: UpdateWeightSlabRatesInput = { rates };

    try {
      await updateRatesMutation.mutateAsync({
        slabId,
        input,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save the weight-slab rates.";

      setPageError(message);
      throw error;
    }
  }

  if (!cardId || !configId) {
    return (
      <ErrorState
        title="Missing pricing information"
        message="A rate card ID and configuration ID are required."
      />
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (
    cardError ||
    configurationError ||
    !rateCard ||
    !configuration
  ) {
    return (
      <ErrorState
        title="Unable to load pricing configuration"
        message="The rate card or configuration could not be retrieved."
        action={
          <button
            type="button"
            onClick={() => void refreshPage()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        }
      />
    );
  }

  const readOnly = rateCard.status !== "DRAFT";

  const activeSlabComponents = (components ?? []).filter(
    (component) =>
      component.isActive &&
      component.calculationType === "WEIGHT_SLAB",
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to charges
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {rateCard.mode} {rateCard.direction}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {configuration.currency}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Weight-slab pricing
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {rateCard.name} / {configuration.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Configure weight ranges and the applicable charges for each
                range.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refreshPage()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <SummaryItem
              label="Weight slabs"
              value={(slabs ?? []).length}
            />

            <SummaryItem
              label="Active weight-based charges"
              value={activeSlabComponents.length}
            />

            <SummaryItem
              label="Currency"
              value={configuration.currency}
            />
          </div>
        </section>

        {readOnly && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-amber-700"
            />

            <div>
              <h2 className="text-sm font-semibold text-amber-900">
                Read-only pricing
              </h2>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                This rate card is {rateCard.status.toLowerCase()}. Create a
                new draft rate card to make pricing changes.
              </p>
            </div>
          </div>
        )}

        {pageError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{pageError}</p>
          </div>
        )}

        {componentsError || slabsError ? (
          <section className="rounded-xl border border-red-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">
              Unable to load weight-based pricing
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Check your connection and try refreshing the page.
            </p>

            <button
              type="button"
              onClick={() => void refreshPage()}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {activeSlabComponents.length === 0 && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />

                  <div>
                    <h2 className="text-sm font-semibold text-amber-900">
                      No active weight-slab charges
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      Add a charge with the calculation type{" "}
                      <strong>Weight slab</strong> on the charges page before
                      entering rates.
                    </p>

                    <Link
                      to={backUrl}
                      className="mt-2 inline-block text-sm font-semibold text-amber-900 underline"
                    >
                      Go to charges
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {readOnly ? (
              <ReadOnlySlabs
                slabs={slabs ?? []}
                currency={configuration.currency}
                components={activeSlabComponents}
              />
            ) : (
              <WeightSlabTable
                slabs={slabs ?? []}
                components={components ?? []}
                currency={configuration.currency}
                isLoading={false}
                isSaving={isSaving}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onSaveRates={handleSaveRates}
              />
            )}
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            to={backUrl}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Back to charges
          </Link>

          <Link
            to={`/pricing/rate-cards/${cardId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Layers3 size={15} />
            View rate card
          </Link>
        </div>
      </div>
    </main>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ErrorState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertCircle size={22} />
        </div>

        <h1 className="mt-4 text-lg font-bold text-slate-900">{title}</h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </main>
  );
}

function ReadOnlySlabs({
  slabs,
  currency,
  components,
}: {
  slabs: Array<{
    id: string;
    label: string;
    minWeight: number | string;
    maxWeight: number | string | null;
    displayOrder: number;
    rates?: Array<{
      componentId: string;
      amount: number | string;
    }>;
  }>;
  currency: string;
  components: Array<{
    id: string;
    name: string;
  }>;
}) {
  const numberFormatter = new Intl.NumberFormat("en-NG");

  const moneyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Configured weight slabs
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          These rates are displayed for reference because the rate card is
          read-only.
        </p>
      </div>

      {slabs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No weight slabs have been configured.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Slab</th>
                <th className="px-4 py-3">Minimum weight</th>
                <th className="px-4 py-3">Maximum weight</th>

                {components.map((component) => (
                  <th key={component.id} className="px-4 py-3">
                    {component.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {slabs.map((slab) => (
                <tr key={slab.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {slab.label}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {numberFormatter.format(Number(slab.minWeight))}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {slab.maxWeight === null
                      ? "No limit"
                      : numberFormatter.format(Number(slab.maxWeight))}
                  </td>

                  {components.map((component) => {
                    const rate = slab.rates?.find(
                      (item) => item.componentId === component.id,
                    );

                    return (
                      <td
                        key={component.id}
                        className="px-4 py-3 text-slate-700"
                      >
                        {rate
                          ? moneyFormatter.format(Number(rate.amount))
                          : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}