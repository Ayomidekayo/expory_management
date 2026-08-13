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
  iconClassName?: string;
  iconBgClassName?: string;
}

function ModuleRow({
  icon,
  title,
  description,
  buttonText,
  to,
  iconClassName = "text-slate-600",
  iconBgClassName = "bg-slate-50",
}: ModuleRowProps) {
  return (
    <div className="group flex flex-col gap-4 border-b border-slate-100 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 ${iconBgClassName} ${iconClassName} transition-transform duration-200 group-hover:scale-105`}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {/* Action */}
      <Button
        asChild
        variant="outline"
        className="w-full shrink-0 border-slate-200 bg-white sm:w-auto"
      >
        <Link to={to}>
          {buttonText}

          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </div>
  );
}

export default function RelatedModulesCard({
  shipment,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900">
          Related Modules
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Continue processing this shipment.
        </p>
      </div>

      {/* Modules */}
      <div className="px-6">
        <ModuleRow
          icon={<FileText className="h-5 w-5" />}
          title="Invoice"
          description="Create or manage shipment invoices."
          buttonText="Open"
          to={`/invoices/new?shipmentId=${shipment.id}`}
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-50"
        />

        <ModuleRow
          icon={<Package className="h-5 w-5" />}
          title="Packing List"
          description="Create and manage the shipment packing list."
          buttonText="Open"
          to={`/packing-lists/new?shipmentId=${shipment.id}`}
          iconClassName="text-emerald-600"
          iconBgClassName="bg-emerald-50"
        />

        <ModuleRow
          icon={<Truck className="h-5 w-5" />}
          title="Containers"
          description="Manage containers associated with this shipment."
          buttonText="Manage"
          to={`/containers?shipmentId=${shipment.id}`}
          iconClassName="text-orange-600"
          iconBgClassName="bg-orange-50"
        />

        <ModuleRow
          icon={<Route className="h-5 w-5" />}
          title="Transit"
          description="Manage transit activities for this shipment."
          buttonText="Manage"
          to={`/transits?shipmentId=${shipment.id}`}
          iconClassName="text-purple-600"
          iconBgClassName="bg-purple-50"
        />

        <ModuleRow
          icon={<FolderOpen className="h-5 w-5" />}
          title="Documents"
          description="Upload and manage shipment documents."
          buttonText="Open"
          to={`/documents?shipmentId=${shipment.id}`}
          iconClassName="text-rose-600"
          iconBgClassName="bg-rose-50"
        />
      </div>
    </div>
  );
}