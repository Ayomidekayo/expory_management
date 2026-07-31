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

import type {
  CreateContainerInput,
  CreateContainerOutput,
} from "../../../validations/container.validation";

interface Props {
  form: UseFormReturn<
    CreateContainerInput,
    undefined,
    CreateContainerOutput
  >;
}

export default function PhysicalInformation({ form }: Props) {
  const grossWeight = form.watch("grossWeight");
  const netWeight = form.watch("netWeight");

  useEffect(() => {
    const gross =
      typeof grossWeight === "number" ? grossWeight : 0;

    const net =
      typeof netWeight === "number" ? netWeight : 0;

    form.setValue(
      "tareWeight",
      Math.max(gross - net, 0)
    );
  }, [grossWeight, netWeight, form]);

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Physical Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Record the physical measurements of the container.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FormField
          control={form.control}
          name="grossWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gross Weight (KG)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={
                    typeof field.value === "number"
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

        <FormField
          control={form.control}
          name="netWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Weight (KG)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={
                    typeof field.value === "number"
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

        <FormField
          control={form.control}
          name="tareWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tare Weight (KG)</FormLabel>

              <FormControl>
                <Input
                  readOnly
                  type="number"
                  step="0.01"
                  value={
                    typeof field.value === "number"
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

        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume (CBM)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  value={
                    typeof field.value === "number"
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
      </div>
    </div>
  );
}