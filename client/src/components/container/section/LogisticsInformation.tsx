import type { UseFormReturn } from "react-hook-form";

import {
  MapPin,
  Navigation,
  Ship,
  ClipboardList,
  Settings2,
} from "lucide-react";

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

export default function LogisticsInformation({
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
            <Navigation className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Logistics Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Provide the loading, destination, shipping,
              and container logistics details.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* =====================================
              LOADING LOCATION
          ===================================== */}

          <FormField
            control={form.control}
            name="loadingLocation"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Loading Location
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <MapPin className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. Apapa Port"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Location where the container will be loaded.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              DESTINATION
          ===================================== */}

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Destination
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Navigation className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. Shanghai, China"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Final destination of the container.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              SHIPPING LINE
          ===================================== */}

          <FormField
            control={form.control}
            name="shippingLine"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Shipping Line
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Ship className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. Maersk"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Carrier or shipping company.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              BOOKING REFERENCE
          ===================================== */}

          <FormField
            control={form.control}
            name="bookingReference"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Booking Reference
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <ClipboardList className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. BK-2026-0001"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Reference number provided for the booking.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              CONTAINER CONDITION
          ===================================== */}

          <FormField
            control={form.control}
            name="containerCondition"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Container Condition
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Settings2 className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. Excellent"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Current physical condition of the container.
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
            <Navigation className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              Logistics Details
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Ensure the loading location, destination,
              shipping line, and booking reference match
              the shipment documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}