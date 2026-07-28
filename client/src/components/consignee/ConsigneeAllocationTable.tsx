import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  allocations: any[];
}

export default function ConsigneeAllocationTable({
  allocations,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Allocations
      </h2>

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>
              Allocation No.
            </TableHead>

            <TableHead>
              Client
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Service
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {allocations.length === 0 ? (
            <TableRow>

              <TableCell
                colSpan={4}
                className="text-center"
              >
                No allocations found.
              </TableCell>

            </TableRow>
          ) : (
            allocations.map((allocation) => (
              <TableRow key={allocation.id}>

                <TableCell>
                  {allocation.allocationNumber}
                </TableCell>

                <TableCell>
                  {allocation.client?.companyName ?? "-"}
                </TableCell>

                <TableCell>
                  {allocation.status}
                </TableCell>

                <TableCell>
                  {allocation.serviceType}
                </TableCell>

              </TableRow>
            ))
          )}

        </TableBody>

      </Table>

    </div>
  );
}