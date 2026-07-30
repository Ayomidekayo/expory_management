import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  Package,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipments: Shipment[];
}

function statusVariant(status: Shipment["status"]) {
  switch (status) {
    case "COMPLETED":
      return "default";

    case "IN_TRANSIT":
      return "secondary";

    case "CANCELLED":
      return "destructive";

    default:
      return "secondary";
  }
}

export default function ClientShipmentTable({
  shipments,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>

          Shipment History

        </CardTitle>

      </CardHeader>

      <CardContent>

        {shipments.length === 0 ? (

          <div className="py-10 text-center text-muted-foreground">

            No shipments available.

          </div>

        ) : (

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Shipment No
                </TableHead>

                <TableHead>
                  Date
                </TableHead>

                <TableHead>
                  Transport
                </TableHead>

                <TableHead>
                  Shipping Line
                </TableHead>

                <TableHead>
                  Exporter
                </TableHead>

                <TableHead>
                  Consignee
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Invoice
                </TableHead>

                <TableHead>
                  Packing List
                </TableHead>

                <TableHead className="text-right">
                  Action
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {shipments.map((shipment) => (

                <TableRow key={shipment.id}>

                  <TableCell className="font-medium">

                    {shipment.shipmentNumber}

                  </TableCell>

                  <TableCell>

                    {new Date(
                      shipment.shipmentDate
                    ).toLocaleDateString()}

                  </TableCell>

                  <TableCell>

                    {shipment.transportMode}

                  </TableCell>

                  <TableCell>

                    {shipment.shippingLine || "-"}

                  </TableCell>

                  <TableCell>

                    {shipment.exporter?.name ?? "-"}

                  </TableCell>

                  <TableCell>

                    {shipment.consignee?.name ?? "-"}

                  </TableCell>

                  <TableCell>

                    <Badge
                      variant={statusVariant(
                        shipment.status
                      )}
                    >
                      {shipment.status}
                    </Badge>

                  </TableCell>

                  <TableCell>

                    {shipment.invoice ? (

                      <Badge className="gap-1">

                        <FileText className="h-3 w-3" />

                        Available

                      </Badge>

                    ) : (

                      <Badge variant="outline">

                        Pending

                      </Badge>

                    )}

                  </TableCell>

                  <TableCell>

                    {shipment.packingList ? (

                      <Badge className="gap-1">

                        <Package className="h-3 w-3" />

                        Available

                      </Badge>

                    ) : (

                      <Badge variant="outline">

                        Pending

                      </Badge>

                    )}

                  </TableCell>

                  <TableCell className="text-right">

                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                    >

                      <Link
                        to={`/shipments/${shipment.id}`}
                      >

                        <Eye className="h-4 w-4" />

                      </Link>

                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        )}

      </CardContent>

    </Card>
  );
}