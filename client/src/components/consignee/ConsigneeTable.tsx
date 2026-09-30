import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

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
import type { Consignee } from "../../types/consignee";



interface Props {
  consignees: Consignee[];
  isLoading?: boolean;
  currentPage?: number;
  pageLimit?: number;
}

export default function ConsigneeTable({
  consignees,
  isLoading = false,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white py-20 text-center">
        Loading consignees...
      </div>
    );
  }

  if (!consignees.length) {
    return (
      <div className="rounded-lg border bg-white p-10 text-center">

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
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead className="w-[70px]">
              S/N
            </TableHead>

            <TableHead>
              Name
            </TableHead>

            <TableHead>
              Contact Person
            </TableHead>

            <TableHead>
              Transport Mode
            </TableHead>

            <TableHead>
              Port of Discharge
            </TableHead>

            <TableHead>
              Allocations
            </TableHead>

            <TableHead>
              Shipments
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {consignees.map((consignee, index) => {

            const serialNumber =
              (currentPage - 1) * pageLimit +
              index +
              1;

            return (
              <TableRow key={consignee.id}>

                {/* S/N */}
                <TableCell className="font-medium text-muted-foreground">
                  {serialNumber}
                </TableCell>

                {/* Name */}
                <TableCell className="font-medium">
                  {consignee.name}
                </TableCell>

                {/* Contact Person */}
                <TableCell>
                  {consignee.contactPerson ?? "-"}
                </TableCell>

                {/* Transport Mode */}
                <TableCell>
                  {consignee.transportMode ?? "-"}
                </TableCell>

                {/* Port of Discharge */}
                <TableCell>
                  {consignee.portOfDischarge ?? "-"}
                </TableCell>

                {/* Allocations */}
                <TableCell>
                  {consignee._count?.allocations ?? 0}
                </TableCell>

                {/* Shipments */}
                <TableCell>
                  {consignee._count?.shipments ?? 0}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">

                  <div className="flex justify-end gap-2">

                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                    >
                      <Link
                        to={`/consignees/${consignee.id}`}
                        title="View consignee"
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
                        title="Edit consignee"
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
            );

          })}

        </TableBody>

      </Table>

    </div>
  );
}