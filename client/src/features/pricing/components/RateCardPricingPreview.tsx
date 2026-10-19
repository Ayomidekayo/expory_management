import { useState } from "react";
import type { RateCardValidationResult } from "../api/rate-card-activation.api";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  ShieldCheck,
  Table2,
  XCircle,
} from "lucide-react";
import { useRateComponents } from "../hooks/use-rate-components";
import { useWeightSlabs } from "../../pricing/hooks/use-weight-slabs";
import {
  useActivateRateCard,
  useArchiveRateCard,
  useValidateRateCard,
} from "../hooks/use-rate-card-activation";

type Status = "DRAFT" | "ACTIVE" | "ARCHIVED";
type Config = {
  id: string;
  name: string;
  code: string;
  currency: string;
  isActive: boolean;
  weightEnabled?: boolean;
  freightAmountEnabled?: boolean;
  customsValueEnabled?: boolean;
  quantityEnabled?: boolean;
  airlineSelectorEnabled?: boolean;
  transportEnabled?: boolean;
  nafdacEnabled?: boolean;
  vatEnabled?: boolean;
  vatPercentage?: number | string | null;
  vatCalculationBasis?: string | null;
  options?: Array<any>;
  pricingSections?: Array<any>;
};
type Props = {
  rateCardId: string;
  rateCardName: string;
  rateCardStatus: Status;
  configurations: Config[];
  onStatusChanged: () => Promise<unknown> | unknown;
};

function formatMoney(value: unknown, currency: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "Not configured";
  const iso = currency === "CFA" ? "XOF" : currency;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: iso,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}
function calcLabel(type: string) {
  return (
    (
      {
        FIXED: "Fixed charge",
        WEIGHT_SLAB: "Weight slab",
        PERCENTAGE: "Percentage",
        PER_UNIT: "Per unit",
        VARIABLE: "Variable / quotation required",
      } as Record<string, string>
    )[type] ?? type
  );
}

function ConfigurationPreview({
  rateCardId,
  configuration,
}: {
  rateCardId: string;
  configuration: Config;
}) {


const {
  data: allComponents = [],
  isLoading: componentsLoading,
  isError: componentsError,
} = useRateComponents(rateCardId);

const {
  data: slabs = [],
  isLoading: slabsLoading,
  isError: slabsError,
} = useWeightSlabs(rateCardId, {
  configurationId: configuration.id,
});

const active = (allComponents as any[]).filter(
  (component) =>
    component.isActive &&
    component.configurationId === configuration.id,
);
  const sections = configuration.pricingSections ?? [];
  const options = configuration.options ?? [];
  if (componentsLoading || (configuration.weightEnabled && slabsLoading))
    return (
      <div className="animate-pulse rounded-xl bg-slate-100 p-8 text-sm text-slate-500">
        Loading saved pricing…
      </div>
    );
  if (componentsError || (configuration.weightEnabled && slabsError))
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load saved charges or weight slabs. Refresh and try again.
      </div>
    );

  const renderRows = (rows: any[]) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Charge</th>
            <th className="px-4 py-3">Calculation</th>
            <th className="px-4 py-3">Configured amount</th>
            <th className="px-4 py-3">VAT treatment</th>
            <th className="px-4 py-3">Selection</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{c.name}</p>
                {c.code && <p className="text-xs text-slate-500">{c.code}</p>}
              </td>
              <td className="px-4 py-3">{calcLabel(c.calculationType)}</td>
              <td className="px-4 py-3 font-medium">
                {c.calculationType === "PERCENTAGE"
                  ? `${c.percentage ?? "—"}%`
                  : c.calculationType === "WEIGHT_SLAB"
                    ? "See weight table"
                    : c.calculationType === "VARIABLE"
                      ? "Set during quotation"
                      : formatMoney(c.value, configuration.currency)}
              </td>
              <td className="px-4 py-3">
                {c.isTaxable ? (
                  <span className="rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-700">
                    VAT taxable
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    Not taxable
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {c.isOptional ? "Optional" : "Included by default"}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-7 text-center text-slate-500">
                No active charges in this group.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  const general = active.filter((c) => !c.optionId && !c.pricingSectionId);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["Weight input", configuration.weightEnabled],
          ["Freight amount", configuration.freightAmountEnabled],
          ["Customs value", configuration.customsValueEnabled],
          ["Quantity", configuration.quantityEnabled],
          ["Airline selector", configuration.airlineSelectorEnabled],
          ["Transport", configuration.transportEnabled],
          ["NAFDAC", configuration.nafdacEnabled],
        ]
          .filter(([, enabled]) => enabled)
          .map(([label]) => (
            <span
              key={String(label)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
            >
              {label}
            </span>
          ))}
      </div>
      {configuration.vatEnabled ? (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-purple-700" />
            <div>
              <h4 className="font-semibold text-purple-900">
                VAT enabled · {configuration.vatPercentage ?? 7.5}%
              </h4>
              <p className="mt-1 text-sm text-purple-800">
                Basis:{" "}
                {(configuration.vatCalculationBasis ?? "SUBTOTAL").replaceAll(
                  "_",
                  " ",
                )}
              </p>
             <p className="text-xs text-purple-700">
  VAT is calculated on the full subtotal of applicable selected charges,
  including selected airline freight where applicable. This is a saved-settings
  preview, not a quotation calculation.
</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          VAT is disabled for this configuration.
        </div>
      )}
      {sections
        .filter((s) => s.isActive !== false && !s.optionId)
        .map((section) => (
          <div
            key={section.id}
            className="overflow-hidden rounded-xl border border-slate-200"
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <h4 className="font-semibold">{section.name}</h4>
              <p className="text-xs text-slate-500">
                {section.code ?? "Pricing section"} · {configuration.currency}
              </p>
            </div>
            {renderRows(
              active.filter((c) => c.pricingSectionId === section.id),
            )}
          </div>
        ))}
      {options
        .filter((o) => o.isActive !== false)
        .map((option) => (
          <div
            key={option.id}
            className="overflow-hidden rounded-xl border border-slate-200"
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <h4 className="font-semibold">{option.name}</h4>
              <p className="text-xs text-slate-500">
                {option.code ?? "Option"} · {configuration.currency}
              </p>
            </div>
            {renderRows(
              active.filter(
                (c) => c.optionId === option.id && !c.pricingSectionId,
              ),
            )}
            {sections
              .filter((s) => s.optionId === option.id && s.isActive !== false)
              .map((section) => (
                <div key={section.id} className="border-t border-slate-200">
                  <div className="bg-slate-50 px-4 py-3 text-sm font-medium">
                    {section.name}
                  </div>
                  {renderRows(
                    active.filter((c) => c.pricingSectionId === section.id),
                  )}
                </div>
              ))}
          </div>
        ))}
      {general.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-100 px-4 py-3">
            <h4 className="font-semibold">General charges</h4>
          </div>
          {renderRows(general)}
        </div>
      )}
      {configuration.weightEnabled && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b border-slate-100 px-4 py-3">
            <h4 className="font-semibold">Saved weight slabs and rates</h4>
            <p className="mt-1 text-xs text-slate-500">
              Read-only view of saved ranges and prices.
            </p>
          </div>
          {(slabs as any[]).length === 0 ? (
            <p className="p-5 text-sm text-slate-500">
              No weight slabs have been saved.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Weight range</th>
                    <th className="px-4 py-3">Minimum</th>
                    <th className="px-4 py-3">Maximum</th>
                    <th className="px-4 py-3">Saved rates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(slabs as any[]).map((slab) => (
                    <tr key={slab.id}>
                      <td className="px-4 py-3 font-medium">{slab.label}</td>
                      <td className="px-4 py-3">{slab.minWeightKg} kg</td>
                      <td className="px-4 py-3">
                        {slab.maxWeightKg == null
                          ? "No upper limit"
                          : `${slab.maxWeightKg} kg`}
                      </td>
                      <td className="px-4 py-3">
                        {slab.rates?.length ? (
                          slab.rates.map((rate: any) => (
                            <div key={rate.id ?? rate.componentId}>
                              {active.find((c) => c.id === rate.componentId)
                                ?.name ?? "Charge"}
                              :{" "}
                              <strong>
                                {formatMoney(
                                  rate.amount,
                                  configuration.currency,
                                )}
                              </strong>
                            </div>
                          ))
                        ) : (
                          <span className="text-amber-700">No saved rates</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RateCardPricingPreview({
  rateCardId,
  rateCardName,
  rateCardStatus,
  configurations,
  onStatusChanged,
}: Props) {
  const validateMutation = useValidateRateCard(rateCardId);
  const activateMutation = useActivateRateCard(rateCardId);
  const archiveMutation = useArchiveRateCard(rateCardId);
  const [validation, setValidation] =
    useState<RateCardValidationResult | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [confirmationAction, setConfirmationAction] =
    useState<"activate" | "archive" | null>(null);
  const busy =
    validateMutation.isPending ||
    activateMutation.isPending ||
    archiveMutation.isPending;
  async function validate() {
    setFeedback(null);
    try {
      const result = await validateMutation.mutateAsync();
      setValidation(result);
      setFeedback(
        result.canActivate
          ? {
              type: "success",
              message:
                "Validation passed. This rate card is ready for activation.",
            }
          : {
              type: "error",
              message:
                "Validation completed. Resolve the errors below before activation.",
            },
      );
    } catch (e) {
      setFeedback({
        type: "error",
        message:
          e instanceof Error ? e.message : "Unable to validate this rate card.",
      });
    }
  }
  async function activate() {
    if (!validation?.canActivate) return;
    setConfirmationAction(null);
    setFeedback(null);
    try {
      await activateMutation.mutateAsync();
      setFeedback({
        type: "success",
        message: "Rate card activated successfully.",
      });
      await onStatusChanged();
    } catch (e) {
      setFeedback({
        type: "error",
        message:
          e instanceof Error
            ? e.message
            : "Activation failed. Review the configuration and try again.",
      });
    }
  }
  async function archive() {
    setConfirmationAction(null);
    setFeedback(null);
    try {
      await archiveMutation.mutateAsync();
      setFeedback({
        type: "success",
        message: "Rate card archived successfully.",
      });
      await onStatusChanged();
    } catch (e) {
      setFeedback({
        type: "error",
        message: e instanceof Error ? e.message : "Archiving failed.",
      });
    }
  }
  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Table2 className="h-5 w-5 text-emerald-700" />
            <h2 className="text-lg font-semibold">Pricing Table Preview</h2>
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            Review saved charges, tax treatment and weight rates before
            activation. This is read-only and does not calculate a quotation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {rateCardStatus === "DRAFT" && (
            <>
              <button
                type="button"
                onClick={validate}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {validateMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ClipboardCheck className="h-4 w-4" />
                )}
                Validate
              </button>
              <button
                type="button"
                onClick={() => setConfirmationAction("activate")}
                disabled={busy || !validation?.canActivate}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {activateMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Activate rate card
              </button>
            </>
          )}
          {rateCardStatus === "ACTIVE" && (
            <button
              type="button"
              onClick={() => setConfirmationAction("archive")}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50"
            >
              {archiveMutation.isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
              Archive
            </button>
          )}
        </div>
      </header>
      {feedback && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <p>{feedback.message}</p>
        </div>
      )}
      {validation && rateCardStatus === "DRAFT" && (
        <div className="grid gap-3 md:grid-cols-3">
          <div
            className={`rounded-xl border p-4 ${validation.canActivate ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Validation status
            </p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              {validation.canActivate ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              ) : (
                <XCircle className="h-4 w-4 text-red-700" />
              )}
              {validation.canActivate ? "Ready to activate" : "Action required"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Errors
            </p>
            <p className="mt-1 text-2xl font-bold">
              {validation.errors.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Warnings
            </p>
            <p className="mt-1 text-2xl font-bold">
              {validation.warnings.length}
            </p>
          </div>
        </div>
      )}
      {validation && validation.errors.length > 0 && (
        <div className="rounded-xl border border-red-200 p-4">
          <h3 className="font-semibold text-red-800">Errors to resolve</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
            {validation.errors.map((issue, i) => (
              <li key={`${issue.code}-${issue.configurationId ?? ""}-${issue.componentId ?? ""}-${i}`}>
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {validation && validation.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 p-4">
          <h3 className="font-semibold text-amber-800">Warnings</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800">
            {validation.warnings.map((issue, i) => (
              <li key={`${issue.code}-${issue.configurationId ?? ""}-${i}`}>
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {rateCardStatus === "ARCHIVED" && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Archived rate card: preview only.
        </div>
      )}
      {configurations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No configurations available to preview.
        </div>
      ) : (
        <div className="space-y-5">
          {configurations.map((configuration) => (
            <article
              key={configuration.id}
              className="rounded-xl border border-slate-200 p-4 sm:p-5"
            >
              <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold">{configuration.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {configuration.code} · {configuration.currency} ·{" "}
                    {configuration.isActive
                      ? "Active configuration"
                      : "Inactive configuration"}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs">
                  {configuration.currency}
                </span>
              </div>
              <ConfigurationPreview
                rateCardId={rateCardId}
                configuration={configuration}
              />
            </article>
          ))}
        </div>
      )}

      {confirmationAction && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) {
              setConfirmationAction(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rate-card-confirmation-title"
            aria-describedby="rate-card-confirmation-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${confirmationAction === "activate" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {confirmationAction === "activate" ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <Archive className="h-6 w-6" />
              )}
            </div>
            <h3 id="rate-card-confirmation-title" className="mt-4 text-lg font-semibold text-slate-900">
              {confirmationAction === "activate" ? "Activate rate card?" : "Archive rate card?"}
            </h3>
            <p id="rate-card-confirmation-description" className="mt-2 text-sm leading-6 text-slate-600">
              {confirmationAction === "activate"
                ? `You are about to activate “${rateCardName}”. The saved pricing will become available according to your active-rate-card rules. Confirm that the pricing table is correct.`
                : `You are about to archive “${rateCardName}”. It will no longer be treated as an active rate card.`}
            </p>
            {confirmationAction === "activate" && !validation?.canActivate && (
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                Run validation successfully before activating this rate card.
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmationAction(null)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || (confirmationAction === "activate" && !validation?.canActivate)}
                onClick={() => {
                  if (confirmationAction === "activate") void activate();
                  else void archive();
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${confirmationAction === "activate" ? "bg-emerald-700 hover:bg-emerald-800" : "bg-red-600 hover:bg-red-700"}`}
              >
                {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {confirmationAction === "activate" ? "Confirm activation" : "Confirm archive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
