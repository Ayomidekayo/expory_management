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
  CreateContainerInput,
} from "../../../validations/container.validation";

import {
  useAvailableShipments,
} from "../../../hooks/shipments/useAvailableShipments";

import {
  useShipment,
} from "../../../hooks/shipments/useShipment";

import {
  usePackingLists,
} from "../../../hooks/packingList/usePackingLists";
import { useShipments } from "../../../hooks/shipments/useShipments";
import { usePackingList } from "../../../hooks/packingList/usePackingList";

interface Props {
  form: UseFormReturn<CreateContainerInput>;
}

export default function ShipmentInformation({
  form,
}: Props) {
   

  const shipmentId =
    form.watch("shipmentId");

  const packingListId =
    form.watch("packingListId");


    /*
-------------------------------------
Selected Packing List
-------------------------------------
*/

const {
  data: packingList,
} = usePackingList(
  packingListId || ""
);



const currentPackingList =
  packingList?.data;

  /*
  -------------------------------------
  Available Shipments
  -------------------------------------
  */

  const {
    data: shipments,
  } = useShipments();

  /*
  -------------------------------------
  Selected Shipment
  -------------------------------------
  */

  const {
    data: shipment,
  } = useShipment(shipmentId);

  const currentShipment =
    shipment?.data;

  /*
  -------------------------------------
  Packing Lists
  -------------------------------------
  */

  const {
    data: packingLists,
  } = usePackingLists({
    shipmentId,
  });


  /*
-------------------------------------
Auto-select Packing List
-------------------------------------
*/

useEffect(() => {

  if (
    packingLists?.data.length === 1
  ) {

    form.setValue(
      "packingListId",
      packingLists.data[0].id
    );

  }

}, [packingLists, form]);
  /*
  -------------------------------------
  Auto-fill Shipping Line
  -------------------------------------
  */
/*
-------------------------------------
Auto-fill Shipment Information
-------------------------------------
*/

useEffect(() => {

  if (!currentShipment) return;

  form.setValue(
    "shippingLine",
    currentShipment.shippingLine ?? ""
  );

  if (!form.getValues("destination")) {

    form.setValue(
      "destination",
      currentShipment.portOfDischarge ?? ""
    );

  }

  if (!form.getValues("loadingLocation")) {

    form.setValue(
      "loadingLocation",
      currentShipment.portOfLoading ?? ""
    );

  }

}, [currentShipment, form]);

 /*
-------------------------------------
Auto-fill Shipment Information
-------------------------------------
*/

useEffect(() => {

  if (!currentShipment) return;

  form.setValue(
    "shippingLine",
    currentShipment.shippingLine ?? ""
  );

  if (!form.getValues("destination")) {

    form.setValue(
      "destination",
      currentShipment.portOfDischarge ?? ""
    );

  }

  if (!form.getValues("loadingLocation")) {

    form.setValue(
      "loadingLocation",
      currentShipment.portOfLoading ?? ""
    );

  }

}, [currentShipment, form]);

/*
-------------------------------------
Auto-fill From Packing List
-------------------------------------
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

    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">

          Shipment Information

        </h2>

        <p className="text-sm text-muted-foreground">

          Select the shipment and packing list.

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
                value={field.value}
                onValueChange={(value) => {

                  field.onChange(value);

                  form.setValue(
                    "packingListId",
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

        {/* Packing List */}

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
  value={field.value ?? ""}
  onValueChange={field.onChange}
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

  {packingLists?.data.map((packing) => (

    <SelectItem
      key={packing.id}
      value={packing.id}
    >

      {packing.packingListNumber}
      {" • "}
      {packing.packageType}
      {" • "}
      {packing.totalPackages} Packages

    </SelectItem>

  ))}

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

        </div>

      )}

    </div>

  );

}