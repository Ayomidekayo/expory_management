import { useEffect } from "react";
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
  CreateTransitInput,
} from "../../../validations/transit.validation";

import {
  useShipment,
} from "../../../hooks/shipments/useShipment";

interface Props {
  form: UseFormReturn<CreateTransitInput>;
}

export default function TransitInformation({
  form,
}: Props) {

  const shipmentId =
    form.watch("shipmentId");

  const {
    data: shipment,
  } = useShipment(shipmentId);

  const currentShipment =
    shipment?.data;

  /*
  ----------------------------------------
  Auto Populate Origin & Destination
  ----------------------------------------
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

  }, [
    currentShipment,
    form,
  ]);

  return (

    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">

          Transit Information

        </h2>

        <p className="text-sm text-muted-foreground">

          Enter transport and routing details.

        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Origin */}

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Origin

              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Enter Origin"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Destination */}

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Destination

              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Enter Destination"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Transport Mode */}

        <FormField
          control={form.control}
          name="transportMode"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Transport Mode

              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue />

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

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Transporter */}

        <FormField
          control={form.control}
          name="transporter"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Transporter

              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Transport Company"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Transit Invoice */}

        <FormField
          control={form.control}
          name="transitInvoice"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Transit Invoice

              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Invoice Number"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Agent Number */}

        <FormField
          control={form.control}
          name="agentNumber"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Agent Number

              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Agent Number"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* Exporter Number */}

        <FormField
          control={form.control}
          name="exporterNumber"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                Exporter Number

              </FormLabel>

              <FormControl>

                <Input
                  placeholder="Exporter Number"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

        {/* WIB Number */}

        <FormField
          control={form.control}
          name="wibNumber"
          render={({ field }) => (

            <FormItem>

              <FormLabel>

                WIB Number

              </FormLabel>

              <FormControl>

                <Input
                  placeholder="WIB Number"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>

          )}
        />

      </div>

    </div>

  );

}