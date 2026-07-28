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

import { useShipments } from "../../../hooks/shipments/useShipments";
import { useContainers } from "../../../hooks/container/useContainers";
import { usePackingLists } from "../../../hooks/packingList/usePackingLists";
import { useTransits } from "../../../hooks/transit/useTransits";


import type {
  CreateDocumentInput,
} from "../../../validations/document.validation";
import { useInvoices } from "../../../hooks/invoices/useInvoices";

interface Props {
  form: UseFormReturn<CreateDocumentInput>;
}

export default function RelatedRecordInformation({
  form,
}: Props) {
  const shipmentId =
    form.watch("shipmentId");

  const attachTo =
    form.watch("attachTo");

  /*
  =====================================
  Load Data
  =====================================
  */

  const { data: shipments } =
    useShipments();

  const { data: containers } =
    useContainers({
      shipmentId,
    });

  const { data: packingLists } =
    usePackingLists({
      shipmentId,
    });

  const { data: transits } =
    useTransits({
      shipmentId,
    });

  const { data: invoices } =
    useInvoices({
      shipmentId,
    });

  /*
  =====================================
  Reset child records only
  =====================================
  */

  useEffect(() => {
    if (!shipmentId) return;

    form.resetField("containerId");
    form.resetField("packingListId");
    form.resetField("transitId");
    form.resetField("invoiceId");
  }, [shipmentId, form]);

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Related Record
        </h2>

        <p className="text-sm text-muted-foreground">
          Select the shipment, then choose
          what this document belongs to.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Shipment */}

        <FormField
          control={form.control}
          name="shipmentId"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Shipment
              </FormLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={
                  !!field.value
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shipment" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>

                  {shipments?.data?.map(
                    (shipment) => (
                      <SelectItem
                        key={shipment.id}
                        value={shipment.id}
                      >
                        {
                          shipment.shipmentNumber
                        }
                      </SelectItem>
                    )
                  )}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Attach To */}

        <FormField
          control={form.control}
          name="attachTo"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Attach To
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);

                  // Don't reset shipment

                  form.resetField(
                    "containerId"
                  );

                  form.resetField(
                    "packingListId"
                  );

                  form.resetField(
                    "transitId"
                  );

                  form.resetField(
                    "invoiceId"
                  );
                }}
              >

                <FormControl>

                  <SelectTrigger>
                    <SelectValue placeholder="Select Record Type" />
                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  <SelectItem value="SHIPMENT">
                    Shipment
                  </SelectItem>

                  <SelectItem value="CONTAINER">
                    Container
                  </SelectItem>

                  <SelectItem value="PACKING_LIST">
                    Packing List
                  </SelectItem>

                  <SelectItem value="TRANSIT">
                    Transit
                  </SelectItem>

                  <SelectItem value="INVOICE">
                    Invoice
                  </SelectItem>

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Container */}

        {attachTo === "CONTAINER" && (
          <FormField
            control={form.control}
            name="containerId"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Container
                </FormLabel>

                <Select
                  disabled={!shipmentId}
                  value={
                    field.value ?? ""
                  }
                  onValueChange={
                    field.onChange
                  }
                >

                  <FormControl>

                    <SelectTrigger>

                      <SelectValue
                        placeholder={
                          shipmentId
                            ? "Select Container"
                            : "Select Shipment First"
                        }
                      />

                    </SelectTrigger>

                  </FormControl>

                  <SelectContent>

                    {containers?.data?.map(
                      (container) => (
                        <SelectItem
                          key={
                            container.id
                          }
                          value={
                            container.id
                          }
                        >
                          {
                            container.containerNumber
                          }
                        </SelectItem>
                      )
                    )}

                  </SelectContent>

                </Select>

                <FormMessage />

              </FormItem>
            )}
          />
        )}

        {/* Packing List */}

        {attachTo ===
          "PACKING_LIST" && (
          <FormField
            control={form.control}
            name="packingListId"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Packing List
                </FormLabel>

                <Select
                  disabled={!shipmentId}
                  value={
                    field.value ?? ""
                  }
                  onValueChange={
                    field.onChange
                  }
                >

                  <FormControl>

                    <SelectTrigger>

                      <SelectValue
                        placeholder={
                          shipmentId
                            ? "Select Packing List"
                            : "Select Shipment First"
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
                          {
                            packing.packingListNumber
                          }
                        </SelectItem>
                      )
                    )}

                  </SelectContent>

                </Select>

                <FormMessage />

              </FormItem>
            )}
          />
        )}

        {/* Transit */}

        {attachTo ===
          "TRANSIT" && (
          <FormField
            control={form.control}
            name="transitId"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Transit
                </FormLabel>

                <Select
                  disabled={!shipmentId}
                  value={
                    field.value ?? ""
                  }
                  onValueChange={
                    field.onChange
                  }
                >

                  <FormControl>

                    <SelectTrigger>

                      <SelectValue
                        placeholder={
                          shipmentId
                            ? "Select Transit"
                            : "Select Shipment First"
                        }
                      />

                    </SelectTrigger>

                  </FormControl>

                  <SelectContent>

                    {transits?.data?.map(
                      (transit) => (
                        <SelectItem
                          key={
                            transit.id
                          }
                          value={
                            transit.id
                          }
                        >
                          {
                            transit.transitNumber
                          }
                        </SelectItem>
                      )
                    )}

                  </SelectContent>

                </Select>

                <FormMessage />

              </FormItem>
            )}
          />
        )}

        {/* Invoice */}

        {attachTo ===
          "INVOICE" && (
          <FormField
            control={form.control}
            name="invoiceId"
            render={({ field }) => (
              <FormItem>

                <FormLabel>
                  Invoice
                </FormLabel>

                <Select
                  disabled={!shipmentId}
                  value={
                    field.value ?? ""
                  }
                  onValueChange={
                    field.onChange
                  }
                >

                  <FormControl>

                    <SelectTrigger>

                      <SelectValue
                        placeholder={
                          shipmentId
                            ? "Select Invoice"
                            : "Select Shipment First"
                        }
                      />

                    </SelectTrigger>

                  </FormControl>

                  <SelectContent>

                    {invoices?.data?.map(
                      (invoice) => (
                        <SelectItem
                          key={
                            invoice.id
                          }
                          value={
                            invoice.id
                          }
                        >
                          {
                            invoice.invoiceNumber
                          }
                        </SelectItem>
                      )
                    )}

                  </SelectContent>

                </Select>

                <FormMessage />

              </FormItem>
            )}
          />
        )}

      </div>

    </div>
  );
}