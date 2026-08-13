import {
  CalendarDays,
  Globe2,
  MapPin,
  Ship,
  Truck,
} from "lucide-react";

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

export default function ShippingInformation({
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
            <Ship className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Shipping Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Destination, logistics and shipment schedule.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          ORIGIN INFORMATION
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
          {/* Origin Country */}

          <FormField
            control={form.control}
            name="originCountry"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Origin Country
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Globe2 className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Nigeria"
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Origin City */}

          <FormField
            control={form.control}
            name="originCity"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Origin City
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <MapPin className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Lagos"
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pickup Address */}

          <FormField
            control={form.control}
            name="pickupAddress"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Pickup Address
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <MapPin className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Warehouse Address"
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pickup Date */}

          <FormField
            control={form.control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Pickup Date
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CalendarDays className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
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
                              ? new Date(
                                  e.target.value
                                ).toISOString()
                              : ""
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================================
            DESTINATION INFORMATION
        ========================================= */}

        <div className="mt-8 border-t border-slate-100 pt-8">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Destination Details
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Provide the final destination and port information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Destination Country */}

            <FormField
              control={form.control}
              name="destinationCountry"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                    Destination Country
                  </FormLabel>

                  <div className="flex min-w-0 items-center gap-3">
                    <FieldIcon>
                      <Globe2 className="h-4 w-4" />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="United Kingdom"
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Destination City */}

            <FormField
              control={form.control}
              name="destinationCity"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                    Destination City
                  </FormLabel>

                  <div className="flex min-w-0 items-center gap-3">
                    <FieldIcon>
                      <MapPin className="h-4 w-4" />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="London"
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Port of Loading */}

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
                      <Ship className="h-4 w-4" />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="Apapa Port"
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Port of Discharge */}

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
                      <Ship className="h-4 w-4" />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="Felixstowe Port"
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Destination Port */}

            <FormField
              control={form.control}
              name="destinationPort"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                    Destination Port
                  </FormLabel>

                  <div className="flex min-w-0 items-center gap-3">
                    <FieldIcon>
                      <MapPin className="h-4 w-4" />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="Final Port"
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shipping Line */}

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

                    <div className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="Maersk"
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* =========================================
            SHIPPING SCHEDULE
        ========================================= */}

        <div className="mt-8 border-t border-slate-100 pt-8">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Shipping Schedule
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Specify the transport mode and expected shipment date.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Transport Mode */}

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
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        onValueChange={(value) =>
                          field.onChange(value || undefined)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
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
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Incoterm */}

            <FormField
              control={form.control}
              name="incoterm"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                    Incoterm
                  </FormLabel>

                  <div className="flex min-w-0 items-center gap-3">
                    <FieldIcon>
                      <FileTextIcon />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <FormControl>
                        <Input
                          placeholder="FOB"
                          {...field}
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : ""
                          }
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Shipment Date */}

            <FormField
              control={form.control}
              name="expectedShipmentDate"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                    Expected Shipment Date
                  </FormLabel>

                  <div className="flex min-w-0 items-center gap-3">
                    <FieldIcon>
                      <CalendarDays className="h-4 w-4" />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
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
                                ? new Date(
                                    e.target.value
                                  ).toISOString()
                                : ""
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="h-11 w-full border-slate-200 bg-white"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* =========================================
            DELIVERY
        ========================================= */}

        <div className="mt-8 border-t border-slate-100 pt-8">
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Delivery Address
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <MapPin className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Final Delivery Address"
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
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

function FileTextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}