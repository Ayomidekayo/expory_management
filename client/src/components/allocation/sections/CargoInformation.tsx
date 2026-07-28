import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";


import type {
  CreateAllocationInput,
} from "../../../validations/allocation.schema";

interface Props {
  form: UseFormReturn<CreateAllocationInput>;
}

export default function CargoInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Cargo Information
        </h2>

        <p className="text-sm text-slate-500">
          Describe the goods to be exported.
        </p>

      </div>

      <div className="grid gap-6">

        {/* Cargo Description */}

        <FormField
          control={form.control}
          name="cargoDescription"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Cargo Description
              </FormLabel>

              <FormControl>

                <textarea
                  rows={4}
                  placeholder="Describe the cargo..."
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">

          {/* Cargo Type */}

          <FormField
            control={form.control}
            name="cargoType"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Cargo Type
                </FormLabel>

                <FormControl>

                  <Input
                    placeholder="Frozen Food"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>
            )}
          />

          {/* Commodity Name */}

          <FormField
            control={form.control}
            name="commodityName"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Commodity Name
                </FormLabel>

                <FormControl>

                  <Input
                    placeholder="Sesame Seeds"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>
            )}
          />

          {/* Commodity Code */}

          <FormField
            control={form.control}
            name="commodityCode"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Commodity Code
                </FormLabel>

                <FormControl>

                  <Input
                    placeholder="HS Code"
                    {...field}
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

                <FormLabel>
                  Package Type
                </FormLabel>

                <FormControl>

                  <Input
                    placeholder="Bag / Carton / Pallet"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>
            )}
          />

        </div>

        <div className="grid gap-6 md:grid-cols-4">

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
                    placeholder="0"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>
            )}
          />

          {/* Packages */}

          <FormField
            control={form.control}
            name="numberOfPackages"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Packages
                </FormLabel>

                <FormControl>

                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>
            )}
          />

          {/* Gross Weight */}

          <FormField
            control={form.control}
            name="grossWeight"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Gross Weight (kg)
                </FormLabel>

                <FormControl>

                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>
            )}
          />

          {/* Net Weight */}

          <FormField
            control={form.control}
            name="netWeight"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Net Weight (kg)
                </FormLabel>

                <FormControl>

                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                  />

                </FormControl>

                <FormMessage />

              </FormItem>
            )}
          />

        </div>

        {/* Volume */}

        <div className="grid gap-6 md:grid-cols-3">

          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Volume (m³)
                </FormLabel>

                <FormControl>

                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
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