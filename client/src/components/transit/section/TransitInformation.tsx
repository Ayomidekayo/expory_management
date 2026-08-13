import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  ArrowRight,
  FileText,
  MapPin,
  Truck,
  UserRound,
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

import type { CreateTransitInput } from "../../../validations/transit.validation";

import { useShipment } from "../../../hooks/shipments/useShipment";

interface Props {
  form: UseFormReturn<CreateTransitInput>;
}

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

export default function TransitInformation({
  form,
}: Props) {
  const shipmentId = form.watch("shipmentId");

  const { data: shipment } = useShipment(shipmentId);

  const currentShipment = shipment?.data;

  /*
  =====================================
  Auto Populate Origin & Destination
  =====================================
  */

  useEffect(() => {
    if (!currentShipment) return;

    if (!form.getValues("origin")) {
      form.setValue(
        "origin",
        currentShipment.portOfLoading ?? ""
      );
    }

    if (!form.getValues("destination")) {
      form.setValue(
        "destination",
        currentShipment.portOfDischarge ?? ""
      );
    }
  }, [currentShipment, form]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Transit Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Enter transport, routing and transit documentation details.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          FORM CONTENT
      ===================================== */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* =================================
              ORIGIN
          ================================= */}

          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Origin
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <MapPin className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter origin"
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================
              DESTINATION
          ================================= */}

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
                    <ArrowRight className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter destination"
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================
              TRANSPORT MODE
          ================================= */}

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
                        <SelectItem value="ROAD">
                          Road
                        </SelectItem>

                        <SelectItem value="SEA">
                          Sea
                        </SelectItem>

                        <SelectItem value="AIR">
                          Air
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================
              TRANSPORTER
          ================================= */}

          <FormField
            control={form.control}
            name="transporter"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Transporter
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Truck className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Transport company"
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================
              TRANSIT INVOICE
          ================================= */}

          <FormField
            control={form.control}
            name="transitInvoice"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Transit Invoice
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <FileText className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Invoice number"
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================
              AGENT NUMBER
          ================================= */}

          <FormField
            control={form.control}
            name="agentNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Agent Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <UserRound className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Agent number"
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================
              EXPORTER NUMBER
          ================================= */}

          <FormField
            control={form.control}
            name="exporterNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Exporter Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <UserRound className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Exporter number"
                        {...field}
                        value={field.value ?? ""}
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================
              WIB NUMBER
          ================================= */}

          <FormField
            control={form.control}
            name="wibNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  WIB Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <FileText className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="WIB number"
                        {...field}
                        value={field.value ?? ""}
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

        {/* =====================================
            SELECTED SHIPMENT DETAILS
        ===================================== */}

        {currentShipment && (
          <div className="mt-8 border-t border-slate-100 pt-7">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Truck className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Shipment Reference
                </h3>

                <p className="text-xs text-slate-500">
                  Information from the selected shipment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div className="min-w-0">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Shipment Number
                </label>

                <Input
                  readOnly
                  value={
                    currentShipment.shipmentNumber
                  }
                  className="h-11 w-full border-slate-200 bg-slate-50 font-medium text-slate-900"
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Shipping Line
                </label>

                <Input
                  readOnly
                  value={
                    currentShipment.shippingLine ?? ""
                  }
                  className="h-11 w-full border-slate-200 bg-slate-50"
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Port of Loading
                </label>

                <Input
                  readOnly
                  value={
                    currentShipment.portOfLoading ?? ""
                  }
                  className="h-11 w-full border-slate-200 bg-slate-50"
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Port of Discharge
                </label>

                <Input
                  readOnly
                  value={
                    currentShipment.portOfDischarge ?? ""
                  }
                  className="h-11 w-full border-slate-200 bg-slate-50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}