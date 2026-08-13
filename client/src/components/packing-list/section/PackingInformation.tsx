import type { UseFormReturn } from "react-hook-form";
import {
  Package,
  CalendarDays,
  Hash,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import type {
  CreatePackingListInput,
  CreatePackingListOutput,
} from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<
    CreatePackingListInput,
    undefined,
    CreatePackingListOutput
  >;
}

export default function PackingInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Package className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Packing Information
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Provide the basic information for this packing list.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Packing Date */}
          <FormField
            control={form.control}
            name="packingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  Packing Date
                </FormLabel>

                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    className="h-11 border-slate-200 bg-white shadow-sm transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Package Type */}
          <FormField
            control={form.control}
            name="packageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Package Type
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    placeholder="e.g. Bags, Cartons, Drums, Pallets"
                    className="h-11 border-slate-200 bg-white shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Marks & Numbers */}
          <FormField
            control={form.control}
            name="marksAndNumbers"
            render={({ field }) => (
              <FormItem className="sm:col-span-2 lg:col-span-1">
                <FormLabel className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Hash className="h-4 w-4 text-emerald-600" />
                  Marks & Numbers
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                    placeholder="Shipping marks / Container marks"
                    className="h-11 border-slate-200 bg-white shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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