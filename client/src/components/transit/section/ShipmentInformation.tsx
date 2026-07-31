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

export default function ShipmentInformation({
  form,
}: Props) {

  /*
  =====================================
  Watch Values
  =====================================
  */

  const shipmentId =
    form.watch("shipmentId");

  /*
  =====================================
  Shipments
  =====================================
  */

  const {
    data: shipments,
  } = useShipments();

  /*
  =====================================
  Shipment Details
  =====================================
  */

  const {
    data: shipment,
  } = useShipment(shipmentId);

  const currentShipment =
    shipment?.data;

  /*
  =====================================
  Containers
  =====================================
  */

  const {
    data: containers,
  } = useContainers({
    shipmentId,
  });

  /*
  =====================================
  Auto Select Container
  =====================================
  */

  useEffect(() => {

    if (
      containers?.data.length === 1
    ) {

      form.setValue(
        "containerId",
        containers.data[0].id
      );

    }

  }, [containers, form]);

  /*
  =====================================
  Auto Fill Transport Mode
  =====================================
  */

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

  }, [
    currentShipment,
    form,
  ]);

  return (

    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">

          Shipment Information

        </h2>

        <p className="text-sm text-muted-foreground">

          Select a shipment and its container.

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

        {/* Container */}

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

          {containers?.data.map(
            (container) => (

              <SelectItem
                key={container.id}
                value={container.id}
              >

                {container.containerNumber} •{" "}
                {container.containerType} •{" "}
                {container.containerSize}

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
              currentShipment.shipmentNumber
            }
          />

          <Input
            readOnly
            value={
              currentShipment.client
                ?.companyName ?? ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.exporter
                ?.name ?? ""
            }
          />

          <Input
            readOnly
            value={
              currentShipment.consignee
                ?.name ?? ""
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

        </div>

      )}

    </div>

  );

}