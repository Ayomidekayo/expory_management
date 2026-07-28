import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

import type { CreateAllocationInput } from "../../../validations/allocation.schema";

interface Props {
  form: UseFormReturn<CreateAllocationInput>;
}

const transportModes = [
  {
    value: "ROAD",
    label: "Road",
  },
  {
    value: "SEA",
    label: "Sea",
  },
  {
    value: "AIR",
    label: "Air",
  },
  {
    value: "RAIL",
    label: "Rail",
  },
];

export default function ShippingInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Shipping Information
        </h2>

        <p className="text-sm text-slate-500">
          Destination, logistics and shipment schedule.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Origin Country */}

        <FormField
          control={form.control}
          name="originCountry"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Origin Country
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Nigeria"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Origin City */}

        <FormField
          control={form.control}
          name="originCity"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Origin City
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Lagos"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Pickup Address */}

        <FormField
          control={form.control}
          name="pickupAddress"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Pickup Address
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Warehouse Address"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Pickup Date */}

       <FormField
  control={form.control}
  name="pickupDate"
  render={({ field }) => (
    <FormItem>

      <FormLabel>
        Pickup Date
      </FormLabel>

      <FormControl>

        <Input
          type="date"
          value={
            field.value
              ? field.value.substring(0, 10)
              : ""
          }
          onChange={(e) =>
            field.onChange(
              e.target.value
                ? new Date(
                    e.target.value
                  ).toISOString()
                : undefined
            )
          }
        />

      </FormControl>

      <FormMessage />

    </FormItem>
  )}
/>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* Destination Country */}

        <FormField
          control={form.control}
          name="destinationCountry"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Destination Country
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="United Kingdom"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Destination City */}

        <FormField
          control={form.control}
          name="destinationCity"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Destination City
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="London"
                  {...field}
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
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Destination Port */}

        <FormField
          control={form.control}
          name="destinationPort"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Destination Port
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Final Port"
                  {...field}
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
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        {/* Transport Mode */}

        <FormField
          control={form.control}
          name="transportMode"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Transport Mode
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue placeholder="Select Mode" />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  {transportModes.map((mode) => (

                    <SelectItem
                      key={mode.value}
                      value={mode.value}
                    >
                      {mode.label}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Incoterm */}

        <FormField
          control={form.control}
          name="incoterm"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Incoterm
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="FOB"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Expected Shipment */}


        <FormField
  control={form.control}
  name="expectedShipmentDate"
  render={({ field }) => (
    <FormItem>

      <FormLabel>
        Expected Shipment Date
      </FormLabel>

      <FormControl>

        <Input
          type="date"
          value={
            field.value
              ? field.value.substring(0, 10)
              : ""
          }
          onChange={(e) =>
            field.onChange(
              e.target.value
                ? new Date(
                    e.target.value
                  ).toISOString()
                : undefined
            )
          }
        />

      </FormControl>

      <FormMessage />

    </FormItem>
  )}
/>

      </div>

      <div className="mt-8">

        {/* Delivery Address */}

        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Delivery Address
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Final Delivery Address"
                  {...field}
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