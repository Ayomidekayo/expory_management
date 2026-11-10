
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Package,
  Pencil,
  Lock,
} from "lucide-react";

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

import type { Transport } from "../../types/transport";

interface Props {
  data: Transport[];
  loading?: boolean;
  currentPage?: number;
  pageLimit?: number;
}

function formatCharges(transport: Transport) {
  const items = transport.items ?? [];

  const totals = items.reduce<Record<string, number>>(
    (acc, item) => {
      const currency = item.chargeCurrency;
      acc[currency] =
        (acc[currency] ?? 0) +
        Number(item.chargeAmount ?? 0);

      return acc;
    },
    {}
  );

  const entries = Object.entries(totals);

  if (!entries.length) return "-";

  return entries
    .map(([currency, amount]) =>
      `${currency} ${amount.toLocaleString()}`
    )
    .join(" · ");
}

export default function TransportTable({
  data,
  loading = false,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">
        Loading transport records...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16">
        <div className="flex flex-col items-center gap-4">
          <Truck className="h-16 w-16 text-muted-foreground" />

          <div className="text-center">
            <h3 className="text-lg font-semibold">
              No Transport Records Found
            </h3>

            <p className="text-muted-foreground">
              Create your first transport record.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">
                S/N
              </TableHead>

              <TableHead>
                Transport No.
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead>
                Shipment
              </TableHead>

              <TableHead>
                Items
              </TableHead>

              <TableHead>
                Total Charges
              </TableHead>

              <TableHead>
                Record Status
              </TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((transport, index) => {
              const serialNumber =
                (currentPage - 1) * pageLimit +
                index +
                1;

              const itemCount =
                transport._count?.items ??
                transport.items?.length ??
                0;

              return (
                <TableRow
                  key={transport.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate(`/transports/${transport.id}`)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      navigate(`/transports/${transport.id}`);
                    }
                  }}
                  className="cursor-pointer transition-colors hover:bg-slate-50/70"
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {serialNumber}
                  </TableCell>

                  <TableCell className="font-semibold">
                    {transport.transportNumber}
                  </TableCell>

                  <TableCell>
                    {new Date(
                      transport.transportDate
                    ).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {transport.shipment?.shipmentNumber ? (
                      <div>
                        <p className="font-medium">
                          {transport.shipment.shipmentNumber}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {transport.shipment.client?.companyName ?? "Shipment"}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline">
                        Independent
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium">
                    {formatCharges(transport)}
                  </TableCell>

                  <TableCell>
                    {transport.isLocked ? (
                      <Badge variant="destructive">
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Active
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell
                    className="text-right"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/transports/${transport.id}/edit`
                          )
                        }
                        title="Edit transport"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
