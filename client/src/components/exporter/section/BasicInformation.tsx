import type { UseFormReturn } from "react-hook-form";

import {
  Building2,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import type { CreateExporterInput } from "../../../validations/exporter.validation";

interface Props {
  form: UseFormReturn<CreateExporterInput>;
}

export default function BasicInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Basic Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Provide the basic details of the exporter.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-w-0 md:max-w-xl">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Exporter Name
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Enter exporter name"
                    className="h-11 w-full border-slate-200 bg-white"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}