import { Link } from "react-router-dom";

import {
  Building2,
  UserRound,
  Users,
  ClipboardList,
  ExternalLink,
} from "lucide-react";

import { Button } from "../../ui/button";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

function Row({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  link?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b py-4 last:border-0">

      <div className="flex items-center gap-3">

        {icon}

        <div>

          <p className="text-sm text-muted-foreground">
            {label}
          </p>

          <p className="font-medium">
            {value || "-"}
          </p>

        </div>

      </div>

      {link && (

        <Button
          asChild
          variant="ghost"
          size="icon"
        >

          <Link to={link}>

            <ExternalLink className="h-4 w-4" />

          </Link>

        </Button>

      )}

    </div>
  );
}

export default function PartiesCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <h2 className="flex items-center gap-2 text-lg font-semibold">

          <Users className="h-5 w-5 text-primary" />

          Parties

        </h2>

      </div>

      <div className="p-5">

        <Row
          icon={
            <Building2 className="h-5 w-5 text-primary" />
          }
          label="Client"
          value={shipment.client.companyName}
          link={`/clients/${shipment.client.id}`}
        />

        <Row
          icon={
            <UserRound className="h-5 w-5 text-primary" />
          }
          label="Exporter"
          value={shipment.exporter.name}
          link={`/exporters/${shipment.exporter.id}`}
        />

        <Row
          icon={
            <UserRound className="h-5 w-5 text-primary" />
          }
          label="Consignee"
          value={shipment.consignee.name}
          link={`/consignees/${shipment.consignee.id}`}
        />

        <Row
          icon={
            <ClipboardList className="h-5 w-5 text-primary" />
          }
          label="Allocation"
          value={
            shipment.allocation
              ?.allocationNumber
          }
          link={
            shipment.allocation
              ? `/allocations/${shipment.allocation.id}`
              : undefined
          }
        />

      </div>

    </div>
  );
}