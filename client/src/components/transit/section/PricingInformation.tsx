import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

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

export default function PricingInformation({
  form,
}: Props) {

  /*
  =====================================
  Watch Values
  =====================================
  */

  const quantity =
    form.watch("quantity");

  const unitPrice =
    form.watch("unitPrice");

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

    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">

          Pricing Information

        </h2>

        <p className="text-sm text-muted-foreground">

          Quantity, pricing and goods description.

        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">

        {/* Quantity */}

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Quantity

              </FormLabel>

              <FormControl>

               <Input
  type="number"
  step="0.01"
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
/>
              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Unit Price */}

        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Unit Price

              </FormLabel>

              <FormControl>

                <Input
  type="number"
  step="0.01"
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
/>

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Total Price */}

        <FormField
          control={form.control}
          name="totalPrice"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Total Price

              </FormLabel>

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
  className="bg-muted"
/>

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

      </div>

      <div className="mt-6">

        {/* Description */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Description

              </FormLabel>

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