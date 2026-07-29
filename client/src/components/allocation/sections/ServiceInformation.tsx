import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

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
    any,
    CreateAllocationOutput
  >;
}

const services = [
  {
    value: "EXPORT_DOCUMENTATION",
    label: "Export Documentation",
  },
  {
    value: "CUSTOMS_CLEARANCE",
    label: "Customs Clearance",
  },
  {
    value: "FREIGHT_FORWARDING",
    label: "Freight Forwarding",
  },
  {
    value: "HAULAGE",
    label: "Haulage",
  },
  {
    value: "CONTAINER_BOOKING",
    label: "Container Booking",
  },
  {
    value: "INSPECTION",
    label: "Inspection",
  },
  {
    value: "WAREHOUSING",
    label: "Warehousing",
  },
  {
    value: "INSURANCE",
    label: "Insurance",
  },
  {
    value: "OTHER",
    label: "Other",
  },
] as const;

const priorities = [
  {
    value: "LOW",
    label: "Low",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HIGH",
    label: "High",
  },
  {
    value: "URGENT",
    label: "Urgent",
  },
] as const;

export default function ServiceInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Service Information
        </h2>

        <p className="text-sm text-slate-500">
          Select the requested service and priority.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Type */}
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Service Type
              </FormLabel>

              <Select
                value={field.value ?? ""}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {services.map((service) => (
                    <SelectItem
                      key={service.value}
                      value={service.value}
                    >
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Priority
              </FormLabel>

              <Select
                value={field.value ?? ""}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem
                      key={priority.value}
                      value={priority.value}
                    >
                      {priority.label}
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