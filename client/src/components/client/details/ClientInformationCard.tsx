import {
  Building2,
  Contact,
  MapPin,
  Globe,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import { Badge } from "../../ui/badge";

import type { Client } from "../../../types/client.types";

interface Props {
  client: Client;
}

function Item({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        {title}
      </h3>
    </div>
  );
}

export default function ClientInformationCard({
  client,
}: Props) {
  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <CardHeader className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Client Information
            </CardTitle>

            <p className="mt-0.5 text-sm text-slate-500">
              Business, contact and address details.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {/* =====================================
            BUSINESS INFORMATION
        ===================================== */}

        <section>
          <SectionHeader
            icon={
              <Building2 className="h-4 w-4" />
            }
            title="Business Information"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Item
              label="Company Name"
              value={client.companyName}
            />

            <Item
              label="Client Code"
              value={client.clientCode}
            />

            <Item
              label="Client Type"
              value={client.clientType}
            />

            <Item
              label="Website"
              value={client.website}
            />

            <Item
              label="Tax Number"
              value={client.taxNumber}
            />

            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>

              <Badge
                variant={
                  client.isActive
                    ? "default"
                    : "destructive"
                }
                className="mt-1"
              >
                {client.isActive
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* =====================================
            CONTACT INFORMATION
        ===================================== */}

        <section>
          <SectionHeader
            icon={
              <Contact className="h-4 w-4" />
            }
            title="Contact Information"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Item
              label="Contact Person"
              value={client.contactPerson}
            />

            <Item
              label="Email"
              value={client.email}
            />

            <Item
              label="Phone"
              value={client.phone}
            />

            <Item
              label="Alternate Phone"
              value={client.alternatePhone}
            />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* =====================================
            ADDRESS INFORMATION
        ===================================== */}

        <section>
          <SectionHeader
            icon={
              <MapPin className="h-4 w-4" />
            }
            title="Address Information"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Item
              label="Address"
              value={client.address}
            />

            <Item
              label="City"
              value={client.city}
            />

            <Item
              label="State"
              value={client.state}
            />

            <Item
              label="Country"
              value={client.country}
            />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* =====================================
            REMARKS
        ===================================== */}

        <section>
          <SectionHeader
            icon={
              <FileText className="h-4 w-4" />
            }
            title="Remarks"
          />

          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
              {client.remarks ||
                "No remarks available."}
            </p>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}