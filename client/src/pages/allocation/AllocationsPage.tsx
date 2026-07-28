import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import AllocationStats from "../../components/allocation/AllocationStats";

import AllocationDialog from "../../components/allocation/AllocationDialog";

import { allocationColumns } from "../../components/allocation/allocation.columns";

import { useAllocations } from "../../hooks/allocation/useAllocations";

import { useGenerateShipment } from "../../hooks/allocation/useGenerateShipment";

import type { Allocation } from "../../types/allocation.types";
import AllocationDetailsDialog from "../../components/allocation/AllocationDetailsDialog";
import AssignOfficerDialog from "./AssignOfficerDialog";
import ApproveAllocationDialog from "./ApproveAllocationDialog";
import DeleteAllocationDialog from "./DeleteAllocationDialog";

export default function AllocationPage() {

  const [globalFilter, setGlobalFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [assignOpen, setAssignOpen] =
    useState(false);

  const [approveOpen, setApproveOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedAllocation, setSelectedAllocation] =
    useState<Allocation | null>(null);

  const [deleteId, setDeleteId] =
    useState<string>();

  const { data, isLoading } =
    useAllocations();

  const shipmentMutation =
    useGenerateShipment();

  const allocations =
    data?.data ?? [];

  const columns = useMemo(
    () =>
      allocationColumns({

        onView(allocation) {
          setSelectedAllocation(allocation);
          setDetailsOpen(true);
        },

        onEdit(allocation) {
          setSelectedAllocation(allocation);
          setDialogOpen(true);
        },

        onAssign(allocation) {
          setSelectedAllocation(allocation);
          setAssignOpen(true);
        },

        onApprove(allocation) {
          setSelectedAllocation(allocation);
          setApproveOpen(true);
        },

        onDelete(id) {
          setDeleteId(id);
          setDeleteOpen(true);
        },

        onGenerateShipment(allocation) {

          shipmentMutation.mutate(
            allocation.id,
            {
              onSuccess() {
                toast.success(
                  "Shipment generated successfully."
                );
              },
            }
          );

        },

      }),
    []
  );

  const table = useReactTable({

    data: allocations,

    columns,

    state: {
      globalFilter,
    },

    onGlobalFilterChange:
      setGlobalFilter,

    getCoreRowModel:
      getCoreRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),

  });

  if (isLoading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Allocations

          </h1>

          <p className="text-muted-foreground">

            Manage export allocation requests.

          </p>

        </div>

        <Button
          onClick={() => {

            setSelectedAllocation(null);

            setDialogOpen(true);

          }}
        >
          + New Allocation
        </Button>

      </div>

      <AllocationStats
        allocations={allocations}
      />

      <div className="flex gap-4">

        <Input
          placeholder="Search Allocation..."
          className="max-w-sm"
          value={globalFilter}
          onChange={(e) =>
            setGlobalFilter(
              e.target.value
            )
          }
        />

        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >

          <SelectTrigger className="w-52">

            <SelectValue placeholder="Status" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="ALL">
              All Status
            </SelectItem>

            <SelectItem value="PENDING">
              Pending
            </SelectItem>

            <SelectItem value="UNDER_REVIEW">
              Under Review
            </SelectItem>

            <SelectItem value="APPROVED">
              Approved
            </SelectItem>

            <SelectItem value="IN_PROGRESS">
              In Progress
            </SelectItem>

            <SelectItem value="COMPLETED">
              Completed
            </SelectItem>

            <SelectItem value="REJECTED">
              Rejected
            </SelectItem>

          </SelectContent>

        </Select>

        <Select
          value={priorityFilter}
          onValueChange={setPriorityFilter}
        >

          <SelectTrigger className="w-52">

            <SelectValue placeholder="Priority" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="ALL">
              All Priority
            </SelectItem>

            <SelectItem value="LOW">
              Low
            </SelectItem>

            <SelectItem value="MEDIUM">
              Medium
            </SelectItem>

            <SelectItem value="HIGH">
              High
            </SelectItem>

            <SelectItem value="URGENT">
              Urgent
            </SelectItem>

          </SelectContent>

        </Select>

      </div>

      <div className="rounded-xl border bg-white">

        <Table>

          <TableHeader>

            {table
              .getHeaderGroups()
              .map((group) => (

                <TableRow key={group.id}>

                  {group.headers.map((header) => (

                    <TableHead key={header.id}>

                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                    </TableHead>

                  ))}

                </TableRow>

              ))}

          </TableHeader>

          <TableBody>

            {table
              .getRowModel()
              .rows
              .map((row) => (

                <TableRow key={row.id}>

                  {row
                    .getVisibleCells()
                    .map((cell) => (

                      <TableCell key={cell.id}>

                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}

                      </TableCell>

                    ))}

                </TableRow>

              ))}

          </TableBody>

        </Table>

      </div>

      <div className="flex justify-end gap-2">

        <Button
          variant="outline"
          onClick={() =>
            table.previousPage()
          }
          disabled={
            !table.getCanPreviousPage()
          }
        >
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            table.nextPage()
          }
          disabled={
            !table.getCanNextPage()
          }
        >
          Next
        </Button>

      </div>

      <AllocationDialog
        open={dialogOpen}
        allocation={
          selectedAllocation ??
          undefined
        }
        onOpenChange={(open) => {

          setDialogOpen(open);

          if (!open) {
            setSelectedAllocation(null);
          }

        }}
      />

      <AllocationDetailsDialog
        open={detailsOpen}
        allocation={
          selectedAllocation ??
          undefined
        }
        onOpenChange={setDetailsOpen}
      />

      <AssignOfficerDialog
        open={assignOpen}
        allocation={
          selectedAllocation ??
          undefined
        }
        onOpenChange={setAssignOpen}
      />

      <ApproveAllocationDialog
        open={approveOpen}
        allocation={
          selectedAllocation ??
          undefined
        }
        onOpenChange={setApproveOpen}
      />

      <DeleteAllocationDialog
        id={deleteId}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />

    </div>
  );
}