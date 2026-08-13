import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  Container,
  Ship,
  Truck,
  Building2,
  UserRound,
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
  CreateTransitInput,
  CreateTransitOutput,
} from "../../../validations/transit.validation";

import {
  useShipments,
} from "../../../hooks/shipments/useShipments";

import {
  useShipment,
} from "../../../hooks/shipments/useShipment";

import {
  useContainers,
} from "../../../hooks/container/useContainers";

interface Props {
  form: UseFormReturn<
    CreateTransitInput,
    undefined,
    CreateTransitOutput
  >;
}

/* =========================================
   Small Field Icon
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
   Readonly Shipment Detail
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
        title={value || "Not available"}
      >
        {value || "Not available"}
      </p>
    </div>
  );
}

export default function ShipmentInformation({
  form,
}: Props) {
  /* =========================================
     WATCH VALUES
  ========================================= */

  const shipmentId = form.watch("shipmentId");

  /* =========================================
     SHIPMENTS
  ========================================= */

  const { data: shipments } = useShipments();

  /* =========================================
     SELECTED SHIPMENT
  ========================================= */

  const { data: shipment } = useShipment(shipmentId);

  const currentShipment = shipment?.data;

  /* =========================================
     CONTAINERS
  ========================================= */

  const { data: containers } = useContainers({
    shipmentId,
  });

  /* =========================================
     AUTO SELECT CONTAINER
  ========================================= */

  useEffect(() => {
    if (containers?.data.length === 1) {
      form.setValue(
        "containerId",
        containers.data[0].id
      );
    }
  }, [containers, form]);

  /* =========================================
     AUTO FILL TRANSPORT MODE
  ========================================= */

  useEffect(() => {
    if (!currentShipment) return;

    if (
      currentShipment.transportMode === "ROAD" ||
      currentShipment.transportMode === "SEA" ||
      currentShipment.transportMode === "AIR"
    ) {
      form.setValue(
        "transportMode",
        currentShipment.transportMode
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

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Shipment Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Select the shipment and container for this transit.
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
              SHIPMENT
          ===================================== */}

          <FormField
            control={form.control}
            name="shipmentId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Shipment
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Ship className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : ""
                      }
                      onValueChange={(value) => {
                        field.onChange(value);

                        form.setValue(
                          "containerId",
                          ""
                        );
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select shipment" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {shipments?.data?.map(
                          (shipment) => (
                            <SelectItem
                              key={shipment.id}
                              value={shipment.id}
                            >
                              {shipment.shipmentNumber}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              CONTAINER
          ===================================== */}

          <FormField
            control={form.control}
            name="containerId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Container
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Container className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      disabled={!shipmentId}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue
                            placeholder={
                              shipmentId
                                ? "Select container"
                                : "Select shipment first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {containers?.data?.map(
                          (container) => (
                            <SelectItem
                              key={container.id}
                              value={container.id}
                            >
                              {container.containerNumber}
                              {" • "}
                              {container.containerType}
                              {" • "}
                              {container.containerSize}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================================
            SELECTED SHIPMENT DETAILS
        ========================================= */}

        {currentShipment && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Shipment Details
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Information retrieved from the selected shipment.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ShipmentDetail
                icon={<Ship className="h-4 w-4" />}
                label="Shipment Number"
                value={
                  currentShipment.shipmentNumber
                }
              />

              <ShipmentDetail
                icon={<Building2 className="h-4 w-4" />}
                label="Client"
                value={
                  currentShipment.client
                    ?.companyName
                }
              />

              <ShipmentDetail
                icon={<UserRound className="h-4 w-4" />}
                label="Exporter"
                value={
                  currentShipment.exporter?.name
                }
              />

              <ShipmentDetail
                icon={<UserRound className="h-4 w-4" />}
                label="Consignee"
                value={
                  currentShipment.consignee?.name
                }
              />

              <ShipmentDetail
                icon={<Truck className="h-4 w-4" />}
                label="Transport Mode"
                value={
                  currentShipment.transportMode
                }
              />

              <ShipmentDetail
                icon={<Ship className="h-4 w-4" />}
                label="Shipping Line"
                value={
                  currentShipment.shippingLine
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}