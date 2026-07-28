import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";


interface Props {
  shipments: any[];
}

export default function ExporterShipmentTable({
  shipments,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Shipments
      </h2>

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>
              Shipment No.
            </TableHead>

            <TableHead>
              Date
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Transport
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {shipments.length === 0 ? (
            <TableRow>

              <TableCell
                colSpan={4}
                className="text-center"
              >
                No shipments found.
              </TableCell>

            </TableRow>
          ) : (
            shipments.map((shipment) => (
              <TableRow key={shipment.id}>

                <TableCell>
                  {shipment.shipmentNumber}
                </TableCell>

                <TableCell>
                  {new Date(
                    shipment.shipmentDate
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {shipment.status}
                </TableCell>

                <TableCell>
                  {shipment.transportMode}
                </TableCell>

              </TableRow>
            ))
          )}

        </TableBody>

      </Table>

    </div>
  );
}