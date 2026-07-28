import {
  Loader2,
  PackageOpen,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Badge } from "../ui/badge";
import { useShipments } from "../../hooks/shipments/useShipments";
import ShipmentRowActions from "./ShipmentRowActions";

export default function ShipmentTable() {
  const {
    data,
    isLoading,
  } = useShipments();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="flex flex-col items-center rounded-xl border py-16">

        <PackageOpen className="mb-4 h-14 w-14 text-slate-400" />

        <h3 className="text-lg font-semibold">
          No Shipments Found
        </h3>

        <p className="text-sm text-slate-500">
          Create your first shipment.
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">

      <div className="overflow-x-auto">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Shipment No.
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead>
                Client
              </TableHead>

              <TableHead>
                Exporter
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                XF Number
              </TableHead>

              <TableHead className="hidden lg:table-cell">
                NXP Number
              </TableHead>

              <TableHead className="hidden xl:table-cell">
                CCI Number
              </TableHead>

              <TableHead>
                Transport
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {data.data.map(
              (shipment) => (
                <TableRow
                  key={shipment.id}
                >

                  <TableCell className="font-semibold">

                    {shipment.shipmentNumber}

                  </TableCell>

                  <TableCell>

                    {new Date(
                      shipment.shipmentDate
                    ).toLocaleDateString()}

                  </TableCell>

                  <TableCell>

                    {
                      shipment.client
                        .companyName
                    }

                  </TableCell>

                  <TableCell>

                    {
                      shipment.exporter
                        .name
                    }

                  </TableCell>

                  <TableCell className="hidden lg:table-cell">

                    {shipment.xfNumber ?? "-"}

                  </TableCell>

                  <TableCell className="hidden lg:table-cell">

                    {shipment.nxpNumber ?? "-"}

                  </TableCell>

                  <TableCell className="hidden xl:table-cell">

                    {shipment.cciNumber ?? "-"}

                  </TableCell>

                  <TableCell>

                    <Badge
                      variant="outline"
                    >
                      {
                        shipment.transportMode
                      }
                    </Badge>

                  </TableCell>

                  <TableCell>

                    <Badge
                      variant="secondary"
                    >
                      {shipment.status.replaceAll(
                        "_",
                        " "
                      )}
                    </Badge>

                  </TableCell>

                  <TableCell className="text-right">

                    <ShipmentRowActions
                      shipment={shipment}
                    />

                  </TableCell>

                </TableRow>
              )
            )}

          </TableBody>

        </Table>

      </div>

    </div>
  );
}