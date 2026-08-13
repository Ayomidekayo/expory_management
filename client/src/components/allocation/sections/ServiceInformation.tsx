import {
  ClipboardList,
  Flag,
} from "lucide-react";

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

function FieldIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
      {children}
    </div>
  );
}

export default function ServiceInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Service Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Select the requested service and priority.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Service Type */}

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Service Type
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <ClipboardList className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Priority
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Flag className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}