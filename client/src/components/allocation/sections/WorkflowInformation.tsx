import { UserRound } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import type {
  CreateAllocationInput,
  CreateAllocationOutput,
} from "../../../validations/allocation.schema";

/*
Replace this with useUsers() later.
*/
const staffMembers = [
  {
    id: "1",
    name: "Operations Officer",
  },
  {
    id: "2",
    name: "Documentation Officer",
  },
  {
    id: "3",
    name: "Export Manager",
  },
] as const;

interface Props {
  form: UseFormReturn<
    CreateAllocationInput,
    undefined,
    CreateAllocationOutput
  >;
}

export default function WorkflowInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Workflow
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Assign this allocation to a staff member.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Assigned Staff
                </FormLabel>

                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                    <UserRound className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : ""
                      }
                      onValueChange={(value) =>
                        field.onChange(value || undefined)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white shadow-sm">
                          <SelectValue placeholder="Assign to staff" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {staffMembers.map((staff) => (
                          <SelectItem
                            key={staff.id}
                            value={staff.id}
                          >
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <p className="mt-2 text-xs text-slate-500">
                      This assignment can be changed later.
                    </p>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}