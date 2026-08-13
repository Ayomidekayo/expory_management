import { useEffect } from "react";
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

import { Input } from "../../ui/input";

import {
  Package,
  Building2,
  UserRound,
  Truck,
  Ship,
  FileCheck2,
  MapPin,
  ClipboardList,
} from "lucide-react";

import type { CreatePackingListInput } from "../../../validations/packing-list.validation";
import { useShipment } from "../../../hooks/shipments/useShipment";
import { useShipments } from "../../../hooks/shipments/useShipments";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
}

export default function ShipmentInformation({
  form,
}: Props) {
  const shipmentId = form.watch("shipmentId");

  const { data: shipments } = useShipments();

  const { data: shipment } = useShipment(shipmentId);

  const currentShipment = shipment?.data;

  useEffect(() => {
    if (!currentShipment) return;

    if (!form.getValues("packageType")) {
      form.setValue(
        "packageType",
        currentShipment.allocation?.packageType ?? ""
      );
    }
  }, [currentShipment, form]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Package className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Shipment Information
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Select an existing shipment to associate with this
              packing list.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <FormField
          control={form.control}
          name="shipmentId"
          render={({ field }) => (
            <FormItem className="w-full max-w-2xl">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Shipment
              </FormLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="h-11 w-full border-slate-200 bg-white shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select shipment" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="max-h-72 w-[var(--radix-select-trigger-width)] min-w-[280px] max-w-[calc(100vw-2rem)]">
                  {shipments?.data?.length ? (
                    shipments.data.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="py-2.5"
                      >
                        <span className="font-medium">
                          {item.shipmentNumber}
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-6 text-center text-sm text-slate-500">
                      No shipments available.
                    </div>
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Selected Shipment */}
        {currentShipment && (
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
            {/* Selected shipment header */}
            <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Selected Shipment
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-slate-900">
                    {currentShipment.shipmentNumber}
                  </h3>
                </div>

                <div className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                  {currentShipment.status?.replaceAll(
                    "_",
                    " "
                  )}
                </div>
              </div>
            </div>

            {/* Shipment details */}
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
              <InfoField
                icon={<Building2 className="h-4 w-4" />}
                label="Client"
                value={
                  currentShipment.client?.companyName
                }
              />

              <InfoField
                icon={<UserRound className="h-4 w-4" />}
                label="Exporter"
                value={currentShipment.exporter?.name}
              />

              <InfoField
                icon={<UserRound className="h-4 w-4" />}
                label="Consignee"
                value={
                  currentShipment.consignee?.name
                }
              />

              <InfoField
                icon={<ClipboardList className="h-4 w-4" />}
                label="Shipment Number"
                value={
                  currentShipment.shipmentNumber
                }
              />

              <InfoField
                icon={<Truck className="h-4 w-4" />}
                label="Transport Mode"
                value={currentShipment.transportMode}
              />

              <InfoField
                icon={<Ship className="h-4 w-4" />}
                label="Shipping Line"
                value={
                  currentShipment.shippingLine
                }
              />

              <InfoField
                icon={<Ship className="h-4 w-4" />}
                label="Vessel Name"
                value={currentShipment.vesselName}
              />

              <InfoField
                icon={<FileCheck2 className="h-4 w-4" />}
                label="XF Number"
                value={currentShipment.xfNumber}
              />

              <InfoField
                icon={<FileCheck2 className="h-4 w-4" />}
                label="NXP Number"
                value={currentShipment.nxpNumber}
              />

              <InfoField
                icon={<FileCheck2 className="h-4 w-4" />}
                label="CCI Number"
                value={currentShipment.cciNumber}
              />

              <InfoField
                icon={<MapPin className="h-4 w-4" />}
                label="Port of Loading"
                value={
                  currentShipment.portOfLoading
                }
              />

              <InfoField
                icon={<MapPin className="h-4 w-4" />}
                label="Port of Discharge"
                value={
                  currentShipment.portOfDischarge
                }
              />

              <InfoField
                icon={<ClipboardList className="h-4 w-4" />}
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

/*
=====================================
Information Field
=====================================
*/

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p
            className="mt-1 truncate text-sm font-semibold text-slate-800"
            title={value || "Not provided"}
          >
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}