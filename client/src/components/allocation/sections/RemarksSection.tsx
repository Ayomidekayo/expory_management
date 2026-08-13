import { MessageSquareText, LockKeyhole } from "lucide-react";
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
    undefined,
    CreateAllocationOutput
  >;
}

export default function RemarksSection({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquareText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Remarks
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Add client instructions and internal operational notes.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-6">
        {/* Special Instructions */}
        <FormField
          control={form.control}
          name="specialInstruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">
                Special Instructions
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <MessageSquareText className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                  <Textarea
                    rows={5}
                    placeholder="Enter any special client requests or shipment instructions..."
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="min-h-[130px] resize-y border-slate-200 bg-white pl-10 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
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
              <div className="flex items-center justify-between gap-3">
                <FormLabel className="text-sm font-medium text-slate-700">
                  Internal Remarks
                </FormLabel>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  <LockKeyhole className="h-3 w-3" />
                  Staff only
                </span>
              </div>

              <FormControl>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                  <Textarea
                    rows={5}
                    placeholder="Visible only to staff..."
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="min-h-[130px] resize-y border-slate-200 bg-white pl-10 shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}