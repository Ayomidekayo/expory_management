import type { UseFormReturn } from "react-hook-form";

import {
  ClipboardList,
  Ship,
  Sailboat,
  Hash,
  MapPin,
  Navigation,
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

export default function BookingInformation({
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
              Booking Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Provide the shipping line, booking,
              vessel, voyage, and port details.
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
              BOOKING NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="bookingNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Booking Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Hash className="h-4 w-4" />
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
                  Shipping booking reference number.
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
                  Carrier responsible for the shipment.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              VESSEL NAME
          ===================================== */}

          <FormField
            control={form.control}
            name="vesselName"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Vessel Name
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Sailboat className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. MSC OSCAR"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Name of the vessel carrying the shipment.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              VOYAGE NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="voyageNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Voyage Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Hash className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. VOY-001"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Vessel voyage or sailing reference.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              PORT OF LOADING
          ===================================== */}

          <FormField
            control={form.control}
            name="portOfLoading"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Port of Loading
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
                  Port where the shipment is loaded.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              PORT OF DISCHARGE
          ===================================== */}

          <FormField
            control={form.control}
            name="portOfDischarge"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Port of Discharge
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Navigation className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      placeholder="e.g. Felixstowe Port"
                      {...field}
                      value={field.value ?? ""}
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Port where the shipment will be discharged.
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
            <ClipboardList className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              Booking Details
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Make sure the booking number, vessel,
              voyage, and port information match the
              shipping documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}