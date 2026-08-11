import {
  Eye,
  Pencil,
  Trash2,
  Printer,
  Package,
  MoreHorizontal,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import type { Container } from "../../types/container.type";

import { useState } from "react";

import DeleteContainerDialog from "./DeleteContainerDialog";
import TerminalChargeDialog from "./TerminalChargeDialog";

interface Props {
  data: Container[];
  loading?: boolean;
}

export default function ContainerTable({
  data,
  loading = false,
}: Props) {
  /*
   * Delete dialog
   */
  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState<string>();

  /*
   * Terminal charge dialog
   */
  const [
    terminalChargeOpen,
    setTerminalChargeOpen,
  ] = useState(false);

  const [
    selectedContainer,
    setSelectedContainer,
  ] = useState<Container | null>(
    null
  );

  /*
   * Open terminal charge dialog
   */
  const openTerminalChargeDialog = (
    container: Container
  ) => {
    setSelectedContainer(container);
    setTerminalChargeOpen(true);
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">
        Loading containers...
      </div>
    );
  }

  /*
   * Empty state
   */
  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16">
        <div className="flex flex-col items-center gap-4">

          <Package className="h-16 w-16 text-muted-foreground" />

          <div className="text-center">

            <h3 className="text-lg font-semibold">
              No Containers Found
            </h3>

            <p className="text-muted-foreground">
              Create your first container.
            </p>

          </div>

        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-white">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Container
              </TableHead>

              <TableHead>
                Shipment
              </TableHead>

              <TableHead>
                Type
              </TableHead>

              <TableHead>
                Size
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Terminal Charge
              </TableHead>

              <TableHead>
                Gross Weight
              </TableHead>

              <TableHead>
                Destination
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {data.map((container) => (

              <TableRow
                key={container.id}
              >

                {/* Container */}

                <TableCell className="font-semibold">
                  {container.containerNumber}
                </TableCell>

                {/* Shipment */}

                <TableCell>
                  {container.shipment
                    ?.shipmentNumber ?? "-"}
                </TableCell>

                {/* Type */}

                <TableCell>
                  {container.containerType}
                </TableCell>

                {/* Size */}

                <TableCell>
                  {container.containerSize}
                </TableCell>

                {/* Container Status */}

                <TableCell>

                  <Badge
                    className={
                      container.status ===
                      "EMPTY"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-100"
                        : container.status ===
                          "LOADED"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        : container.status ===
                          "IN_TRANSIT"
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                    }
                  >
                    {container.status}
                  </Badge>

                </TableCell>

                {/* Terminal Charge */}

                <TableCell>

                  <button
                    type="button"
                    onClick={() =>
                      openTerminalChargeDialog(
                        container
                      )
                    }
                    className="text-left"
                  >

                    <div className="flex flex-col gap-1">

                      <Badge
                        className={
                          container.terminalChargeStatus ===
                          "PAID"
                            ? "w-fit bg-green-100 text-green-700 hover:bg-green-100"
                            : "w-fit bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {container.terminalChargeStatus}
                      </Badge>

                      {container.terminalChargeStatus ===
                        "PAID" &&
                        container.terminalChargeAmount !=
                          null && (
                          <span className="text-xs font-medium text-slate-600">
                            ₦
                            {Number(
                              container.terminalChargeAmount
                            ).toLocaleString()}
                          </span>
                        )}

                    </div>

                  </button>

                </TableCell>

                {/* Gross Weight */}

                <TableCell>

                  {Number(
                    container.grossWeight ?? 0
                  ).toLocaleString()}{" "}
                  KG

                </TableCell>

                {/* Destination */}

                <TableCell>
                  {container.destination ??
                    "-"}
                </TableCell>

                {/* Actions */}

                <TableCell>

                  <div className="flex justify-end gap-2">

                    {/* View */}

                    <Link
                      to={`/containers/${container.id}`}
                    >
                      <Button
                        size="icon"
                        variant="outline"
                        title="View container"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Edit */}

                    <Link
                      to={`/containers/${container.id}/edit`}
                    >
                      <Button
                        size="icon"
                        variant="outline"
                        title="Edit container"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>

                    {/* More Actions */}

                    <DropdownMenu>

                      <DropdownMenuTrigger
                        asChild
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          title="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-44"
                      >

                        {/* Print */}

                        <DropdownMenuItem
                          onClick={() => {
                            window.print();
                          }}
                        >
                          <Printer className="mr-2 h-4 w-4" />

                          Print
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Delete */}

                        <DropdownMenuItem
                          className="text-red-600 focus:bg-red-50 focus:text-red-600"
                          onClick={() => {
                            setSelectedId(
                              container.id
                            );

                            setDeleteOpen(
                              true
                            );
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />

                          Delete
                        </DropdownMenuItem>

                      </DropdownMenuContent>

                    </DropdownMenu>

                  </div>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

      {/* Delete Dialog */}

      <DeleteContainerDialog
        id={selectedId}
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
      />

      {/* Terminal Charge Dialog */}

      <TerminalChargeDialog
        container={
          selectedContainer
        }
        open={
          terminalChargeOpen
        }
        onOpenChange={
          setTerminalChargeOpen
        }
      />

    </>
  );
}