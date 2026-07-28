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

  quantity: z.coerce
    .number()
    .positive(),

  unitPrice: z.coerce
    .number()
    .positive(),
});

export type InvoiceItemFormData =
  z.infer<typeof schema>;

interface Props {
  invoiceId: string;

  loading?: boolean;

  defaultValues?: Partial<InvoiceItemFormData>;

  onSubmit: (
    values: InvoiceItemFormData
  ) => void;
}

export default function InvoiceItemForm({
  invoiceId,
  loading,
  defaultValues,
  onSubmit,
}: Props) {
  const form =
    useForm<InvoiceItemFormData>({
      resolver: zodResolver(schema),

      defaultValues: {
        invoiceId,

        description: "",

        quantity: 1,

        unitPrice: 0,

        ...defaultValues,
      },
    });

  useEffect(() => {
    form.reset({
      invoiceId,

      description: "",

      quantity: 1,

      unitPrice: 0,

      ...defaultValues,
    });
  }, [defaultValues, invoiceId]);

  const quantity =
    form.watch("quantity");

  const unitPrice =
    form.watch("unitPrice");

  const total =
    Number(quantity || 0) *
    Number(unitPrice || 0);

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit
      )}
      className="space-y-5"
    >
      <div>
        <label className="text-sm font-medium">
          Description
        </label>

        <Input
          placeholder="Product description"
          {...form.register(
            "description"
          )}
        />

        <p className="text-sm text-red-500">
          {
            form.formState.errors
              .description?.message
          }
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            Quantity
          </label>

          <Input
            type="number"
            step="0.01"
            {...form.register(
              "quantity"
            )}
          />

          <p className="text-sm text-red-500">
            {
              form.formState.errors
                .quantity?.message
            }
          </p>
        </div>

        <div>
          <label className="text-sm font-medium">
            Unit Price
          </label>

          <Input
            type="number"
            step="0.01"
            {...form.register(
              "unitPrice"
            )}
          />

          <p className="text-sm text-red-500">
            {
              form.formState.errors
                .unitPrice?.message
            }
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">
          Total
        </label>

        <Input
          disabled
          value={total.toFixed(2)}
        />
      </div>

      <Button
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