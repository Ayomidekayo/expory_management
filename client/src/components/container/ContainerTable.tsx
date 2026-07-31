import {
  Eye,
  Pencil,
  Trash2,
  Printer,
  Package,
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
import type { Container } from "../../types/container.type";
import { useState } from "react";
import DeleteContainerDialog from "./DeleteContainerDialog";


interface Props {
  data: Container[];
  loading?: boolean;
}

export default function ContainerTable({
  data,
  loading = false,
}: Props) {

  const [deleteOpen, setDeleteOpen] = useState(false);

const [selectedId, setSelectedId] = useState<string>();
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">
        Loading containers...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <div className="rounded-xl border bg-white p-16">
          <div className="flex flex-col items-center gap-4">
            <Package className="h-16 w-16 text-muted-foreground" />

            <div>
              <h3 className="text-lg font-semibold">No Containers Found</h3>
              <p className="text-muted-foreground">Create your first container.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Container</TableHead>
              <TableHead>Shipment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gross Weight</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-semibold">
                  {container.containerNumber}
                </TableCell>

                <TableCell>{container.shipment.shipmentNumber}</TableCell>
                <TableCell>{container.containerType}</TableCell>
                <TableCell>{container.containerSize}</TableCell>

                <TableCell>
                  <Badge>{container.status}</Badge>
                </TableCell>

                <TableCell>
                  {Number(container.grossWeight ?? 0).toLocaleString()} KG
                </TableCell>

                <TableCell>{container.destination ?? "-"}</TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link to={`/containers/${container.id}`}>
                      <Button size="icon" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link to={`/containers/${container.id}/edit`}>
                      <Button size="icon" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button size="icon" variant="outline">
                      <Printer className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setSelectedId(container.id);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteContainerDialog
        id={selectedId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}