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
  CreateAllocationOutput,
} from "../../../validations/allocation.schema";

interface Props {
  form: UseFormReturn<
    CreateAllocationInput,
    undefined,
    CreateAllocationOutput
  >;
}

export default function CargoInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      {/* ...all your existing string fields stay exactly the same... */}

      {/* Quantity */}
      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>

            <FormControl>
              <Input
                type="number"
                placeholder="0"
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

      {/* Packages */}
      <FormField
        control={form.control}
        name="numberOfPackages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Packages</FormLabel>

            <FormControl>
              <Input
                type="number"
                placeholder="0"
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

      {/* Gross Weight */}
      <FormField
        control={form.control}
        name="grossWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gross Weight (kg)</FormLabel>

            <FormControl>
              <Input
                type="number"
                placeholder="0"
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

      {/* Net Weight */}
      <FormField
        control={form.control}
        name="netWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Net Weight (kg)</FormLabel>

            <FormControl>
              <Input
                type="number"
                placeholder="0"
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

      {/* Volume */}
      <FormField
        control={form.control}
        name="volume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Volume (m³)</FormLabel>

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
    </div>
  );
}