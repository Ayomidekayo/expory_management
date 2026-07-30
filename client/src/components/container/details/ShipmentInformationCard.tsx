import {
  Ship,
  Building2,
  User,
  Truck,
  Anchor,
  MapPin,
  FileText,
  CalendarDays,
  Clock,
} from "lucide-react";
import type { Shipment } from "../../../types/shipment.types";



interface Props {
  shipment: Shipment;
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">

      <div className="flex items-center gap-3">

        {icon}

        <span className="text-sm text-muted-foreground">
          {label}
        </span>

      </div>

      <span className="max-w-[55%] break-words text-right font-medium">
        {value || "-"}
      </span>

    </div>
  );
}

export default function ShipmentInformationCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <Ship className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Shipment Information
          </h2>

        </div>

      </div>

      <div className="p-5">

        <Row
          icon={
            <FileText className="h-4 w-4 text-blue-600" />
          }
          label="Shipment Number"
          value={shipment.shipmentNumber}
        />

        <Row
          icon={
            <CalendarDays className="h-4 w-4 text-green-600" />
          }
          label="Shipment Date"
          value={new Date(
            shipment.shipmentDate
          ).toLocaleDateString()}
        />

        <Row
          icon={
            <Building2 className="h-4 w-4 text-purple-600" />
          }
          label="Client"
          value={shipment.client?.companyName}
        />

        <Row
          icon={
            <Building2 className="h-4 w-4 text-indigo-600" />
          }
          label="Exporter"
          value={shipment.exporter?.name}
        />

        <Row
          icon={
            <User className="h-4 w-4 text-orange-600" />
          }
          label="Consignee"
          value={shipment.consignee?.name}
        />

        <Row
          icon={
            <Truck className="h-4 w-4 text-cyan-600" />
          }
          label="Transport Mode"
          value={shipment.transportMode}
        />

        <Row
          icon={
            <Ship className="h-4 w-4 text-emerald-600" />
          }
          label="Status"
          value={shipment.status.replaceAll(
            "_",
            " "
          )}
        />

        <Row
          icon={
            <Anchor className="h-4 w-4 text-sky-600" />
          }
          label="Shipping Line"
          value={shipment.shippingLine}
        />

        <Row
          icon={
            <Ship className="h-4 w-4 text-violet-600" />
          }
          label="Vessel Name"
          value={shipment.vesselName}
        />

        <Row
          icon={
            <MapPin className="h-4 w-4 text-red-600" />
          }
          label="Port of Loading"
          value={shipment.portOfLoading}
        />

        <Row
          icon={
            <MapPin className="h-4 w-4 text-rose-600" />
          }
          label="Port of Discharge"
          value={shipment.portOfDischarge}
        />

        <Row
          icon={
            <FileText className="h-4 w-4 text-amber-600" />
          }
          label="XF Number"
          value={shipment.xfNumber}
        />

        <Row
          icon={
            <FileText className="h-4 w-4 text-lime-600" />
          }
          label="NXP Number"
          value={shipment.nxpNumber}
        />

        <Row
          icon={
            <FileText className="h-4 w-4 text-pink-600" />
          }
          label="CCI Number"
          value={shipment.cciNumber}
        />

        <Row
          icon={
            <FileText className="h-4 w-4 text-slate-600" />
          }
          label="Allocation Number"
          value={
            shipment.allocation?.allocationNumber
          }
        />

        <Row
          icon={
            <Clock className="h-4 w-4 text-gray-500" />
          }
          label="Created"
          value={new Date(
            shipment.createdAt
          ).toLocaleDateString()}
        />

        <Row
          icon={
            <Clock className="h-4 w-4 text-gray-700" />
          }
          label="Last Updated"
          value={new Date(
            shipment.updatedAt
          ).toLocaleDateString()}
        />

      </div>

    </div>
  );
}