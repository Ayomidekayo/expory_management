import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Textarea } from "../../ui/textarea";

import type {
  CreateAllocationInput,
  CreateAllocationOutput,
} from "../../../validations/allocation.schema";

interface Props {
  form: UseFormReturn<
    CreateAllocationInput,
    any,
    CreateAllocationOutput
  >;
}

export default function RemarksSection({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Remarks
        </h2>

        <p className="text-sm text-slate-500">
          Add client instructions and internal operational notes.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Special Instructions */}
        <FormField
          control={form.control}
          name="specialInstruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Special Instructions
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Enter any special client requests or shipment instructions..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Internal Remarks */}
        <FormField
          control={form.control}
          name="internalRemark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Internal Remarks
              </FormLabel>

              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Visible only to staff..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}