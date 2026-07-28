import { Link } from "react-router-dom";

import { Route, Plus, Truck, Eye, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Button } from "../ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Shipment } from "../../types/shipment";

interface Props {
  shipment: Shipment;
}

export default function TransitCard({ shipment }: Props) {
  const transits = shipment.transits;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Transit Information
        </CardTitle>

        <Button asChild>
          <Link to={`/transits/new?shipmentId=${shipment.id}`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transit
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {transits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mb-4" />

            <h3 className="font-semibold">No Transit Records</h3>

            <p className="text-muted-foreground text-sm mb-6">
              No transit information has been recorded.
            </p>

            <Button asChild>
              <Link to={`/transits/new?shipmentId=${shipment.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Transit
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origin</TableHead>

                  <TableHead>Destination</TableHead>

                  <TableHead>Mode</TableHead>

                  <TableHead>Transporter</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transits.map((transit) => (
                  <TableRow key={transit.id}>
                    <TableCell>{transit.origin}</TableCell>

                    <TableCell>{transit.destination}</TableCell>

                    <TableCell>{transit.transportMode}</TableCell>

                    <TableCell>{transit.transporter || "-"}</TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" asChild>
                          <Link to={`/transits/${transit.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button size="icon" variant="ghost" asChild>
                          <Link to={`/transits/${transit.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 text-sm text-muted-foreground">
              Total Transit Legs:
              <span className="font-semibold ml-2">{transits.length}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
