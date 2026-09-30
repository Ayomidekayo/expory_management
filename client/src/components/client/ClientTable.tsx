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

import ClientStatusBadge from "./ClientStatusBadge";
import ClientRowActions from "./ClientRowActions";

import type { Client } from "../../types/client.types";

interface Props {
  clients: Client[];
  isLoading?: boolean;
  currentPage?: number;
  pageLimit?: number;
}

export default function ClientTable({
  clients,
  isLoading = false,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-background py-20 text-center">
        Loading clients...
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="rounded-lg border p-10 text-center">
        <h3 className="text-lg font-semibold">
          No Clients Found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Start by creating your first client.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">
              S/N
            </TableHead>

            <TableHead>
              Client Code
            </TableHead>

            <TableHead>
              Company
            </TableHead>

            <TableHead>
              Contact
            </TableHead>

            <TableHead>
              Country
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead>
              Status
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
          {clients.map((client, index) => {
            const serialNumber =
              (currentPage - 1) * pageLimit +
              index +
              1;

            return (
              <TableRow key={client.id}>
                {/* S/N */}
                <TableCell className="font-medium text-muted-foreground">
                  {serialNumber}
                </TableCell>

                {/* Client Code */}
                <TableCell className="font-medium">
                  {client.clientCode}
                </TableCell>

                {/* Company */}
                <TableCell>
                  {client.companyName}
                </TableCell>

                {/* Contact */}
                <TableCell>
                  {client.contactPerson ?? "-"}
                </TableCell>

                {/* Country */}
                <TableCell>
                  {client.country ?? "-"}
                </TableCell>

                {/* Type */}
                <TableCell>
                  {client.clientType}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <ClientStatusBadge
                    active={client.isActive}
                  />
                </TableCell>

                {/* Allocations */}
                <TableCell>
                  {client._count?.allocations ?? 0}
                </TableCell>

                {/* Shipments */}
                <TableCell>
                  {client._count?.shipments ?? 0}
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
                        to={`/clients/${client.id}`}
                        title="View client"
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
                        to={`/clients/${client.id}/edit`}
                        title="Edit client"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>

                    <ClientRowActions
                      client={client}
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