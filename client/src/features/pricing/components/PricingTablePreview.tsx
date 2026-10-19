import type {
  RateCardConfiguration,
  RateComponent,
  WeightSlab,
} from "../api/rate-card-editor.api";

interface Props {
  configuration: RateCardConfiguration;
}

function formatAmount(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getComponentValue(component: RateComponent) {
  switch (component.calculationType) {
    case "FIXED":
      return formatAmount(component.value);

    case "PERCENTAGE":
      return `${formatAmount(component.percentage)}%`;

    case "PER_UNIT":
      return `${formatAmount(component.value)}${component.unit ? ` / ${component.unit}` : ""}`;

    case "WEIGHT_SLAB":
      return "See weight table";

    case "VARIABLE":
      return "Variable";

    default:
      return "—";
  }
}

function getSlabRate(
  slab: WeightSlab,
  componentId: string,
) {
  return slab.rates.find(
    (rate) => rate.componentId === componentId,
  );
}

export default function PricingTablePreview({
  configuration,
}: Props) {
  const components = configuration.components.filter(
    (component) => component.isActive,
  );

  const slabs = [...configuration.weightSlabs].sort(
    (a, b) =>
      Number(a.minWeightKg) - Number(b.minWeightKg),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Saved Pricing Table
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configuration: {configuration.name}
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Read-only preview
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Charge
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Calculation Type
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Rate
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Optional
              </th>

              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Taxable
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {components.map((component) => (
              <tr key={component.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {component.name}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {component.calculationType.replaceAll("_", " ")}
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {getComponentValue(component)}
                </td>

                <td className="px-4 py-3">
                  {component.isOptional ? "Yes" : "No"}
                </td>

                <td className="px-4 py-3">
                  {component.isTaxable ? "Yes" : "No"}
                </td>
              </tr>
            ))}

            {components.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No active pricing components.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {components.some(
        (component) =>
          component.calculationType === "WEIGHT_SLAB",
      ) && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">
            Weight Slab Rates
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Weight Range (KG)
                  </th>

                  {components
                    .filter(
                      (component) =>
                        component.calculationType === "WEIGHT_SLAB",
                    )
                    .map((component) => (
                      <th
                        key={component.id}
                        className="px-4 py-3 text-left font-semibold text-slate-700"
                      >
                        {component.name}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {slabs.map((slab) => (
                  <tr key={slab.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {formatAmount(slab.minWeightKg)} –{" "}
                      {slab.maxWeightKg === null
                        ? "Above"
                        : formatAmount(slab.maxWeightKg)}
                    </td>

                    {components
                      .filter(
                        (component) =>
                          component.calculationType === "WEIGHT_SLAB",
                      )
                      .map((component) => {
                        const rate = getSlabRate(
                          slab,
                          component.id,
                        );

                        return (
                          <td
                            key={component.id}
                            className="px-4 py-3 text-slate-700"
                          >
                            {rate
                              ? formatAmount(rate.amount)
                              : "Not configured"}
                          </td>
                        );
                      })}
                  </tr>
                ))}

                {slabs.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        1 +
                        components.filter(
                          (component) =>
                            component.calculationType === "WEIGHT_SLAB",
                        ).length
                      }
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No weight slabs configured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}