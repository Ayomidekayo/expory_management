import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  ClipboardList,
  FileText,
  MapPin,
  Package,
  Ship,
  Truck,
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

import { Input } from "../../ui/input";

import type {
  CreateContainerInput,
} from "../../../validations/container.validation";

import {
  useShipment,
} from "../../../hooks/shipments/useShipment";

import {
  usePackingLists,
} from "../../../hooks/packingList/usePackingLists";

import {
  useShipments,
} from "../../../hooks/shipments/useShipments";

import {
  usePackingList,
} from "../../../hooks/packingList/usePackingList";

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

/*
=========================================
READ ONLY INFORMATION FIELD
=========================================
*/

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-medium text-slate-700">
        {label}
      </p>

      <div className="flex min-w-0 items-center gap-3">
        <FieldIcon>
          {icon}
        </FieldIcon>

        <Input
          readOnly
          value={value ?? ""}
          placeholder={`No ${label.toLowerCase()} provided`}
          className="h-11 w-full border-slate-200 bg-slate-50 text-slate-700"
        />
      </div>
    </div>
  );
}

export default function ShipmentInformation({
  form,
}: Props) {
  /*
  =========================================
  SELECTED SHIPMENT
  =========================================
  */

  const shipmentId =
    form.watch("shipmentId");

  /*
  =========================================
  SELECTED PACKING LIST
  =========================================
  */

  const packingListId =
    form.watch("packingListId");

  /*
  =========================================
  PACKING LIST DETAILS
  =========================================
  */

  const {
    data: packingList,
  } = usePackingList(
    packingListId || ""
  );

  const currentPackingList =
    packingList;

  /*
  =========================================
  AVAILABLE SHIPMENTS
  =========================================
  */

  const {
    data: shipments,
  } = useShipments();

  /*
  =========================================
  SELECTED SHIPMENT DETAILS
  =========================================
  */

  const {
    data: shipment,
  } = useShipment(shipmentId);

  const currentShipment =
    shipment?.data;

  /*
  =========================================
  PACKING LISTS FOR SELECTED SHIPMENT
  =========================================
  */

  const {
    data: packingLists,
  } = usePackingLists({
    shipmentId,
  });

  /*
  =========================================
  AUTO-SELECT PACKING LIST
  =========================================
  */

  useEffect(() => {
    if (
      packingLists?.data?.length === 1
    ) {
      form.setValue(
        "packingListId",
        packingLists.data[0].id
      );
    }
  }, [packingLists, form]);

  /*
  =========================================
  AUTO-FILL SHIPMENT INFORMATION
  =========================================
  */

  useEffect(() => {
    if (!currentShipment) return;

    /*
    Shipping line
    */

    form.setValue(
      "shippingLine",
      currentShipment.shippingLine ?? ""
    );

    /*
    Destination
    */

    if (
      !form.getValues("destination")
    ) {
      form.setValue(
        "destination",
        currentShipment.portOfDischarge ??
          ""
      );
    }

    /*
    Loading location
    */

    if (
      !form.getValues("loadingLocation")
    ) {
      form.setValue(
        "loadingLocation",
        currentShipment.portOfLoading ??
          ""
      );
    }
  }, [currentShipment, form]);

  /*
  =========================================
  AUTO-FILL WEIGHTS FROM PACKING LIST
  =========================================
  */

  useEffect(() => {
    if (!currentPackingList) return;

    form.setValue(
      "grossWeight",
      Number(
        currentPackingList.grossWeight ?? 0
      )
    );

    form.setValue(
      "netWeight",
      Number(
        currentPackingList.netWeight ?? 0
      )
    );
  }, [currentPackingList, form]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Shipment Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Select the shipment and packing
              list associated with this container.
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
                    <Truck className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value);

                        /*
                        Reset packing list when
                        shipment changes.
                        */

                        form.setValue(
                          "packingListId",
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
              PACKING LIST
          ===================================== */}

          <FormField
            control={form.control}
            name="packingListId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Packing List
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <ClipboardList className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      disabled={!shipmentId}
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(
                          value || undefined
                        );
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue
                            placeholder={
                              shipmentId
                                ? "Select packing list"
                                : "Select shipment first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {packingLists?.data?.map(
                          (packing) => (
                            <SelectItem
                              key={packing.id}
                              value={packing.id}
                            >
                              {packing.packingListNumber}
                              {" • "}
                              {packing.packageType}
                              {" • "}
                              {packing.totalPackages}{" "}
                              Packages
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
          <div className="mt-8">
            {/* Section heading */}

            <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
              <FileText className="h-4 w-4 text-primary" />

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Shipment Details
                </h3>

                <p className="text-xs text-slate-500">
                  Information pulled from the selected
                  shipment.
                </p>
              </div>
            </div>

            {/* Details */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <InfoField
                label="Client"
                value={
                  currentShipment.client
                    ?.companyName
                }
                icon={
                  <FileText className="h-4 w-4" />
                }
              />

              <InfoField
                label="Exporter"
                value={
                  currentShipment.exporter?.name
                }
                icon={
                  <FileText className="h-4 w-4" />
                }
              />

              <InfoField
                label="Consignee"
                value={
                  currentShipment.consignee?.name
                }
                icon={
                  <FileText className="h-4 w-4" />
                }
              />

              <InfoField
                label="Shipment Number"
                value={
                  currentShipment.shipmentNumber
                }
                icon={
                  <Truck className="h-4 w-4" />
                }
              />

              <InfoField
                label="Transport Mode"
                value={
                  currentShipment.transportMode
                }
                icon={
                  <Truck className="h-4 w-4" />
                }
              />

              <InfoField
                label="Shipping Line"
                value={
                  currentShipment.shippingLine
                }
                icon={
                  <Ship className="h-4 w-4" />
                }
              />

              <InfoField
                label="Vessel Name"
                value={
                  currentShipment.vesselName
                }
                icon={
                  <Ship className="h-4 w-4" />
                }
              />

              <InfoField
                label="Port of Loading"
                value={
                  currentShipment.portOfLoading
                }
                icon={
                  <MapPin className="h-4 w-4" />
                }
              />

              <InfoField
                label="Port of Discharge"
                value={
                  currentShipment.portOfDischarge
                }
                icon={
                  <MapPin className="h-4 w-4" />
                }
              />
            </div>
          </div>
        )}

        {/* =========================================
            PACKING LIST SUMMARY
        ========================================= */}

        {currentPackingList && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Packing List Selected
                </p>

                <p className="text-sm text-slate-500">
                  {currentPackingList.packingListNumber}
                  {" • "}
                  {currentPackingList.packageType}
                  {" • "}
                  {currentPackingList.totalPackages}{" "}
                  Packages
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}