import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

import { useConsignees } from "../../hooks/consignee/useConsignees";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";
import ConsigneeRowActions from "./ConsigneeRowActions";



export default function ConsigneeTable() {
  const {
    data,
    isLoading,
  } = useConsignees();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        Loading consignees...
      </div>
    );
  }

  const consignees = data?.data ?? [];

  if (!consignees.length) {
    return (
      <div className="rounded-lg border p-10 text-center">

        <h3 className="text-lg font-semibold">
          No Consignees Found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Start by creating your first consignee.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>Name</TableHead>

            <TableHead>Contact Person</TableHead>

            <TableHead>Transport Mode</TableHead>

            <TableHead>Port of Discharge</TableHead>

            <TableHead>Allocations</TableHead>

            <TableHead>Shipments</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {consignees.map((consignee) => (

            <TableRow key={consignee.id}>

              <TableCell className="font-medium">
                {consignee.name}
              </TableCell>

              <TableCell>
                {consignee.contactPerson ?? "-"}
              </TableCell>

              <TableCell>
                {consignee.transportMode}
              </TableCell>

              <TableCell>
                {consignee.portOfDischarge}
              </TableCell>

              <TableCell>
                {consignee._count.allocations}
              </TableCell>

              <TableCell>
                {consignee._count.shipments}
              </TableCell>

              <TableCell className="text-right">

                <div className="flex justify-end gap-2">

                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      to={`/consignees/${consignee.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      to={`/consignees/${consignee.id}/edit`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  <ConsigneeRowActions
                    consignee={consignee}
                  />

                </div>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>
  );
}