// import { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { Truck, Pencil, Lock } from "lucide-react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";

// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";

// import type { Transport } from "../../types/transport";

// interface Props {
//   data: Transport[];
//   loading?: boolean;
//   currentPage?: number;
//   pageLimit?: number;
// }

// /**
//  * The API should return createdAt and ownerName on the parent Transport.
//  * The optional fields here keep the table compatible while the shared
//  * frontend Transport type is being updated.
//  */
// type TransportTableRecord = Transport & {
//   ownerName?: string | null;
//   createdAt?: string | Date | null;
// };

// function getRecordTimestamp(transport: TransportTableRecord): number {
//   const source = transport.createdAt ?? transport.transportDate;
//   const date = source instanceof Date ? source : new Date(source);
//   const timestamp = date.getTime();
//   return Number.isFinite(timestamp) ? timestamp : 0;
// }

// function formatCharges(transport: Transport) {
//   const items = transport.items ?? [];

//   const totals = items.reduce<Record<string, number>>((acc, item) => {
//     const currency = item.chargeCurrency;
//     acc[currency] = (acc[currency] ?? 0) + Number(item.chargeAmount ?? 0);
//     return acc;
//   }, {});

//   const entries = Object.entries(totals);
//   if (!entries.length) return "-";

//   return entries
//     .map(([currency, amount]) => `${currency} ${amount.toLocaleString()}`)
//     .join(" · ");
// }

// function formatDate(value: string | Date) {
//   const date = value instanceof Date ? value : new Date(value);
//   if (Number.isNaN(date.getTime())) return "-";

//   return date.toLocaleDateString(undefined, {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// export default function TransportTable({
//   data,
//   loading = false,
//   currentPage = 1,
//   pageLimit = 10,
// }: Props) {
//   const navigate = useNavigate();

//   // Oldest records first, newest records last.
//   // The backend must use createdAt: "asc" as well for consistent
//   // chronological ordering across multiple pagination pages.
//   const sortedData = useMemo(() => {
//     return [...(data as TransportTableRecord[])].sort((a, b) => {
//       const timestampDifference =
//         getRecordTimestamp(a) - getRecordTimestamp(b);

//       if (timestampDifference !== 0) return timestampDifference;

//       // Deterministic fallback when records share the same timestamp.
//       return a.transportNumber.localeCompare(b.transportNumber, undefined, {
//         numeric: true,
//         sensitivity: "base",
//       });
//     });
//   }, [data]);

//   if (loading) {
//     return (
//       <div className="rounded-xl border bg-white p-16 text-center">
//         Loading transport records...
//       </div>
//     );
//   }

//   if (sortedData.length === 0) {
//     return (
//       <div className="rounded-xl border bg-white p-16">
//         <div className="flex flex-col items-center gap-4">
//           <Truck className="h-16 w-16 text-muted-foreground" />
//           <div className="text-center">
//             <h3 className="text-lg font-semibold">No Transport Records Found</h3>
//             <p className="text-muted-foreground">
//               Create your first transport record.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[70px]">S/N</TableHead>
//               <TableHead>Transport No.</TableHead>
//               <TableHead>Owner Name</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Shipment</TableHead>
//               <TableHead>Items</TableHead>
//               <TableHead>Total Charges</TableHead>
//               <TableHead>Record Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {sortedData.map((transport, index) => {
//               const serialNumber =
//                 (currentPage - 1) * pageLimit + index + 1;

//               const itemCount =
//                 transport._count?.items ?? transport.items?.length ?? 0;

//               const openDetails = () =>
//                 navigate(`/transports/${transport.id}`);

//               return (
//                 <TableRow
//                   key={transport.id}
//                   role="button"
//                   tabIndex={0}
//                   onClick={openDetails}
//                   onKeyDown={(event) => {
//                     if (event.key === "Enter" || event.key === " ") {
//                       event.preventDefault();
//                       openDetails();
//                     }
//                   }}
//                   className="cursor-pointer transition-colors hover:bg-slate-50/70"
//                 >
//                   <TableCell className="font-medium text-muted-foreground">
//                     {serialNumber}
//                   </TableCell>

//                   <TableCell className="font-semibold">
//                     {transport.transportNumber}
//                   </TableCell>

//                   <TableCell>
//                     <span className="font-medium text-slate-700">
//                       {transport.ownerName?.trim() || "-"}
//                     </span>
//                   </TableCell>

//                   <TableCell>{formatDate(transport.transportDate)}</TableCell>

//                   <TableCell>
//                     {transport.shipment?.shipmentNumber ? (
//                       <div>
//                         <p className="font-medium">
//                           {transport.shipment.shipmentNumber}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {transport.shipment.client?.companyName ?? "Shipment"}
//                         </p>
//                       </div>
//                     ) : (
//                       <Badge variant="outline">Independent</Badge>
//                     )}
//                   </TableCell>

//                   <TableCell>
//                     <Badge variant="outline">
//                       {itemCount} {itemCount === 1 ? "Item" : "Items"}
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="font-medium">
//                     {formatCharges(transport)}
//                   </TableCell>

//                   <TableCell>
//                     {transport.isLocked ? (
//                       <Badge variant="destructive">
//                         <Lock className="mr-1 h-3 w-3" />
//                         Locked
//                       </Badge>
//                     ) : (
//                       <Badge variant="outline">Active</Badge>
//                     )}
//                   </TableCell>

//                   <TableCell
//                     className="text-right"
//                     onClick={(event) => event.stopPropagation()}
//                     onKeyDown={(event) => event.stopPropagation()}
//                   >
//                     <div className="flex justify-end">
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         aria-label={`Edit ${transport.transportNumber}`}
//                         title="Edit transport"
//                         onClick={(event) => {
//                           event.stopPropagation();
//                           navigate(`/transports/${transport.id}/edit`);
//                         }}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import { Truck, Pencil, Lock } from "lucide-react";

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
import { formatDateOnly } from "../../utils/date";

interface Props {
  data: Transport[];
  loading?: boolean;
  currentPage?: number;
  pageLimit?: number;
}

type TransportTableRecord = Transport & {
  ownerName?: string | null;
  createdAt?: string | Date | null;
};

function formatCharges(transport: Transport) {
  const totals = (transport.items ?? []).reduce<Record<string, number>>(
    (acc, item) => {
      const currency = item.chargeCurrency;
      acc[currency] = (acc[currency] ?? 0) + Number(item.chargeAmount ?? 0);
      return acc;
    },
    {},
  );

  const entries = Object.entries(totals);
  if (!entries.length) return "-";

  return entries
    .map(([currency, amount]) => `${currency} ${amount.toLocaleString()}`)
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
            <h3 className="text-lg font-semibold">No Transport Records Found</h3>
            <p className="text-muted-foreground">Create your first transport record.</p>
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
              <TableHead className="w-[70px]">S/N</TableHead>
              <TableHead>Transport No.</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Shipment</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Charges</TableHead>
              <TableHead>Record Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((transport, index) => {
              const record = transport as TransportTableRecord;
              const serialNumber = (currentPage - 1) * pageLimit + index + 1;
              const itemCount = transport._count?.items ?? transport.items?.length ?? 0;

              return (
                <TableRow
                  key={transport.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/transports/${transport.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
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
                  <TableCell className="font-medium">
                    {record.ownerName?.trim() || "-"}
                  </TableCell>
                  <TableCell>{formatDateOnly(transport.transportDate)}</TableCell>
                  <TableCell>
                    {transport.shipment?.shipmentNumber ? (
                      <div>
                        <p className="font-medium">{transport.shipment.shipmentNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {transport.shipment.client?.companyName ?? "Shipment"}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline">Independent</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatCharges(transport)}</TableCell>
                  <TableCell>
                    {transport.isLocked ? (
                      <Badge variant="destructive">
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
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
                        onClick={() => navigate(`/transports/${transport.id}/edit`)}
                        title="Edit transport"
                        aria-label={`Edit transport ${transport.transportNumber}`}
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
