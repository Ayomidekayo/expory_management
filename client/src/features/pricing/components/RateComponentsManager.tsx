import { useMemo, useState } from "react";
import {
  Check,
  CircleAlert,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import {
  useCreateRateComponent,
  useRateComponents,
  useUpdateRateComponent,
} from "../hooks/use-rate-components";
import { usePricingSections } from "../hooks/use-pricing-sections";
import type {
  CalculationBasis,
  CreateRateComponentPayload,
  PricingSectionOption,
  RateCalculationType,
  RateComponent,
  RateComponentInput,
} from "../types/rate-component.types";

type Props = {
  rateCardId: string;
  rateCardStatus: string;
  currency?: string;
  configurationId: string;
};
const blank = (configurationId: string): RateComponentInput => ({
  configurationId,
  name: "",
  code: "",
  calculationType: "FIXED",
  value: 0,
  percentage: null,
  calculationBasis: null,
  unit: null,
  isActive: true,
  isOptional: false,
  isTaxable: true,
  notes: null,
  pricingSectionId: null,
  optionId: null,
});
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";
function money(value: RateComponent["value"], currency: string) {
  if (value === null || value === undefined || value === "") return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export default function RateComponentsManager({
  rateCardId,
  rateCardStatus,
  currency = "NGN",
  configurationId,
}: Props) {
  const { data: rawSections = [] } = usePricingSections(configurationId);
  const sections: PricingSectionOption[] = rawSections.map((section: any) => ({
    id: section.id,
    name: section.name,
    code: section.code,
    currency: section.currency,
    optionId: section.optionId ?? section.option?.id ?? null,
    isActive: section.isActive,
  }));
  const editable = rateCardStatus === "DRAFT";
  const {
    data: components = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useRateComponents(rateCardId);
  const createComponent = useCreateRateComponent(rateCardId);
  const updateComponent = useUpdateRateComponent(rateCardId);
  const [form, setForm] = useState<RateComponentInput>(() =>
    blank(configurationId),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const selectedSection = useMemo(
    () => sections.find((s) => s.id === form.pricingSectionId),
    [sections, form.pricingSectionId],
  );
  const busy = createComponent.isPending || updateComponent.isPending;

  function startEdit(item: RateComponent) {
    setEditingId(item.id);
    setShowForm(true);
    setMessage("");

    setForm({
      configurationId,
      name: item.name,
      code: item.code ?? "",
      calculationType: item.calculationType,
      calculationBasis: item.calculationBasis ?? null,
      unit: item.unit ?? null,
      value:
        item.value == null || item.value === "" ? null : Number(item.value),
      percentage:
        item.percentage == null || item.percentage === ""
          ? null
          : Number(item.percentage),
      isActive: item.isActive,
      isOptional: item.isOptional,
      isTaxable: item.isTaxable,
      notes: item.notes ?? null,
      pricingSectionId: item.pricingSectionId ?? null,
      optionId: item.optionId ?? item.pricingSection?.optionId ?? null,
    });
  }

  function reset() {
    setForm(blank(configurationId));
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
   const payload: CreateRateComponentPayload = {
  name: form.name.trim(),
  code: form.code?.trim() || undefined,
  calculationType: form.calculationType,
  calculationBasis: form.calculationBasis,
  unit: form.unit,
  value:
    form.calculationType === "FIXED" ||
    form.calculationType === "PER_UNIT"
      ? Number(form.value ?? 0)
      : null,
  percentage:
    form.calculationType === "PERCENTAGE"
      ? Number(form.percentage ?? 0)
      : null,
  isActive: form.isActive,
  isOptional: form.isOptional,
  isTaxable: form.isTaxable,
  notes: form.notes,
  pricingSectionId: form.pricingSectionId || null,
  optionId: selectedSection?.optionId ?? form.optionId ?? null,
};
    try {
      if (editingId)
        await updateComponent.mutateAsync({ id: editingId, input: payload });
      else await createComponent.mutateAsync(payload);
      setMessage(editingId ? "Charge updated." : "Charge added.");
      reset();
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Could not save this charge. Check the API response.",
      );
    }
  }
  async function toggleActive(item: RateComponent) {
    try {
      await updateComponent.mutateAsync({
        id: item.id,
        input: { isActive: !item.isActive },
      });
      setMessage("");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Could not update charge.",
      );
    }
  }
  const displayedSections = sections.filter((section) => section.isActive);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">Rate Components</h3>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {components.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Enter the actual charge amounts used in the quotation.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          {editable && (
          <button
  type="button"
  onClick={() => {
    setForm(blank(configurationId));
    setEditingId(null);
    setShowForm((v) => !v);
    setMessage("");
  }}
  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
>
  <Plus className="h-4 w-4" />
  Add Charge
</button>
          )}
        </div>
      </div>
      {!editable && (
        <p className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          This rate card is not in Draft status. Charges are read-only.
        </p>
      )}
      {showForm && editable && (
        <form
          onSubmit={submit}
          className="space-y-4 border-b border-emerald-100 bg-emerald-50/60 p-5"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">
              {editingId ? "Edit charge" : "Add a charge"}
            </h4>
            <button
              type="button"
              onClick={reset}
              aria-label="Close form"
              className="rounded-md p-1 text-slate-500 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className={labelClass}>Charge name *</label>
              <input
                required
                minLength={2}
                maxLength={120}
                className={inputClass}
                placeholder="Freight Charges"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Code (optional)</label>
              <input
                className={inputClass}
                placeholder="FREIGHT_CHARGES"
                value={form.code ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    code: e.target.value.toUpperCase().replace(/\s+/g, "_"),
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Pricing section</label>
              <select
                className={inputClass}
                value={form.pricingSectionId ?? ""}
                onChange={(e) => {
                  const section = sections.find((s) => s.id === e.target.value);
                  setForm({
                    ...form,
                    pricingSectionId: e.target.value || null,
                    optionId: section?.optionId ?? null,
                  });
                }}
              >
                <option value="">General / no section</option>
                {displayedSections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Calculation type *</label>
              <select
                className={inputClass}
                value={form.calculationType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    calculationType: e.target.value as RateCalculationType,
                  })
                }
              >
                <option value="FIXED">Fixed amount</option>
                <option value="PER_UNIT">Per unit</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="WEIGHT_SLAB">
                  Weight slab (price entered separately)
                </option>
                <option value="VARIABLE">Variable / manual quote</option>
              </select>
            </div>
            {(form.calculationType === "FIXED" ||
              form.calculationType === "PER_UNIT") && (
              <div>
                <label className={labelClass}>
                  {form.calculationType === "PER_UNIT"
                    ? `Amount per unit (${currency})`
                    : `Amount (${currency})`}{" "}
                  *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.value ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      value:
                        e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </div>
            )}
            {form.calculationType === "PER_UNIT" && (
              <div>
                <label className={labelClass}>Unit</label>
                <input
                  className={inputClass}
                  placeholder="kg, shipment, document"
                  value={form.unit ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, unit: e.target.value || null })
                  }
                />
              </div>
            )}
            {form.calculationType === "PERCENTAGE" && (
              <>
                <div>
                  <label className={labelClass}>Percentage (%) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className={inputClass}
                    value={form.percentage ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, percentage: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Calculation basis</label>
                  <select
                    className={inputClass}
                    value={form.calculationBasis ?? "SUBTOTAL"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        calculationBasis: e.target.value as CalculationBasis,
                      })
                    }
                  >
                    <option value="SUBTOTAL">Subtotal</option>
                    <option value="CUSTOMS_VALUE">Customs value</option>
                    <option value="FREIGHT_AMOUNT">Freight amount</option>
                  </select>
                </div>
              </>
            )}
            <div className="md:col-span-2 xl:col-span-3">
              <label className={labelClass}>Notes (optional)</label>
              <textarea
                rows={2}
                className={inputClass}
                value={form.notes ?? ""}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value || null })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {(
              [
                ["isActive", "Active charge"],
                ["isOptional", "Optional service"],
                ["isTaxable", "Apply VAT to this charge"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="inline-flex items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={Boolean(form[key])}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.checked })
                  }
                  className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                {label}
              </label>
            ))}
          </div>
          {form.calculationType === "WEIGHT_SLAB" && (
            <p className="text-sm text-amber-800">
              The actual weight-based rates must be entered in the Weight Slabs
              manager; this component does not store a fixed amount.
            </p>
          )}
          {message && <p className="text-sm text-rose-700">{message}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {busy ? "Saving..." : editingId ? "Save Changes" : "Save Charge"}
            </button>
          </div>
        </form>
      )}
      {message && !showForm && (
        <p className="px-5 pt-3 text-sm text-rose-700">{message}</p>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading charges…
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 p-5 text-sm text-rose-700">
          <CircleAlert className="h-5 w-5" />
          {error instanceof Error
            ? error.message
            : "Unable to load rate components."}
        </div>
      ) : components.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <CircleAlert className="h-5 w-5 text-slate-500" />
          </div>
          <p className="mt-3 font-medium text-slate-900">
            No charges added yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add Freight Charges, Handling Charges, FAAN Charges, and other items
            for this rate card.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Charge</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Calculation</th>
                <th className="px-4 py-3 text-right">Amount / Rate</th>
                <th className="px-4 py-3">VAT</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {components.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    {item.code && (
                      <p className="mt-1 text-xs text-slate-500">{item.code}</p>
                    )}
                    {item.isOptional && (
                      <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                        Optional service
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {item.pricingSection?.name ?? "General"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {item.calculationType === "FIXED"
                      ? "Fixed"
                      : item.calculationType === "PER_UNIT"
                        ? `Per ${item.unit || "unit"}`
                        : item.calculationType === "PERCENTAGE"
                          ? `${item.percentage ?? 0}%`
                          : item.calculationType === "WEIGHT_SLAB"
                            ? "Weight slab"
                            : "Variable"}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums text-slate-900">
                    {item.calculationType === "PERCENTAGE"
                      ? `${item.percentage ?? 0}%`
                      : item.calculationType === "WEIGHT_SLAB" ||
                          item.calculationType === "VARIABLE"
                        ? "Configured separately"
                        : money(
                            item.value,
                            item.pricingSection?.currency ?? currency,
                          )}
                  </td>
                  <td className="px-4 py-4">
                    {item.isTaxable ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                        Taxable
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      {editable && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            title="Edit charge"
                            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void toggleActive(item)}
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700"
                          >
                            {item.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
