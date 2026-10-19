import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  Calculator,
  CirclePlus,
  Pencil,
  Plus,
  RefreshCw,
  Settings2,
  Trash2,
} from "lucide-react";

import RateComponentForm from "../components/rate-component-form";

import {
  useRateCard,
} from "../hooks/use-rate-cards";



import {
  useRateComponents,
  useCreateRateComponent,
  useUpdateRateComponent,
  useDeleteRateComponent,
} from "../hooks/use-rate-components";


import { useRateCardConfiguration } from "../hooks/use-rate-configurations";
import type {
  RateComponent,
  RateComponentInput,
} from "../types/rate-component.types";

const formatAmount = (
  value: number | string | null | undefined,
  currency: string,
) => {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
};

const calculationLabels: Record<string, string> = {
  FIXED: "Fixed charge",
  PER_UNIT: "Per unit",
  PERCENTAGE: "Percentage",
  WEIGHT_SLAB: "Weight slab",
  VARIABLE: "Variable",
};

export default function RateComponentPage() {
  const { rateCardId, configurationId } = useParams<{
    rateCardId: string;
    configurationId: string;
  }>();

  const cardId = rateCardId ?? "";
  const configId = configurationId ?? "";

  const [showForm, setShowForm] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<RateComponent | null>(null);
  const [pageError, setPageError] = useState("");

  const {
    data: rateCard,
    isLoading: cardLoading,
    isError: cardError,
    refetch: refetchCard,
  } = useRateCard(cardId);

  const {
    data: configuration,
    isLoading: configLoading,
    isError: configError,
    refetch: refetchConfiguration,
  } = useRateCardConfiguration(cardId, configId);

  const {
    data: components,
    isLoading: componentsLoading,
    isError: componentsError,
    error: componentsQueryError,
    refetch: refetchComponents,
  } = useRateComponents(cardId, configId);

  const createMutation = useCreateRateComponent(cardId);
  const updateMutation = useUpdateRateComponent(cardId);
  const deleteMutation = useDeleteRateComponent(cardId);

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const isLoading = cardLoading || configLoading || componentsLoading;

  const backUrl = `/pricing/rate-cards/${cardId}`;

  function openCreateForm() {
    setPageError("");
    setEditingComponent(null);
    setShowForm(true);
  }

  function openEditForm(component: RateComponent) {
    setPageError("");
    setEditingComponent(component);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingComponent(null);
  }



async function handleSubmit(input: RateComponentInput) {
  setPageError("");

  try {
    if (editingComponent) {
      await updateMutation.mutateAsync({
        id: editingComponent.id,
        input,
      });
    } else {
      await createMutation.mutateAsync(input);
    }

    closeForm();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save the charge.";

    setPageError(message);
    throw error;
  }
}

  async function handleDelete(component: RateComponent) {
    const confirmed = window.confirm(
      `Delete "${component.name}"? This may also remove its associated weight-slab rates.`,
    );

    if (!confirmed) return;

    setPageError("");

    try {
      await deleteMutation.mutateAsync(component.id);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to delete this charge.",
      );
    }
  }

  async function handleRefresh() {
    await Promise.all([
      refetchCard(),
      refetchConfiguration(),
      refetchComponents(),
    ]);
  }

  if (!cardId || !configId) {
    return (
      <MessageState
        title="Missing pricing information"
        message="Both the rate card and configuration IDs are required."
      />
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
          <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (cardError || configError || !rateCard || !configuration) {
    return (
      <MessageState
        title="Unable to load pricing configuration"
        message="Check that the rate card and configuration exist, then try again."
        action={
          <button
            onClick={() => void handleRefresh()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        }
      />
    );
  }

  const readOnly = rateCard.status !== "DRAFT";

  const allComponents = components ?? [];

  const activeComponents = allComponents.filter(
    (component) => component.isActive,
  );

  const optionalComponents = allComponents.filter(
    (component) => component.isOptional,
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to rate card
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                Manage charges
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {rateCard.name} / {configuration.name}
              </p>

              {configuration.routeLabel && (
                <p className="mt-1 text-sm text-slate-500">
                  Route: {configuration.routeLabel}
                </p>
              )}

              {configuration.equipmentType && (
                <p className="mt-1 text-sm text-slate-500">
                  Option: {configuration.equipmentType}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleRefresh()}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw size={15} />
                Refresh
              </button>

              {!readOnly && (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus size={16} />
                  Add charge
                </button>
              )}
            </div>
          </div>

          {readOnly && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              This rate card is {rateCard.status.toLowerCase()}. Editing
              charges is disabled until an editable draft is available.
            </div>
          )}

          <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <SummaryCard
              label="Total charges"
              value={allComponents.length}
              icon={<Calculator size={18} />}
            />

            <SummaryCard
              label="Active charges"
              value={activeComponents.length}
              icon={<Settings2 size={18} />}
            />

            <SummaryCard
              label="Optional services"
              value={optionalComponents.length}
              icon={<CirclePlus size={18} />}
            />
          </div>
        </section>

        {pageError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{pageError}</p>
          </div>
        )}

        {showForm && !readOnly && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <RateComponentForm
              key={editingComponent?.id ?? "new"}
              configurationId={configId}
              initialData={editingComponent ?? undefined}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </section>
        )}

        {componentsError ? (
          <section className="rounded-xl border border-red-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">
              Unable to load charges
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {componentsQueryError instanceof Error
                ? componentsQueryError.message
                : "An unexpected error occurred."}
            </p>

            <button
              onClick={() => void refetchComponents()}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </section>
        ) : allComponents.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Calculator size={23} />
            </div>

            <h2 className="mt-4 font-semibold text-slate-900">
              No charges configured
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add charges such as customs processing, documentation, handling,
              transportation, or other services applicable to this
              configuration.
            </p>

            {!readOnly && (
              <button
                onClick={openCreateForm}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                Add first charge
              </button>
            )}
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Configured charges
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Charges and optional services available for this pricing
                configuration.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Charge</th>
                    <th className="px-5 py-3">Calculation</th>
                    <th className="px-5 py-3">Amount / Rate</th>
                    <th className="px-5 py-3">Service type</th>
                    <th className="px-5 py-3">Status</th>
                    {!readOnly && (
                      <th className="px-5 py-3 text-right">Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {allComponents.map((component) => (
                    <tr key={component.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {component.name}
                        </p>

                        {component.code && (
                          <p className="mt-1 text-xs text-slate-400">
                            {component.code}
                          </p>
                        )}

                        {component.notes && (
                          <p className="mt-1 max-w-xs text-xs text-slate-500">
                            {component.notes}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {calculationLabels[component.calculationType] ??
                            component.calculationType}
                        </span>

                        <p className="mt-2 text-xs text-slate-500">
                          Basis: {component.calculationBasis}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-800">
                        {component.calculationType === "PERCENTAGE"
                          ? `${component.percentage ?? 0}%`
                          : component.calculationType === "WEIGHT_SLAB"
                            ? "See weight slabs"
                            : component.calculationType === "VARIABLE"
                              ? "Manual review"
                              : formatAmount(
                                  component.value,
                                  configuration.currency,
                                )}

                        {component.unit && (
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            / {component.unit}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              component.isOptional
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {component.isOptional ? "Optional" : "Standard"}
                          </span>

                          {component.isTaxable && (
                            <span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                              Taxable
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            component.isActive
                              ? "text-emerald-700"
                              : "text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              component.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />
                          {component.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {!readOnly && (
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(component)}
                              aria-label={`Edit ${component.name}`}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleDelete(component)}
                              disabled={isSubmitting}
                              aria-label={`Delete ${component.name}`}
                              className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/pricing/rate-cards/${cardId}/configurations/${configId}/weight-slabs`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Manage weight slabs
          </Link>

          <Link
            to={backUrl}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Back to configurations
          </Link>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>

      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function MessageState({
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
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </main>
  );
}