import type { UseFormReturn } from "react-hook-form";

import { MapPin } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Textarea } from "../../ui/textarea";

import type { CreateConsigneeInput } from "../../../validations/consignee.validation";

interface Props {
  form: UseFormReturn<CreateConsigneeInput>;
}

export default function AddressInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Address Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Provide the physical address of the consignee.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </FormLabel>

              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={5}
                  placeholder="Enter the consignee's full address..."
                  className="min-h-[120px] w-full resize-y border-slate-200 bg-white leading-6 shadow-sm focus-visible:ring-2"
                />
              </FormControl>

              <p className="mt-1.5 text-xs text-slate-400">
                Include street, city, state, country, and other relevant
                location details.
              </p>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}