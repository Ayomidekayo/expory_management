import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

const schema = z.object({
  invoiceId: z.string(),

  description: z
    .string()
    .min(1, "Description is required"),

  itemDate: z
    .string()
    .min(1, "Item date is required"),

  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than 0"),

  unitPrice: z.coerce
    .number()
    .positive("Unit price must be greater than 0"),
});

export type InvoiceItemInput =
  z.input<typeof schema>;

export type InvoiceItemOutput =
  z.output<typeof schema>;

interface Props {
  invoiceId: string;

  loading?: boolean;

  defaultValues?: Partial<InvoiceItemInput>;

  onSubmit: (
    values: InvoiceItemOutput
  ) => void;
}

export default function InvoiceItemForm({
  invoiceId,
  loading,
  defaultValues,
  onSubmit,
}: Props) {
  const form = useForm<
    InvoiceItemInput,
    undefined,
    InvoiceItemOutput
  >({
    resolver: zodResolver(schema),

    defaultValues: {
      invoiceId,
      description: "",
      itemDate: "",
      quantity: 1,
      unitPrice: 0,
      ...defaultValues,
    },
  });

  useEffect(() => {
    form.reset({
      invoiceId,
      description: "",
      itemDate: "",
      quantity: 1,
      unitPrice: 0,
      ...defaultValues,
    });
  }, [
    defaultValues,
    invoiceId,
    form,
  ]);

  const quantity =
    Number(form.watch("quantity")) || 0;

  const unitPrice =
    Number(form.watch("unitPrice")) || 0;

  const total =
    quantity * unitPrice;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Description */}
      <div>
        <label className="text-sm font-medium">
          Description
        </label>

        <Input
          {...form.register("description")}
          placeholder="Product description"
        />

        <p className="text-sm text-red-500">
          {form.formState.errors.description?.message}
        </p>
      </div>

      {/* Item Date */}
      <div>
        <label className="text-sm font-medium">
          Item Date
        </label>

        <Input
          type="date"
          {...form.register("itemDate")}
        />

        <p className="text-sm text-red-500">
          {form.formState.errors.itemDate?.message}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Enter the date associated with this invoice item.
        </p>
      </div>

      {/* Quantity + Unit Price */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Quantity */}
        <div>
          <label className="text-sm font-medium">
            Quantity
          </label>

          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={
              form.watch("quantity") == null
                ? ""
                : String(
                    form.watch("quantity")
                  )
            }
            onChange={(e) =>
              form.setValue(
                "quantity",
                e.target.value === ""
                  ? undefined
                  : Number(e.target.value),
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
            }
          />

          <p className="text-sm text-red-500">
            {
              form.formState.errors
                .quantity?.message
            }
          </p>
        </div>

        {/* Unit Price */}
        <div>
          <label className="text-sm font-medium">
            Unit Price
          </label>

          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={
              form.watch("unitPrice") == null
                ? ""
                : String(
                    form.watch("unitPrice")
                  )
            }
            onChange={(e) =>
              form.setValue(
                "unitPrice",
                e.target.value === ""
                  ? undefined
                  : Number(e.target.value),
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
            }
          />

          <p className="text-sm text-red-500">
            {
              form.formState.errors
                .unitPrice?.message
            }
          </p>
        </div>
      </div>

      {/* Total */}
      <div>
        <label className="text-sm font-medium">
          Total
        </label>

        <Input
          disabled
          value={total.toFixed(2)}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Save Item"}
      </Button>
    </form>
  );
}