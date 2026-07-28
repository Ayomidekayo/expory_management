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
import type { CreateShipmentInput } from "../../../validations/shipment.validation";

interface Props {
  form: UseFormReturn<CreateShipmentInput>;
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

const shipmentStatuses = [
  "DRAFT",
  "READY",
  "BOOKED",
  "LOADED",
  "IN_TRANSIT",
  "ARRIVED",
  "CUSTOMS_CLEARANCE",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
];

export default function ShipmentInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Shipment Information
        </h2>

        <p className="text-sm text-slate-500">
          Basic shipment details.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <FormField
          control={form.control}
          name="shipmentDate"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Shipment Date
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

                    <SelectValue placeholder="Select transport mode" />

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
          name="status"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Status
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue placeholder="Select status" />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  {shipmentStatuses.map((status) => (

                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {status.replaceAll("_", " ")}
                    </SelectItem>

                  ))}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

      </div>

    </div>
  );
}