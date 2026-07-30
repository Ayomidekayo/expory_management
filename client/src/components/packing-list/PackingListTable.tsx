import {
  Eye,
  Pencil,
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

import {
  Button,
} from "../ui/button";

import {
  Badge,
} from "../ui/badge";
import type { PackingList } from "../../types/packing-list";



interface Props {
  data: PackingList[];
  loading?: boolean;
}

export default function PackingListTable({
  data,
  loading = false,
}: Props) {


    console.log("TABLE DATA");
  console.log(data);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">

        Loading packing lists...

      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16">

        <div className="flex flex-col items-center gap-4">

          <Package className="h-16 w-16 text-muted-foreground" />

          <div>

            <h3 className="text-lg font-semibold">
              No Packing Lists Found
            </h3>

            <p className="text-muted-foreground">
              Create your first packing list.
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="rounded-xl border bg-white">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>
              Packing No.
            </TableHead>

            <TableHead>
              Shipment
            </TableHead>

            <TableHead>
              Client
            </TableHead>

            <TableHead>
              Packages
            </TableHead>

            <TableHead>
              Gross Weight
            </TableHead>

            <TableHead>
              Net Weight
            </TableHead>

            <TableHead>
              Date
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {data.map((packing) => (

            <TableRow key={packing.id}>

              <TableCell className="font-semibold">

                {packing.packingListNumber}

              </TableCell>

              <TableCell>

                {packing.shipment.shipmentNumber}

              </TableCell>

              <TableCell>

                {packing.shipment.client?.companyName}

              </TableCell>

              <TableCell>

                <Badge variant="outline">

                  {packing.totalPackages ?? 0}

                </Badge>

              </TableCell>

              <TableCell>

                {Number(
                  packing.grossWeight
                ).toLocaleString()} KG

              </TableCell>

              <TableCell>

                {Number(
                  packing.netWeight
                ).toLocaleString()} KG

              </TableCell>

              <TableCell>

                {new Date(
                  packing.packingDate
                ).toLocaleDateString()}

              </TableCell>

              <TableCell>

                <div className="flex justify-end gap-2">

                  <Link
                    to={`/packing-lists/${packing.id}`}
                  >

                    <Button
                      size="icon"
                      variant="outline"
                    >

                      <Eye className="h-4 w-4" />

                    </Button>

                  </Link>

                  <Link
                    to={`/packing-lists/${packing.id}/edit`}
                  >

                    <Button
                      size="icon"
                      variant="outline"
                    >

                      <Pencil className="h-4 w-4" />

                    </Button>

                  </Link>


                </div>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </div>

  );
}