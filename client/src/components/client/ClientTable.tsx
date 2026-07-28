import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

import { useClients } from "../../hooks/client/useClients";

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

export default function ClientTable() {
  const {
    data,
    isLoading,
  } = useClients();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        Loading clients...
      </div>
    );
  }

  const clients = data?.data ?? [];

  if (!clients.length) {
    return (
      <div className="rounded-lg border p-10 text-center">

        <h3 className="text-lg font-semibold">
          No Clients Found
        </h3>

        <p className="text-muted-foreground mt-2">
          Start by creating your first client.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background">

      <Table>

        <TableHeader>

          <TableRow>

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

          {clients.map((client) => (

            <TableRow key={client.id}>

              <TableCell className="font-medium">
                {client.clientCode}
              </TableCell>

              <TableCell>
                {client.companyName}
              </TableCell>

              <TableCell>
                {client.contactPerson ?? "-"}
              </TableCell>

              <TableCell>
                {client.country ?? "-"}
              </TableCell>

              <TableCell>
                {client.clientType}
              </TableCell>

              <TableCell>

                <ClientStatusBadge
                  active={client.isActive}
                />

              </TableCell>

              <TableCell>
                {client._count.allocations}
              </TableCell>

              <TableCell>
                {client._count.shipments}
              </TableCell>

              <TableCell className="text-right">

                <div className="flex justify-end gap-2">

                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      to={`/clients/${client.id}`}
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

          ))}

        </TableBody>

      </Table>

    </div>
  );
}