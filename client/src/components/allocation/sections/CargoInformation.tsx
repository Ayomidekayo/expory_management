import type { AllocationSectionProps } from "../../../types/allocation.types";

import FormSection from "../../documents/FormSection";
import FormGrid from "../../shared/FormGrid";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

export default function CargoInformation({
  form,
}: AllocationSectionProps) {
  return (
    <FormSection
      title="Cargo Information"
      description="Provide detailed information about the cargo."
    >
      <FormGrid columns={2}>
        {/* =========================================
            CARGO DESCRIPTION
        ========================================= */}

        <FormField
          control={form.control}
          name="cargoDescription"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Cargo Description
              </FormLabel>

              <FormControl>
                <textarea
                  {...field}
                  rows={5}
                  placeholder="Describe the cargo, its characteristics, or any relevant details..."
                  value={field.value ?? ""}
                  className="flex min-h-[130px] w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            CARGO TYPE
        ========================================= */}

        <FormField
          control={form.control}
          name="cargoType"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Cargo Type
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  placeholder="Finished Goods"
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            COMMODITY NAME
        ========================================= */}

        <FormField
          control={form.control}
          name="commodityName"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Commodity Name
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  placeholder="Sesame Seeds"
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            HS CODE
        ========================================= */}

        <FormField
          control={form.control}
          name="commodityCode"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                HS Code
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  placeholder="120740"
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            QUANTITY
        ========================================= */}

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Quantity
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1000"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            PACKAGE TYPE
        ========================================= */}

        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
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
                  placeholder="Bags"
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            NUMBER OF PACKAGES
        ========================================= */}

        <FormField
          control={form.control}
          name="numberOfPackages"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Number of Packages
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="500"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            GROSS WEIGHT
        ========================================= */}

        <FormField
          control={form.control}
          name="grossWeight"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Gross Weight (KG)
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="25000"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            NET WEIGHT
        ========================================= */}

        <FormField
          control={form.control}
          name="netWeight"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Net Weight (KG)
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="24800"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            VOLUME
        ========================================= */}

        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Volume (m³)
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="20"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="h-11 w-full border-slate-200 bg-white shadow-sm"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </FormGrid>
    </FormSection>
  );
}