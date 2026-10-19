import { useEffect, useState, type FormEvent } from "react";
import type {
  CalculationBasis,
  CreateRateComponentInput,
  RateCalculationType,
  RateComponent,
  UpdateRateComponentInput,
} from "../types/pricing.types";

interface RateComponentFormProps {
  configurationId: string;
  initialData?: RateComponent;
  isSubmitting?: boolean;
  onSubmit: (
    data: CreateRateComponentInput | UpdateRateComponentInput,
  ) => Promise<void> | void;
  onCancel: () => void;
}

const calculationTypes: {
  value: RateCalculationType;
  label: string;
  description: string;
}[] = [
  {
    value: "FIXED",
    label: "Fixed charge",
    description: "A fixed amount per applicable shipment.",
  },
  {
    value: "PER_UNIT",
    label: "Per-unit charge",
    description: "A charge multiplied by a quantity.",
  },
  {
    value: "PERCENTAGE",
    label: "Percentage charge",
    description: "A percentage of a selected calculation basis.",
  },
  {
    value: "WEIGHT_SLAB",
    label: "Weight-slab charge",
    description: "The amount is configured in the weight-slab table.",
  },
  {
    value: "VARIABLE",
    label: "Variable charge",
    description: "Requires manual pricing or review.",
  },
];

const calculationBases: { value: CalculationBasis; label: string }[] = [
  { value: "WEIGHT", label: "Shipment weight" },
  { value: "QUANTITY", label: "Quantity" },
  { value: "CUSTOMS_VALUE", label: "Customs value" },
  { value: "FREIGHT_AMOUNT", label: "Freight amount" },
  { value: "SUBTOTAL", label: "Subtotal" },
  { value: "CONTAINER", label: "Container" },
  { value: "SHIPMENT", label: "Shipment" },
  { value: "MANUAL", label: "Manual calculation" },
];

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "block text-sm font-medium text-slate-700";

export default function RateComponentForm({
  configurationId,
  initialData,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: RateComponentFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [calculationType, setCalculationType] =
    useState<RateCalculationType>("FIXED");
  const [calculationBasis, setCalculationBasis] =
    useState<CalculationBasis>("SHIPMENT");
  const [unit, setUnit] = useState("");
  const [value, setValue] = useState("");
  const [percentage, setPercentage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isOptional, setIsOptional] = useState(false);
  const [isTaxable, setIsTaxable] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initialData?.name ?? "");
    setCode(initialData?.code ?? "");
    setCalculationType(initialData?.calculationType ?? "FIXED");
    setCalculationBasis(initialData?.calculationBasis ?? "SHIPMENT");
    setUnit(initialData?.unit ?? "");
    setValue(
      initialData?.value !== null && initialData?.value !== undefined
        ? String(initialData.value)
        : "",
    );
    setPercentage(
      initialData?.percentage !== null &&
        initialData?.percentage !== undefined
        ? String(initialData.percentage)
        : "",
    );
    setIsActive(initialData?.isActive ?? true);
    setIsOptional(initialData?.isOptional ?? false);
    setIsTaxable(initialData?.isTaxable ?? false);
    setNotes(initialData?.notes ?? "");
    setError("");
  }, [initialData]);

  const needsValue =
    calculationType === "FIXED" || calculationType === "PER_UNIT";

  const needsPercentage = calculationType === "PERCENTAGE";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Enter a charge name.");
      return;
    }

    if (needsValue && (value.trim() === "" || !Number.isFinite(Number(value)) || Number(value) < 0)) {
      setError("Enter a valid non-negative charge amount.");
      return;
    }

    if (
      needsPercentage &&
      (percentage.trim() === "" ||
        !Number.isFinite(Number(percentage)) ||
        Number(percentage) < 0 ||
        Number(percentage) > 100)
    ) {
      setError("Enter a percentage between 0 and 100.");
      return;
    }

    const payload: CreateRateComponentInput = {
      configurationId,
      name: name.trim(),
      code: code.trim() || undefined,
      calculationType,
      calculationBasis,
      unit: unit.trim() || undefined,
      value: needsValue ? Number(value) : undefined,
      percentage: needsPercentage ? Number(percentage) : undefined,
      isActive,
      isOptional,
      isTaxable,
      notes: notes.trim() || undefined,
    };

    try {
      await onSubmit(payload);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save this charge. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {initialData ? "Edit charge" : "Add pricing charge"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure how this charge is calculated for the selected pricing
          configuration.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="charge-name" className={labelClass}>
            Charge name *
          </label>
          <input
            id="charge-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Customs processing"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="charge-code" className={labelClass}>
            Charge code
          </label>
          <input
            id="charge-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="e.g. CUSTOMS_PROCESSING"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="calculation-type" className={labelClass}>
            Calculation type *
          </label>
          <select
            id="calculation-type"
            value={calculationType}
            onChange={(event) => {
              const nextType = event.target.value as RateCalculationType;
              setCalculationType(nextType);

              if (nextType === "WEIGHT_SLAB") {
                setCalculationBasis("WEIGHT");
              } else if (nextType === "FIXED") {
                setCalculationBasis("SHIPMENT");
              } else if (nextType === "PER_UNIT") {
                setCalculationBasis("QUANTITY");
              }
            }}
            className={inputClass}
          >
            {calculationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            {
              calculationTypes.find(
                (type) => type.value === calculationType,
              )?.description
            }
          </p>
        </div>

        <div>
          <label htmlFor="calculation-basis" className={labelClass}>
            Calculation basis *
          </label>
          <select
            id="calculation-basis"
            value={calculationBasis}
            onChange={(event) =>
              setCalculationBasis(event.target.value as CalculationBasis)
            }
            className={inputClass}
          >
            {calculationBases.map((basis) => (
              <option key={basis.value} value={basis.value}>
                {basis.label}
              </option>
            ))}
          </select>
        </div>

        {needsValue && (
          <div>
            <label htmlFor="charge-value" className={labelClass}>
              Charge amount *
            </label>
            <input
              id="charge-value"
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="0.00"
              className={inputClass}
              required
            />
          </div>
        )}

        {needsPercentage && (
          <div>
            <label htmlFor="charge-percentage" className={labelClass}>
              Percentage (%) *
            </label>
            <input
              id="charge-percentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={percentage}
              onChange={(event) => setPercentage(event.target.value)}
              placeholder="7.5"
              className={inputClass}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="charge-unit" className={labelClass}>
            Unit
          </label>
          <input
            id="charge-unit"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            placeholder="e.g. kg, shipment, container"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Charge settings
        </h3>

        {[
          {
            label: "Active",
            description: "Include this charge in applicable pricing calculations.",
            checked: isActive,
            onChange: setIsActive,
          },
          {
            label: "Optional service",
            description: "Allow exporters to choose whether to include this service.",
            checked: isOptional,
            onChange: setIsOptional,
          },
          {
            label: "Taxable",
            description: "Mark this charge as taxable where the pricing rules apply.",
            checked: isTaxable,
            onChange: setIsTaxable,
          },
        ].map((setting) => (
          <label
            key={setting.label}
            className="flex items-start gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={setting.checked}
              onChange={(event) => setting.onChange(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            <span>
              <span className="block text-sm font-medium text-slate-800">
                {setting.label}
              </span>
              <span className="block text-xs text-slate-500">
                {setting.description}
              </span>
            </span>
          </label>
        ))}
      </div>

      {calculationType === "VARIABLE" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          This charge requires manual pricing or review. It should not be
          silently treated as zero when calculating a final quotation.
        </div>
      )}

      {calculationType === "WEIGHT_SLAB" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Save this charge first, then configure its amounts in the weight-slab
          section.
        </div>
      )}

      <div>
        <label htmlFor="charge-notes" className={labelClass}>
          Internal notes
        </label>
        <textarea
          id="charge-notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional notes for pricing administrators"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save changes"
              : "Add charge"}
        </button>
      </div>
    </form>
  );
}