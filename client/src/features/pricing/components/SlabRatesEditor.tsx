import { useMemo, useState } from "react";
import { useRateComponents } from "../hooks/use-rate-components";
import {
  useSetWeightSlabRates,
  useWeightSlab,
} from "../hooks/use-weight-slabs";
import type {
  WeightPricingSection,
  WeightSlab,
  WeightSlabRate,
} from "../types/weight-slab.types";

type Props = {
  slab: WeightSlab;
  currency: string;
  readOnly: boolean;
  pricingSections: WeightPricingSection[];
  onClose: () => void;
  onSaved: () => void;
};

const rateAmount = (rate?: WeightSlabRate) =>
  rate?.amount == null ? "" : String(rate.amount);

export default function SlabRatesEditor({
  slab,
  currency,
  readOnly,
  pricingSections,
  onClose,
  onSaved,
}: Props) {
  const slabQuery = useWeightSlab(slab.id);
 const componentsQuery = useRateComponents(
  slab.rateCardId,
  slab.configurationId ?? undefined,
  true,
  true,
);
  const saveRates = useSetWeightSlabRates(slab.rateCardId);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const current = slabQuery.data ?? slab;
  const sectionById = useMemo(
    () => new Map(pricingSections.map((section) => [section.id, section])),
    [pricingSections],
  );

  // One slab belongs to the configuration, so show applicable WEIGHT_SLAB
  // components from every active section in that configuration.
const components = useMemo(() => {
  const allComponents = componentsQuery.data ?? [];

  return allComponents
    .filter((component) => {
      // Only active weight-based charges belong in this editor.
      if (
        component.calculationType !== "WEIGHT_SLAB" ||
        !component.isActive
      ) {
        return false;
      }

      // The slab must belong to a specific configuration.
      if (!current.configurationId) {
        return false;
      }

      // Never include a component explicitly assigned to
      // another configuration.
      if (
        component.configurationId &&
        component.configurationId !== current.configurationId
      ) {
        return false;
      }

      // General components are allowed. Section-specific
      // components must belong to an active section supplied
      // to this editor.
      if (component.pricingSectionId) {
        const section = sectionById.get(
          component.pricingSectionId,
        );

        if (!section) {
          return false;
        }

        // If the component includes configuration information
        // through its section, enforce that relationship too.
        if (
          section.configurationId &&
          section.configurationId !== current.configurationId
        ) {
          return false;
        }
      }

      // Option-specific charges must remain within the
      // appropriate pricing section.
      if (
        component.optionId &&
        component.pricingSectionId
      ) {
        const section = sectionById.get(
          component.pricingSectionId,
        );

        if (
          section?.optionId &&
          section.optionId !== component.optionId
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const aSection = a.pricingSectionId
        ? sectionById.get(a.pricingSectionId)?.name ??
          "General pricing"
        : "General pricing";

      const bSection = b.pricingSectionId
        ? sectionById.get(b.pricingSectionId)?.name ??
          "General pricing"
        : "General pricing";

      return (
        aSection.localeCompare(bSection) ||
        a.name.localeCompare(b.name)
      );
    });
}, [
  componentsQuery.data,
  current.configurationId,
  sectionById,
]);

  const saved = current.rates ?? [];
  const valueFor = (id: string) =>
    Object.prototype.hasOwnProperty.call(amounts, id)
      ? amounts[id]
      : rateAmount(saved.find((rate) => rate.componentId === id));

  async function submit() {
    setError("");
    const rates = components
  .filter((component) => valueFor(component.id).trim() !== "")
  .map((component) => ({
    componentId: component.id,
    amount: Number(valueFor(component.id)),
  }));
    if (
      rates.some((rate) => !Number.isFinite(rate.amount) || rate.amount < 0)
    ) {
      setError("Enter valid non-negative amounts.");
      return;
    }
    if (!rates.length) {
      setError("Enter at least one component rate before saving.");
      return;
    }
    try {
      await saveRates.mutateAsync({
        weightSlabId: current.id,
        input: { rates },
      });
      setAmounts({});
      onSaved();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to save slab rates.",
      );
    }
  }

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof components>();
    for (const component of components) {
      const sectionId = component.pricingSectionId ?? "__general__";
      groups.set(sectionId, [...(groups.get(sectionId) ?? []), component]);
    }
    return [...groups.entries()].sort(([a], [b]) => {
      const aName =
        a === "__general__"
          ? "General pricing"
          : (sectionById.get(a)?.name ?? "");
      const bName =
        b === "__general__"
          ? "General pricing"
          : (sectionById.get(b)?.name ?? "");
      return aName.localeCompare(bName);
    });
  }, [components, sectionById]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="font-semibold text-slate-900">
            Rates for {current.label}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Enter prices for all applicable pricing sections in {currency}.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="self-start rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
        >
          Close
        </button>
      </header>
      {(componentsQuery.isError || slabQuery.isError) && (
        <div
          role="alert"
          className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          Unable to load components or saved rates. Check the API response and
          try again.
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {componentsQuery.isLoading || slabQuery.isLoading ? (
        <p className="p-5 text-sm text-slate-500">Loading component rates…</p>
      ) : components.length === 0 ? (
        <div className="p-6 text-sm text-slate-500">
          No active WEIGHT_SLAB components were found in the active pricing
          sections. Check the components' configuration, calculation type, and
          active status.
        </div>
      ) : (
        <>
          <div className="space-y-5 p-3 sm:p-4">
            {grouped.map(([sectionId, sectionComponents]) => {
              const section =
                sectionId === "__general__"
                  ? undefined
                  : sectionById.get(sectionId);
              return (
                <section
                  key={sectionId}
                  className="overflow-hidden rounded-lg border border-slate-200"
                >
                  <header className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-4 py-3">
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {section?.name ?? "General pricing"}
                      </h4>
                      {section?.code && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          Code: {section.code}
                          {section.option
                            ? ` · Option: ${section.option.name}`
                            : ""}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      {section?.currency || currency}
                    </span>
                  </header>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead className="bg-white text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Component</th>
                          <th className="px-4 py-3">Taxable</th>
                          <th className="px-4 py-3">
                            Amount ({section?.currency || currency})
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sectionComponents.map((component) => (
                          <tr key={component.id}>
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900">
                                {component.name}
                              </div>
                              {component.code && (
                                <div className="text-xs text-slate-500">
                                  {component.code}
                                </div>
                              )}
                              {component.isOptional && (
                                <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                                  Optional
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {component.isTaxable ? "Yes" : "No"}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                disabled={readOnly || saveRates.isPending}
                                value={valueFor(component.id)}
                                onChange={(event) =>
                                  setAmounts((previous) => ({
                                    ...previous,
                                    [component.id]: event.target.value,
                                  }))
                                }
                                placeholder="Enter rate"
                                className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
          {!readOnly && (
            <footer className="flex flex-col justify-between gap-3 border-t p-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Blank fields are not submitted. Previously saved rates remain
                when omitted.
              </p>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={saveRates.isPending}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {saveRates.isPending ? "Saving rates…" : "Save rates"}
              </button>
            </footer>
          )}
        </>
      )}
    </section>
  );
}
