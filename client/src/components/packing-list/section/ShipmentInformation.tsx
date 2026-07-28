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

import type { CreatePackingListInput } from "../../../validations/packing-list.validation";

import { useAvailableShipments } from "../../../hooks/shipments/useAvailableShipments";
import { useShipment } from "../../../hooks/shipments/useShipment";
import { useShipments } from "../../../hooks/shipments/useShipments";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
}

export default function ShipmentInformation({
  form,
}: Props) {
  const shipmentId = form.watch("shipmentId");

  const { data: shipments } =
    useShipments();
console.log("AVAILABLE SHIPMENTS");
console.log(shipments);
  const { data: shipment } =
    useShipment(shipmentId);

  const currentShipment =
    shipment?.data;

  useEffect(() => {
    if (!currentShipment) return;

    if (!form.getValues("packageType")) {
      form.setValue(
        "packageType",
        currentShipment.allocation?.packageType ??
          ""
      );
    }
  }, [currentShipment, form]);

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Shipment Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Select an existing shipment.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <FormField
          control={form.control}
          name="shipmentId"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Shipment
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>

                  <SelectTrigger>

                    <SelectValue placeholder="Select Shipment" />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  {shipments?.data.map(
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

              <FormMessage />

            </FormItem>
          )}
        />

      </div>

      {currentShipment && (

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          <Input
            readOnly
            value={
              currentShipment.client?.companyName ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.exporter?.name ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.consignee?.name ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.shipmentNumber
            }
          />

          <Input
            readOnly
            value={
              currentShipment.transportMode
            }
          />

          <Input
            readOnly
            value={
              currentShipment.shippingLine ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.vesselName ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.xfNumber ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.nxpNumber ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.cciNumber ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.portOfLoading ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.portOfDischarge ??
              ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.allocation
                ?.allocationNumber ?? ""
            }
          />

        </div>

      )}

    </div>
  );
}