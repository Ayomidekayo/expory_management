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

interface RowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  link?: string;
  iconClassName?: string;
  iconBgClassName?: string;
}

function Row({
  icon,
  label,
  value,
  link,
  iconClassName = "text-slate-600",
  iconBgClassName = "bg-slate-50",
}: RowProps) {
  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-4 border-b border-slate-100 py-4 last:border-b-0">
      {/* Icon */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 ${iconBgClassName} ${iconClassName}`}
      >
        {icon}
      </div>

      {/* Information */}
      <div className="min-w-0">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <p
          className="truncate text-sm font-semibold text-slate-900"
          title={value || "Not provided"}
        >
          {value || "Not provided"}
        </p>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        {link ? (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Link
              to={link}
              aria-label={`View ${label}`}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="h-9 w-9" />
        )}
      </div>
    </div>
  );
}

export default function PartiesCard({
  shipment,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Parties
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Parties associated with this shipment
            </p>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="px-6">
        {/* Client */}
        <Row
          icon={<Building2 className="h-5 w-5" />}
          label="Client"
          value={shipment.client?.companyName}
          link={
            shipment.client
              ? `/clients/${shipment.client.id}`
              : undefined
          }
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-50"
        />

        {/* Exporter */}
        <Row
          icon={<UserRound className="h-5 w-5" />}
          label="Exporter"
          value={shipment.exporter?.name}
          link={
            shipment.exporter
              ? `/exporters/${shipment.exporter.id}`
              : undefined
          }
          iconClassName="text-emerald-600"
          iconBgClassName="bg-emerald-50"
        />

        {/* Consignee */}
        <Row
          icon={<UserRound className="h-5 w-5" />}
          label="Consignee"
          value={shipment.consignee?.name}
          link={
            shipment.consignee
              ? `/consignees/${shipment.consignee.id}`
              : undefined
          }
          iconClassName="text-orange-600"
          iconBgClassName="bg-orange-50"
        />

        {/* Allocation */}
        <Row
          icon={<ClipboardList className="h-5 w-5" />}
          label="Allocation"
          value={
            shipment.allocation?.allocationNumber
          }
          link={
            shipment.allocation
              ? `/allocations/${shipment.allocation.id}`
              : undefined
          }
          iconClassName="text-purple-600"
          iconBgClassName="bg-purple-50"
        />
      </div>
    </div>
  );
}