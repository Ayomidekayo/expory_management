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
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Workflow
        </h2>

        <p className="text-sm text-slate-500">
          Assign this allocation to a staff member.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="assignedToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Assigned Staff
              </FormLabel>

              <Select
                value={
                  typeof field.value === "string"
                    ? field.value
                    : ""
                }
                defaultValue={
                  typeof field.value === "string"
                    ? field.value
                    : undefined
                }
                onValueChange={(value) =>
                  field.onChange(value || undefined)
                }
              >
                <FormControl>
                  <SelectTrigger>
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

              <p className="text-sm text-slate-500">
                This can be changed later.
              </p>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}