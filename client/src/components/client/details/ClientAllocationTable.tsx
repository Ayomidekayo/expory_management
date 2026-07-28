import { Link } from "react-router-dom";
import { Eye, Plus } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocations: Allocation[];
}

const statusVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default";

    case "PENDING":
      return "secondary";

    case "REJECTED":
      return "destructive";

    case "COMPLETED":
      return "default";

    default:
      return "outline";
  }
};

export default function ClientAllocationTable({
  allocations,
}: Props) {
  return (
    <Card>
      <CardHeader>

        <CardTitle>
          Allocation History
        </CardTitle>

      </CardHeader>

      <CardContent>

        {allocations.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No allocations found.
          </div>
        ) : (
          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Allocation No
                </TableHead>

                <TableHead>
                  Service
                </TableHead>

                <TableHead>
                  Priority
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

                <TableHead>
                  Destination
                </TableHead>

                <TableHead>
                  Shipment
                </TableHead>

                <TableHead className="text-right">
                  Action
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {allocations.map((allocation) => (
                <TableRow key={allocation.id}>

                  <TableCell className="font-medium">
                    {allocation.allocationNumber}
                  </TableCell>

                  <TableCell>
                    {allocation.serviceType}
                  </TableCell>

                  <TableCell>
                    {allocation.priority}
                  </TableCell>

                  <TableCell>

                    <Badge
                      variant={statusVariant(allocation.status)}
                    >
                      {allocation.status}
                    </Badge>

                  </TableCell>

                  <TableCell>
                    {allocation.destinationCountry}
                  </TableCell>

                  <TableCell>

                    {allocation.shipment ? (
                      <Badge>
                        Generated
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    )}

                  </TableCell>

                  <TableCell className="text-right">

                    {allocation.shipment ? (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                      >
                        <Link
                          to={`/shipments/${allocation.shipment.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                      >
                        <Link
                          to={`/shipments/create?allocationId=${allocation.id}`}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Generate
                        </Link>
                      </Button>
                    )}

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