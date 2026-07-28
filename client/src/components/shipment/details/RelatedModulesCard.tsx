import { Link } from "react-router-dom";

import {
  FileText,
  Package,
  Truck,
  Route,
  FolderOpen,
  ArrowRight,
} from "lucide-react";

import { Button } from "../../ui/button";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

interface ModuleRowProps {
  icon: React.ReactNode;

  title: string;

  description: string;

  buttonText: string;

  to: string;
}

function ModuleRow({
  icon,
  title,
  description,
  buttonText,
  to,
}: ModuleRowProps) {
  return (
    <div className="flex items-center justify-between border-b py-5 last:border-0">

      <div className="flex items-center gap-4">

        <div className="rounded-lg bg-primary/10 p-3">
          {icon}
        </div>

        <div>

          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>

        </div>

      </div>

      <Button
        asChild
        variant="outline"
      >
        <Link to={to}>

          {buttonText}

          <ArrowRight className="ml-2 h-4 w-4" />

        </Link>
      </Button>

    </div>
  );
}

export default function RelatedModulesCard({
  shipment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-6">

        <h2 className="text-xl font-semibold">
          Related Modules
        </h2>

        <p className="text-sm text-muted-foreground">

          Continue processing this shipment.

        </p>

      </div>

      <div className="p-6">

        <ModuleRow
          icon={<FileText className="h-5 w-5 text-primary" />}
          title="Invoice"
          description="Create or manage shipment invoice."
          buttonText="Open"
          to={`/invoices/new?shipmentId=${shipment.id}`}
        />

        <ModuleRow
          icon={<Package className="h-5 w-5 text-primary" />}
          title="Packing List"
          description="Create packing list."
          buttonText="Open"
          to={`/packing-lists/new?shipmentId=${shipment.id}`}
        />

        <ModuleRow
          icon={<Truck className="h-5 w-5 text-primary" />}
          title="Containers"
          description="Manage shipment containers."
          buttonText="Manage"
          to={`/containers?shipmentId=${shipment.id}`}
        />

        <ModuleRow
          icon={<Route className="h-5 w-5 text-primary" />}
          title="Transit"
          description="Manage shipment transit."
          buttonText="Manage"
          to={`/transits?shipmentId=${shipment.id}`}
        />

        <ModuleRow
          icon={<FolderOpen className="h-5 w-5 text-primary" />}
          title="Documents"
          description="Upload and manage shipment documents."
          buttonText="Open"
          to={`/documents?shipmentId=${shipment.id}`}
        />

      </div>

    </div>
  );
}