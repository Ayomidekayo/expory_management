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
import ExporterRowActions from "./ExporterRowActions";
import type { Exporter } from "../../types/exporter.types";


interface Props {
  exporters: Exporter[];
  isLoading?: boolean;
  currentPage?: number;
  pageLimit?: number;
}

export default function ExporterTable({
  exporters,
  isLoading = false,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white py-20 text-center">
        Loading exporters...
      </div>
    );
  }

  if (!exporters.length) {
    return (
      <div className="rounded-lg border bg-white p-10 text-center">
        <h3 className="text-lg font-semibold">
          No Exporters Found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Start by creating your first exporter.
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
              Email
            </TableHead>

            <TableHead>
              Phone
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
          {exporters.map((exporter, index) => {
            const serialNumber =
              (currentPage - 1) * pageLimit +
              index +
              1;

            return (
              <TableRow key={exporter.id}>
                {/* S/N */}
                <TableCell className="font-medium text-muted-foreground">
                  {serialNumber}
                </TableCell>

                {/* Name */}
                <TableCell className="font-medium">
                  {exporter.name}
                </TableCell>

                {/* Contact Person */}
                <TableCell>
                  {exporter.contactPerson ?? "-"}
                </TableCell>

                {/* Email */}
                <TableCell>
                  {exporter.email ?? "-"}
                </TableCell>

                {/* Phone */}
                <TableCell>
                  {exporter.phone ?? "-"}
                </TableCell>

                {/* Allocations */}
                <TableCell>
                  {exporter._count.allocations}
                </TableCell>

                {/* Shipments */}
                <TableCell>
                  {exporter._count.shipments}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* View */}
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                    >
                      <Link
                        to={`/exporters/${exporter.id}`}
                        title="View exporter"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    {/* Edit */}
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                    >
                      <Link
                        to={`/exporters/${exporter.id}/edit`}
                        title="Edit exporter"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>

                    {/* More actions */}
                    <ExporterRowActions
                      exporter={exporter}
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