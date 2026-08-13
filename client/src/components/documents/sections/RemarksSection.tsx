import type { UseFormReturn } from "react-hook-form";

import {
  FileText,
  MessageSquareText,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Textarea } from "../../ui/textarea";

import type {
  CreateDocumentInput,
} from "../../../validations/document.validation";

interface Props {
  form: UseFormReturn<CreateDocumentInput>;
}

export default function RemarksSection({
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
              Add additional notes about this document.
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
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </FormLabel>

              <FormControl>
                <div className="relative">
                  <MessageSquareText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

                  <Textarea
                    rows={5}
                    placeholder="Enter any additional notes about this document..."
                    className="
                      min-h-[130px]
                      resize-y
                      border-slate-200
                      bg-white
                      pl-10
                      shadow-sm
                      transition-colors
                      placeholder:text-slate-400
                      focus:border-amber-400
                      focus:ring-2
                      focus:ring-amber-500/20
                    "
                    {...field}
                    value={field.value ?? ""}
                  />
                </div>
              </FormControl>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <FileText className="h-3.5 w-3.5" />
                  <span>
                    These remarks will be stored with the document.
                  </span>
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}