import type {
  RateCardConfiguration,
} from "../api/rate-card-editor.api";

interface Props {
  configurations: RateCardConfiguration[];
  selectedId: string;
  onChange: (configurationId: string) => void;
}

export default function ConfigurationSelector({
  configurations,
  selectedId,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="configuration"
        className="block text-sm font-medium text-slate-700"
      >
        Pricing Configuration
      </label>

      <select
        id="configuration"
        value={selectedId}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {configurations.map((configuration) => (
          <option
            key={configuration.id}
            value={configuration.id}
          >
            {configuration.name} ({configuration.currency})
          </option>
        ))}
      </select>
    </div>
  );
}