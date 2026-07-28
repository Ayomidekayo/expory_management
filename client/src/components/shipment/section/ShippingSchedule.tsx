import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import type { CreateShipmentInput } from "../../../validations/shipment.validation";

interface Props {
  form: UseFormReturn<CreateShipmentInput>;
}

export default function ShippingSchedule({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Shipping Schedule
        </h2>

        <p className="text-sm text-slate-500">
          Planned and actual shipment dates.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Expected Departure */}

        <FormField
          control={form.control}
          name="expectedDeparture"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Expected Departure
              </FormLabel>

              <FormControl>

                <Input
                  type="date"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Expected Arrival */}

        <FormField
          control={form.control}
          name="expectedArrival"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Expected Arrival
              </FormLabel>

              <FormControl>

                <Input
                  type="date"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Actual Departure */}

        <FormField
          control={form.control}
          name="actualDeparture"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Actual Departure
              </FormLabel>

              <FormControl>

                <Input
                  type="date"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Actual Arrival */}

        <FormField
          control={form.control}
          name="actualArrival"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Actual Arrival
              </FormLabel>

              <FormControl>

                <Input
                  type="date"
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