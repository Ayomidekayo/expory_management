import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
} from "../ui/form";
import { createShipmentSchema, type CreateShipmentInput } from "../../validations/shipment.validation";
import ShipmentInformation from "./section/ShipmentInformation";
import PartiesInformation from "./section/PartiesInformation";
import ExportDocuments from "./section/ExportDocuments";
import BookingInformation from "./section/BookingInformation";
import ShippingSchedule from "./section/ShippingSchedule";
import FormActions from "./FormActions";
import Remarks from "./section/Remarks";
import { useEffect } from "react";

interface Props {
  defaultValues?: Partial<CreateShipmentInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreateShipmentInput
  ) => void;
}

export default function ShipmentForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
 const form = useForm<
  CreateShipmentInput,
  any,
  CreateShipmentInput
>({
  resolver: zodResolver(createShipmentSchema),
  defaultValues: {
        shipmentDate: "",

        clientId: "",

        exporterId: "",

        consigneeId: "",

        allocationId: undefined,

        transportMode: "SEA",

        status: "DRAFT",

        xfNumber: "",

        nxpNumber: "",

        cciNumber: "",

        eNumber: "",

        bookingNumber: "",

        shippingLine: "",

        vesselName: "",

        voyageNumber: "",

        portOfLoading: "",

        portOfDischarge: "",

        expectedDeparture: "",

        expectedArrival: "",

        actualDeparture: "",

        actualArrival: "",

        remarks: "",

        ...defaultValues,
      },
    });

  function toInputDate(value?: string | null) {
    if (!value) return "";

    return value.split("T")[0];
  }

  useEffect(() => {
  if (!defaultValues) return;

  form.reset({
    ...defaultValues,

    shipmentDate: toInputDate(
      defaultValues.shipmentDate
    ),

    expectedDeparture: toInputDate(
      defaultValues.expectedDeparture
    ),

    expectedArrival: toInputDate(
      defaultValues.expectedArrival
    ),

    actualDeparture: toInputDate(
      defaultValues.actualDeparture
    ),

    actualArrival: toInputDate(
      defaultValues.actualArrival
    ),
  });
}, [defaultValues, form]);

  return (
    <Form {...form}>

      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-8"
      >
        <ShipmentInformation
          form={form}
        />

        <PartiesInformation
          form={form}
        />

        <ExportDocuments
          form={form}
        />

        <BookingInformation
          form={form}
        />

        <ShippingSchedule
          form={form}
        />

        <Remarks
          form={form}
        />

        <FormActions
          isEditing={isEditing}
          loading={loading}
        />

      </form>

    </Form>
  );
}