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
  CreateInvoiceInput,
  CreateInvoiceOutput,
} from "../../../validations/invoice.validation";

interface Props {
  form: UseFormReturn<
    CreateInvoiceInput,
    undefined,
    CreateInvoiceOutput
  >;
}

export default function Remarks({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900">
          Remarks
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add any additional notes or special instructions
          for this invoice.
        </p>
      </div>

      {/* Content */}

      <div className="p-6">
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Remarks
              </FormLabel>

              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={6}
                  placeholder="Enter additional notes, payment instructions, delivery details, or other relevant information..."
                  className="min-h-[140px] w-full resize-y border-slate-200 bg-white px-4 py-3 text-sm leading-6 shadow-sm transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
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