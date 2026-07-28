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
} from "../../../validations/transit.validation";

interface Props {
  form: UseFormReturn<CreateTransitInput>;
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

    const qty =
      Number(quantity ?? 0);

    const price =
      Number(unitPrice ?? 0);

    form.setValue(

      "totalPrice",

      qty * price

    );

  }, [

    quantity,

    unitPrice,

    form,

  ]);

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
                  value={field.value ?? ""}
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
                  value={field.value ?? ""}
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
                  value={field.value ?? 0}
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
                  value={field.value ?? ""}
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