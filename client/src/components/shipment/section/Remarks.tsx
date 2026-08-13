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

import type { CreateShipmentInput } from "../../../validations/shipment.validation";

interface Props {
  form: UseFormReturn<CreateShipmentInput>;
}

export default function Remarks({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          {/* Header Icon */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquareText className="h-5 w-5" />
          </div>

          {/* Header Text */}

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Remarks
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Add additional shipment notes or special instructions.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Shipment Remarks
              </FormLabel>

              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={6}
                  placeholder="Enter additional shipment information, special instructions, handling requirements, or other relevant notes..."
                  className="min-h-[150px] w-full resize-y border-slate-200 bg-white leading-6 shadow-sm placeholder:text-slate-400 focus-visible:ring-2"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            INFORMATION PANEL
        ========================================= */}

        <div className="mt-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <MessageSquareText className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">
              Additional Information
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Use this section for special handling instructions,
              delivery notes, operational details, or any other
              information relevant to this shipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}