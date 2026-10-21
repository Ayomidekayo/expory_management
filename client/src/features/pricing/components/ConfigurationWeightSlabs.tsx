import { usePricingSections } from "../hooks/use-pricing-sections";
import WeightSlabsManager from "./WeightSlabsManager";


type Props = {
  rateCardId: string;
  configurationId: string;
  configurationName?: string;
  configurationCurrency: string;
  rateCardStatus?: string;
};

export default function ConfigurationWeightSlabs({
  rateCardId,
  configurationId,
  configurationName,
  configurationCurrency,
  rateCardStatus = "DRAFT",
}: Props) {
  const {
    data: sections = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePricingSections(configurationId);

  const activeSections = sections
    .filter((section) => section.isActive)
    .sort(
      (a, b) =>
        a.displayOrder - b.displayOrder ||
        a.name.localeCompare(b.name),
    );

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Weight Slabs
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {configurationName
            ? `Manage weight-based pricing for ${configurationName}. `
            : ""}
          Create weight ranges once and configure their component rates
          across all applicable pricing sections.
        </p>
      </header>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 p-5 text-sm text-slate-500">
          Loading pricing sections…
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>
            {error instanceof Error
              ? error.message
              : "Unable to load pricing sections."}
          </p>

          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold"
          >
            Retry
          </button>
        </div>
      ) : activeSections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
          Create and activate at least one pricing section before
          configuring weight-based pricing.
        </div>
      ) : (
        <WeightSlabsManager
  rateCardId={rateCardId}
  configurationId={configurationId}
  configurationName={configurationName}
  configurationCurrency={configurationCurrency}
  rateCardStatus={rateCardStatus}
  pricingSections={activeSections}
/>
      )}
    </section>
  );
}