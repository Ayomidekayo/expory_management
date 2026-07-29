import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";

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

export default function FinancialInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Financial Information
        </h2>

        <p className="text-sm text-slate-500">
          Enter the commercial and payment details for this allocation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Estimated Value */}
        <FormField
          control={form.control}
          name="estimatedValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Estimated Cargo Value
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={
                    typeof field.value === "number"
                      ? field.value
                      : ""
                  }
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

        {/* Currency */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Currency
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="USD"
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

        {/* Payment Terms */}
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Payment Terms
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Net 30"
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

        {/* Freight Type */}
        <FormField
          control={form.control}
          name="freightType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Freight Type
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Prepaid / Collect"
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

      <div className="mt-8">
        <FormField
          control={form.control}
          name="insuranceRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <FormLabel>
                  Cargo Insurance
                </FormLabel>

                <p className="text-sm text-slate-500">
                  Enable this if insurance coverage is required for this shipment.
                </p>
              </div>

              <FormControl>
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
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