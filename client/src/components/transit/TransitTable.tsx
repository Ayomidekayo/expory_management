import { Eye, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import DeleteTransitDialog from "./DeleteTransitDialog";
import { Link } from "react-router-dom";
import type { Transit } from "../../types/transit.type";

interface Props {
  data: Transit[];
  loading?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function TransitTable({
  data,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">
        Loading transits...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">
        No transit records found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Origin</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Transporter</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((transit) => (
          <TableRow key={transit.id}>
            <TableCell>{transit.origin}</TableCell>
            <TableCell>{transit.destination}</TableCell>
            <TableCell>{transit.transportMode}</TableCell>
            <TableCell>{transit.transporter || "-"}</TableCell>
            <TableCell>
              {transit.quantity
                ? Number(transit.quantity).toLocaleString()
                : "-"}
            </TableCell>
            <TableCell>
              {transit.totalPrice
                ? Number(transit.totalPrice).toLocaleString()
                : "-"}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Link to={`/transits/${transit.id}`}>
                  <Button size="icon" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to={`/transits/${transit.id}/edit`}>
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>

                <DeleteTransitDialog id={transit.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
