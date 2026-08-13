import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  Building2,
  FileText,
  Hash,
  Landmark,
  Ship,
  UserRound,
  Users,
} from "lucide-react";

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
  CreateInvoiceInput,
  CreateInvoiceOutput,
} from "../../../validations/invoice.validation";

import { useShipments } from "../../../hooks/shipments/useShipments";
import { useShipment } from "../../../hooks/shipments/useShipment";

interface Props {
  form: UseFormReturn<
    CreateInvoiceInput,
    undefined,
    CreateInvoiceOutput
  >;
}

/* =========================================
   FIELD ICON
========================================= */

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

/* =========================================
   SHIPMENT DETAIL
========================================= */

function ShipmentDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm">
          {icon}
        </div>

        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>

      <p
        className="truncate text-sm font-semibold text-slate-900"
        title={value || "Not provided"}
      >
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function ShipmentInformation({
  form,
}: Props) {
  const shipmentId = form.watch("shipmentId");

  /* =========================================
     ALL SHIPMENTS

     A shipment can have multiple invoices,
     so we intentionally do NOT filter out
     shipments that already have invoices.
  ========================================= */

  const { data: shipments } = useShipments({
    page: 1,
    limit: 100,
  });

  /* =========================================
     SELECTED SHIPMENT
  ========================================= */

  const { data: shipment } = useShipment(shipmentId);

  const currentShipment = shipment?.data;

  /* =========================================
     AUTO POPULATE INCOTERM
  ========================================= */

  useEffect(() => {
    if (!currentShipment) return;

    if (!form.getValues("incoterm")) {
      form.setValue(
        "incoterm",
        currentShipment.allocation?.incoterm ?? ""
      );
    }
  }, [currentShipment, form]);

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

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Shipment Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Select the shipment associated with this invoice.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="p-6">
        {/* =====================================
            SHIPMENT SELECT
        ===================================== */}

        <FormField
          control={form.control}
          name="shipmentId"
          render={({ field }) => (
            <FormItem className="max-w-2xl">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Shipment
              </FormLabel>

              <div className="flex min-w-0 items-center gap-3">
                <FieldIcon>
                  <Ship className="h-4 w-4" />
                </FieldIcon>

                <div className="min-w-0 flex-1">
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 w-full border-slate-200 bg-white shadow-sm">
                        <SelectValue placeholder="Select shipment" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {shipments?.data?.map((shipment) => (
                        <SelectItem
                          key={shipment.id}
                          value={shipment.id}
                        >
                          {shipment.shipmentNumber}
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

        {/* =========================================
            SELECTED SHIPMENT DETAILS
        ========================================= */}

        {currentShipment && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Shipment Details
                </h3>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Information retrieved from the selected shipment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Shipment Number */}

              <ShipmentDetail
                icon={<FileText className="h-4 w-4" />}
                label="Shipment Number"
                value={currentShipment.shipmentNumber}
              />

              {/* Client */}

              <ShipmentDetail
                icon={<Building2 className="h-4 w-4" />}
                label="Client"
                value={currentShipment.client?.companyName}
              />

              {/* Exporter */}

              <ShipmentDetail
                icon={<UserRound className="h-4 w-4" />}
                label="Exporter"
                value={currentShipment.exporter?.name}
              />

              {/* Consignee */}

              <ShipmentDetail
                icon={<UserRound className="h-4 w-4" />}
                label="Consignee"
                value={currentShipment.consignee?.name}
              />

              {/* Transport Mode */}

              <ShipmentDetail
                icon={<Ship className="h-4 w-4" />}
                label="Transport Mode"
                value={currentShipment.transportMode}
              />

              {/* Shipping Line */}

              <ShipmentDetail
                icon={<Landmark className="h-4 w-4" />}
                label="Shipping Line"
                value={currentShipment.shippingLine}
              />

              {/* XF Number */}

              <ShipmentDetail
                icon={<Hash className="h-4 w-4" />}
                label="XF Number"
                value={currentShipment.xfNumber}
              />

              {/* NXP Number */}

              <ShipmentDetail
                icon={<Hash className="h-4 w-4" />}
                label="NXP Number"
                value={currentShipment.nxpNumber}
              />

              {/* CCI Number */}

              <ShipmentDetail
                icon={<Hash className="h-4 w-4" />}
                label="CCI Number"
                value={currentShipment.cciNumber}
              />

              {/* Allocation */}

              <ShipmentDetail
                icon={<FileText className="h-4 w-4" />}
                label="Allocation Number"
                value={
                  currentShipment.allocation
                    ?.allocationNumber
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}