import type { UseFormReturn } from "react-hook-form";

import {
  CalendarDays,
  CircleDot,
  Truck,
} from "lucide-react";

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

/*
=========================================
TRANSPORT MODES
=========================================
*/

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

/*
=========================================
SHIPMENT STATUSES
=========================================
*/

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

/*
=========================================
FIELD ICON
=========================================
*/

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

/*
=========================================
FORMAT STATUS
=========================================
*/

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

/*
=========================================
COMPONENT
=========================================
*/

export default function ShipmentInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          {/* Header Icon */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>

          {/* Header Text */}

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Shipment Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Provide the basic details for this shipment.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* =====================================
              SHIPMENT DATE
          ===================================== */}

          <FormField
            control={form.control}
            name="shipmentDate"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Shipment Date
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CalendarDays className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Date the shipment was created or scheduled.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              TRANSPORT MODE
          ===================================== */}

          <FormField
            control={form.control}
            name="transportMode"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Transport Mode
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Truck className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select transport mode" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {transportModes.map(
                          (mode) => (
                            <SelectItem
                              key={mode.value}
                              value={mode.value}
                            >
                              {mode.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Select how the shipment will be transported.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              STATUS
          ===================================== */}

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CircleDot className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {shipmentStatuses.map(
                          (status) => (
                            <SelectItem
                              key={status}
                              value={status}
                            >
                              {formatStatus(status)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Current status of the shipment.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================================
            INFORMATION NOTE
        ========================================= */}

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Truck className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">
              Shipment Details
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Select the appropriate transport mode and
              current shipment status. These details can
              be updated as the shipment progresses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}