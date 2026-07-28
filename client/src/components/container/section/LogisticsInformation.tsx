















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
} from "../../../validations/container.validation";

interface Props {
  form: UseFormReturn<CreateContainerInput>;
}

export default function LogisticsInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Logistics Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Shipping and destination details.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Loading Location */}

        <FormField
          control={form.control}
          name="loadingLocation"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Loading Location
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Apapa Port"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Destination */}

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Destination
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Shanghai, China"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Shipping Line */}

        <FormField
          control={form.control}
          name="shippingLine"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Shipping Line
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Maersk"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Booking Reference */}

        <FormField
          control={form.control}
          name="bookingReference"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Booking Reference
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="BK-2026-0001"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Container Condition */}

        <FormField
          control={form.control}
          name="containerCondition"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Container Condition
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Excellent"
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




{/* <Select
  value={field.value ?? ""}
  onValueChange={field.onChange}
>
  <FormControl>
    <SelectTrigger>
      <SelectValue placeholder="Select Condition" />
    </SelectTrigger>
  </FormControl>

  <SelectContent>
    <SelectItem value="NEW">New</SelectItem>
    <SelectItem value="GOOD">Good</SelectItem>
    <SelectItem value="FAIR">Fair</SelectItem>
    <SelectItem value="DAMAGED">Damaged</SelectItem>
    <SelectItem value="UNDER_REPAIR">
      Under Repair
    </SelectItem>
  </SelectContent>
</Select> */}