import type { UseFormReturn } from "react-hook-form";

import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
} from "lucide-react";

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
COMPONENT
=========================================
*/

export default function ShippingSchedule({
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
            <CalendarDays className="h-5 w-5" />
          </div>

          {/* Header Text */}

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Shipping Schedule
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Manage the planned and actual shipment dates.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* =====================================
              EXPECTED DEPARTURE
          ===================================== */}

          <FormField
            control={form.control}
            name="expectedDeparture"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Expected Departure
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CalendarClock className="h-4 w-4" />
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
                  Planned date for shipment departure.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              EXPECTED ARRIVAL
          ===================================== */}

          <FormField
            control={form.control}
            name="expectedArrival"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Expected Arrival
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CalendarClock className="h-4 w-4" />
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
                  Planned date for shipment arrival.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              ACTUAL DEPARTURE
          ===================================== */}

          <FormField
            control={form.control}
            name="actualDeparture"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Actual Departure
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CalendarCheck2 className="h-4 w-4" />
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
                  Record the date the shipment actually departed.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              ACTUAL ARRIVAL
          ===================================== */}

          <FormField
            control={form.control}
            name="actualArrival"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Actual Arrival
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CalendarCheck2 className="h-4 w-4" />
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
                  Record the date the shipment actually arrived.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================================
            SCHEDULE INFORMATION
        ========================================= */}

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <CalendarDays className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">
              Shipping Schedule
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Expected dates represent the planned schedule,
              while actual dates should be updated when the
              shipment departs and arrives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}