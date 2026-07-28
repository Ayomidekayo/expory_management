import { useEffect } from "react";
import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { Form } from "../ui/form";

import {
  createTransitSchema,
  type CreateTransitInput,
} from "../../validations/transit.validation";

import ShipmentInformation from "./section/ShipmentInformation";
import TransitInformation from "./section/TransitInformation";
import PricingInformation from "./section/PricingInformation";
import Summary from "./section/Summary";
import FormActions from "./section/FormActions";

interface Props {
  defaultValues?: Partial<CreateTransitInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreateTransitInput
  ) => void;
}

export default function TransitForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {

  const form =
    useForm<CreateTransitInput>({

      resolver: zodResolver(
        createTransitSchema
      ),

      defaultValues: {

        shipmentId: "",

        containerId: "",

        origin: "",

        destination: "",

        transportMode: "ROAD",

        transporter: "",

        transitInvoice: "",

        agentNumber: "",

        exporterNumber: "",

        wibNumber: "",

        quantity: 0,

        description: "",

        unitPrice: 0,

        totalPrice: 0,

        ...defaultValues,

      },

    });

  useEffect(() => {

    if (!defaultValues) return;

    form.reset(defaultValues);

  }, [defaultValues, form]);

  return (

    <Form {...form}>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >

        <ShipmentInformation
          form={form}
        />

        <TransitInformation
          form={form}
        />

        <PricingInformation
          form={form}
        />

        <Summary
          form={form}
        />

        <FormActions
          loading={loading}
          isEditing={isEditing}
        />

      </form>

    </Form>

  );

}