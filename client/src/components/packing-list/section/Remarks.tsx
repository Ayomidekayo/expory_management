import type { UseFormReturn } from "react-hook-form";
import { MessageSquareText } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Textarea } from "../../ui/textarea";

import type { CreatePackingListInput } from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
}

export default function Remarks({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <MessageSquareText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Remarks
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Add additional notes or special packing instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Remarks
              </FormLabel>

              <FormControl>
                <Textarea
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(e.target.value)
                  }
                  rows={6}
                  placeholder="Enter any additional remarks, handling instructions, or special notes..."
                  className="min-h-[140px] resize-none border-slate-200 bg-white shadow-sm placeholder:text-slate-400 transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </FormControl>

              <div className="mt-2 flex items-center justify-between gap-3">
                <FormMessage />

                <span className="ml-auto text-xs text-slate-400">
                  Optional
                </span>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}