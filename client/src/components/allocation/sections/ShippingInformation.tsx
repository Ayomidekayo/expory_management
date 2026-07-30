import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

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

const transportModes = [
  { value: "ROAD", label: "Road" },
  { value: "SEA", label: "Sea" },
  { value: "AIR", label: "Air" },
  { value: "RAIL", label: "Rail" },
] as const;

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
        <FormField
          control={form.control}
          name="originCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin Country</FormLabel>
              <FormControl>
                <Input
  placeholder="Nigeria"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="originCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin City</FormLabel>
              <FormControl>
              <Input
  placeholder="Lagos"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="pickupAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Address</FormLabel>
              <FormControl>
               <Input
  placeholder="Warehouse Address"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="pickupDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Date</FormLabel>

              <FormControl>
               <Input
  type="date"
  value={
    typeof field.value === "string"
      ? field.value.substring(0, 10)
      : ""
  }
  onChange={(e) =>
    field.onChange(
      e.target.value
        ? new Date(e.target.value).toISOString()
        : ""
    )
  }
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

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="destinationCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Country</FormLabel>
              <FormControl>
              <Input
  placeholder="United Kingdom"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="destinationCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination City</FormLabel>
              <FormControl>
                <Input
  placeholder="London"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="portOfLoading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port of Loading</FormLabel>
              <FormControl>
               <Input
  placeholder="Apapa Port"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="portOfDischarge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port of Discharge</FormLabel>
              <FormControl>
                <Input
  placeholder="Felixstowe Port"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="destinationPort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Port</FormLabel>
              <FormControl>
               <Input
  placeholder="Final Port"
  value={
    typeof field.value === "string"
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

        <FormField
          control={form.control}
          name="shippingLine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Line</FormLabel>
              <FormControl>
               <Input
  placeholder="Maersk"
  value={
    typeof field.value === "string"
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

      <div className="mt-8 grid gap-6 md:grid-cols-3">
<FormField
  control={form.control}
  name="transportMode"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Transport Mode</FormLabel>

      <Select
  value={
    typeof field.value === "string"
      ? field.value
      : ""
  }
  defaultValue={
    typeof field.value === "string"
      ? field.value
      : undefined
  }
  onValueChange={(value) =>
    field.onChange(value || undefined)
  }
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

        <FormField
          control={form.control}
          name="incoterm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incoterm</FormLabel>

              <FormControl>
               <Input
  placeholder="FOB"
  value={
    typeof field.value === "string"
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
    typeof field.value === "string"
      ? field.value.substring(0, 10)
      : ""
  }
  onChange={(e) =>
    field.onChange(
      e.target.value
        ? new Date(e.target.value).toISOString()
        : ""
    )
  }
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

      <div className="mt-8">
        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Address</FormLabel>

              <FormControl>
               <Input
  placeholder="Final Delivery Address"
  value={
    typeof field.value === "string"
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
    </div>
  );
}