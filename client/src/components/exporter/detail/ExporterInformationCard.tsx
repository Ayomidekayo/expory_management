import { Building2, Mail, MapPin, Phone, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import type { Exporter } from "../../../types/exporter.types";

interface Props {
  exporter: Exporter;
}

export default function ExporterInformationCard({
  exporter,
}: Props) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-200 bg-slate-50/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Exporter Information
            </CardTitle>

            <p className="mt-0.5 text-sm text-slate-500">
              Contact and business information for this exporter.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Info
            icon={<Building2 className="h-4 w-4" />}
            label="Exporter Name"
            value={exporter.name}
          />

          <Info
            icon={<User className="h-4 w-4" />}
            label="Contact Person"
            value={exporter.contactPerson}
          />

          <Info
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={exporter.email}
          />

          <Info
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={exporter.phone}
          />

          <div className="md:col-span-2">
            <Info
              icon={<MapPin className="h-4 w-4" />}
              label="Address"
              value={exporter.address}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>

      <p className="break-words text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}