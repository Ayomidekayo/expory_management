import {
  BriefcaseBusiness,
  CircleAlert,
  ClipboardCheck,
} from "lucide-react";

import { Badge } from "../../ui/badge";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

function formatLabel(value?: string | null) {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getPriorityVariant(priority?: string) {
  switch (priority) {
    case "URGENT":
      return "destructive";

    case "HIGH":
      return "default";

    case "MEDIUM":
      return "secondary";

    default:
      return "outline";
  }
}

function getStatusVariant(status?: string) {
  switch (status) {
    case "APPROVED":
    case "COMPLETED":
      return "default";

    case "PENDING":
      return "secondary";

    case "REJECTED":
    case "CANCELLED":
      return "destructive";

    default:
      return "outline";
  }
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>

      {children}
    </div>
  );
}

export default function ServiceInformationCard({
  allocation,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Service Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Requested service, priority and current status.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Service Type */}
          <InfoCard
            icon={BriefcaseBusiness}
            label="Service Type"
          >
            <p className="text-sm font-semibold text-slate-900">
              {formatLabel(allocation.serviceType)}
            </p>
          </InfoCard>

          {/* Priority */}
          <InfoCard
            icon={CircleAlert}
            label="Priority"
          >
            <Badge
              variant={getPriorityVariant(
                allocation.priority
              )}
              className="mt-0.5"
            >
              {formatLabel(allocation.priority)}
            </Badge>
          </InfoCard>

          {/* Status */}
          <InfoCard
            icon={ClipboardCheck}
            label="Status"
          >
            <Badge
              variant={getStatusVariant(
                allocation.status
              )}
              className="mt-0.5"
            >
              {formatLabel(allocation.status)}
            </Badge>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}