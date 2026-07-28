import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import {
  Badge,
} from "../../ui/badge";

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
    <div>

      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="font-medium">
        {value || "-"}
      </p>

    </div>
  );
}

export default function ClientInformationCard({
  client,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Client Information
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-10">

        {/* Business */}

        <div>

          <h3 className="mb-4 text-lg font-semibold">

            Business Information

          </h3>

          <div className="grid gap-6 md:grid-cols-3">

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

            <div>

              <p className="text-sm text-muted-foreground">

                Status

              </p>

              <Badge
                variant={
                  client.isActive
                    ? "default"
                    : "destructive"
                }
              >
                {client.isActive
                  ? "Active"
                  : "Inactive"}
              </Badge>

            </div>

          </div>

        </div>

        {/* Contact */}

        <div>

          <h3 className="mb-4 text-lg font-semibold">

            Contact Information

          </h3>

          <div className="grid gap-6 md:grid-cols-2">

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

        </div>

        {/* Address */}

        <div>

          <h3 className="mb-4 text-lg font-semibold">

            Address Information

          </h3>

          <div className="grid gap-6 md:grid-cols-2">

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

        </div>

        {/* Remarks */}

        <div>

          <h3 className="mb-4 text-lg font-semibold">

            Remarks

          </h3>

          <p className="rounded-lg border bg-slate-50 p-4">

            {client.remarks || "No remarks available."}

          </p>

        </div>

      </CardContent>

    </Card>
  );
}