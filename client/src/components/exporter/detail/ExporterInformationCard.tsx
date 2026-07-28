import type { Exporter } from "../../../types";


interface Props {
  exporter: Exporter;
}

export default function ExporterInformationCard({
  exporter,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Exporter Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <Info
          label="Exporter Name"
          value={exporter.name}
        />

        <Info
          label="Contact Person"
          value={exporter.contactPerson}
        />

        <Info
          label="Email"
          value={exporter.email}
        />

        <Info
          label="Phone"
          value={exporter.phone}
        />

        <div className="md:col-span-2">

          <Info
            label="Address"
            value={exporter.address}
          />

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value || "-"}
      </p>

    </div>
  );
}