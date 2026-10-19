import { useEffect, useState, type FormEvent } from "react";

import type {
  CreateRateCardInput,
  QuoteDirection,
  QuoteMode,
  RateCard,
} from "../types/pricing.types";

interface RateCardFormProps {
  initialData?: RateCard;
  isSubmitting?: boolean;
  onSubmit: (input: CreateRateCardInput) => void | Promise<void>;
  onCancel?: () => void;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100";

const labelClassName =
  "block text-sm font-semibold text-slate-700";

const modes: { label: string; value: QuoteMode }[] = [
  { label: "Air Freight", value: "AIR" },
  { label: "Land Transport", value: "LAND" },
  { label: "Sea Freight", value: "SEA" },
];

const directions: { label: string; value: QuoteDirection }[] = [
  { label: "Import", value: "IMPORT" },
  { label: "Export", value: "EXPORT" },
];

const currencies = ["NGN", "USD", "EUR", "GBP", "CFA"];

function toDateInput(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function RateCardForm({
  initialData,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: RateCardFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [mode, setMode] = useState<QuoteMode>(
    initialData?.mode ?? "AIR",
  );
  const [direction, setDirection] = useState<QuoteDirection>(
    initialData?.direction ?? "IMPORT",
  );
  const [currency, setCurrency] = useState(
    initialData?.currency ?? "NGN",
  );
  const [effectiveFrom, setEffectiveFrom] = useState(
    toDateInput(initialData?.effectiveFrom) ||
      new Date().toISOString().slice(0, 10),
  );
  const [effectiveTo, setEffectiveTo] = useState(
    toDateInput(initialData?.effectiveTo),
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setName(initialData.name);
    setMode(initialData.mode);
    setDirection(initialData.direction);
    setCurrency(initialData.currency);
    setEffectiveFrom(toDateInput(initialData.effectiveFrom));
    setEffectiveTo(toDateInput(initialData.effectiveTo));
  }, [initialData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Enter a name for this rate card.");
      return;
    }

    if (!effectiveFrom) {
      setError("Select an effective start date.");
      return;
    }

    if (effectiveTo && effectiveTo < effectiveFrom) {
      setError("The end date cannot be earlier than the start date.");
      return;
    }

    const input: CreateRateCardInput = {
      name: name.trim(),
      mode,
      direction,
      currency,
      effectiveFrom: new Date(
        `${effectiveFrom}T00:00:00`,
      ).toISOString(),
      effectiveTo: effectiveTo
        ? new Date(`${effectiveTo}T23:59:59`).toISOString()
        : null,
    };

    try {
      await onSubmit(input);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save the rate card.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {initialData ? "Edit Rate Card" : "Create Rate Card"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Define the transport method, direction, currency, and validity
          period for this pricing configuration.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="rate-card-name" className={labelClassName}>
          Rate card name
        </label>

        <input
          id="rate-card-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Air Import — October 2026"
          className={inputClassName}
          maxLength={150}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rate-card-mode" className={labelClassName}>
            Transport mode
          </label>

          <select
            id="rate-card-mode"
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as QuoteMode)
            }
            className={inputClassName}
            disabled={isSubmitting || Boolean(initialData)}
          >
            {modes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {initialData && (
            <p className="mt-1 text-xs text-slate-500">
              Transport mode cannot be changed after creation.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="rate-card-direction"
            className={labelClassName}
          >
            Direction
          </label>

          <select
            id="rate-card-direction"
            value={direction}
            onChange={(event) =>
              setDirection(event.target.value as QuoteDirection)
            }
            className={inputClassName}
            disabled={isSubmitting || Boolean(initialData)}
          >
            {directions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {initialData && (
            <p className="mt-1 text-xs text-slate-500">
              Direction cannot be changed after creation.
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="rate-card-currency" className={labelClassName}>
          Default currency
        </label>

        <select
          id="rate-card-currency"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting || Boolean(initialData)}
        >
          {currencies.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {initialData && (
          <p className="mt-1 text-xs text-slate-500">
            Create a new rate card if you need a different default
            currency.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="rate-card-effective-from"
            className={labelClassName}
          >
            Effective from
          </label>

          <input
            id="rate-card-effective-from"
            type="date"
            value={effectiveFrom}
            onChange={(event) => setEffectiveFrom(event.target.value)}
            className={inputClassName}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="rate-card-effective-to"
            className={labelClassName}
          >
            Effective until
          </label>

          <input
            id="rate-card-effective-to"
            type="date"
            value={effectiveTo}
            min={effectiveFrom}
            onChange={(event) => setEffectiveTo(event.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
          />

          <p className="mt-1 text-xs text-slate-500">
            Leave empty if there is no planned end date.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Create Rate Card"}
        </button>
      </div>
    </form>
  );
}