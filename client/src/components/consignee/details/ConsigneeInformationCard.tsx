import type { Consignee } from "../../../types/consignee";
interface Props {
  consignee: Consignee;
}

export default function ConsigneeInformationCard({ consignee }: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold">Consignee Information</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Info label="Name" value={consignee.name} />

        <Info label="Contact Person" value={consignee.contactPerson} />

        <Info label="Email" value={consignee.email} />

        <Info label="Phone" value={consignee.phone} />

        <Info label="Transporter" value={consignee.transporter} />

        <Info label="Transport Mode" value={consignee.transportMode} />

        <Info label="Place of Loading" value={consignee.placeOfLoading} />

        <Info label="Transit Route" value={consignee.transitRoute} />

        <Info label="Port of Discharge" value={consignee.portOfDischarge} />

        <div className="md:col-span-2">
          <Info label="Address" value={consignee.address} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}
