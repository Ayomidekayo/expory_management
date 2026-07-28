import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

import { useExporters } from "../../hooks/exporter/useExporters";

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


export default function ExporterTable() {
  const {
    data,
    isLoading,
  } = useExporters();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        Loading exporters...
      </div>
    );
  }

  const exporters = data?.data ?? [];

  if (!exporters.length) {
    return (
      <div className="rounded-lg border p-10 text-center">
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
    <div className="rounded-xl border bg-white shadow-sm">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>Name</TableHead>

            <TableHead>Contact Person</TableHead>

            <TableHead>Email</TableHead>

            <TableHead>Phone</TableHead>

            <TableHead>Allocations</TableHead>

            <TableHead>Shipments</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {exporters.map((exporter) => (

            <TableRow key={exporter.id}>

              <TableCell className="font-medium">
                {exporter.name}
              </TableCell>

              <TableCell>
                {exporter.contactPerson ?? "-"}
              </TableCell>

              <TableCell>
                {exporter.email ?? "-"}
              </TableCell>

              <TableCell>
                {exporter.phone ?? "-"}
              </TableCell>

              <TableCell>
                {exporter._count.allocations}
              </TableCell>

              <TableCell>
                {exporter._count.shipments}
              </TableCell>

              <TableCell className="text-right">

                <div className="flex justify-end gap-2">

                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      to={`/exporters/${exporter.id}`}
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
                      to={`/exporters/${exporter.id}/edit`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>

                  <ExporterRowActions
                    exporter={exporter}
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