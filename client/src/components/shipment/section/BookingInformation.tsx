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

export default function BookingInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Booking Information
        </h2>

        <p className="text-sm text-slate-500">
          Shipping line, booking and voyage details.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Booking Number */}

        <FormField
          control={form.control}
          name="bookingNumber"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Booking Number
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

        {/* Vessel Name */}

        <FormField
          control={form.control}
          name="vesselName"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Vessel Name
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="MSC OSCAR"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Voyage Number */}

        <FormField
          control={form.control}
          name="voyageNumber"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Voyage Number
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="VOY-001"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Port of Loading */}

        <FormField
          control={form.control}
          name="portOfLoading"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Port of Loading
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

        {/* Port of Discharge */}

        <FormField
          control={form.control}
          name="portOfDischarge"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Port of Discharge
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Felixstowe Port"
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