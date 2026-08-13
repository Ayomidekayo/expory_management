import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  Calculator,
  FileText,
  Hash,
  Tag,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

import type {
  CreateTransitInput,
  CreateTransitOutput,
} from "../../../validations/transit.validation";

interface Props {
  form: UseFormReturn<
    CreateTransitInput,
    undefined,
    CreateTransitOutput
  >;
}

function FieldIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
      {children}
    </div>
  );
}

export default function PricingInformation({
  form,
}: Props) {
  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unitPrice");

  /*
  =====================================
  Auto Calculate Total Price
  =====================================
  */

  useEffect(() => {
    const qty = Number(quantity);
    const price = Number(unitPrice);

    if (
      Number.isNaN(qty) ||
      Number.isNaN(price)
    ) {
      return;
    }

    const total = qty * price;

    if (form.getValues("totalPrice") !== total) {
      form.setValue("totalPrice", total, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [quantity, unitPrice, form]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calculator className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Pricing Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Enter the quantity and pricing details for the transit.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Hash className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        {...field}
                        value={
                          typeof field.value === "number" ||
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit Price */}
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Unit Price
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Tag className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={
                          typeof field.value === "number" ||
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Price */}
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Total Price
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <Calculator className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        readOnly
                        type="number"
                        step="0.01"
                        {...field}
                        value={
                          typeof field.value === "number" ||
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className="h-11 w-full border-primary/20 bg-primary/5 font-semibold text-slate-900"
                      />
                    </FormControl>
                  </div>
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Automatically calculated from quantity × unit price.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <div className="mt-7 border-t border-slate-100 pt-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Goods Description
                </FormLabel>

                <div className="flex min-w-0 items-start gap-3">
                  <FieldIcon>
                    <FileText className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe the goods being transported..."
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className="min-h-[120px] w-full resize-y border-slate-200 bg-white leading-6"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}