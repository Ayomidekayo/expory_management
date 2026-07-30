import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  Form,
} from "../ui/form";

import { createConsigneeSchema, type CreateConsigneeInput } from "../../validations/consignee.validation";
import BasicInformation from "./section/BasicInformation";
import ContactInformation from "./section/ContactInformation";
import AddressInformation from "./section/AddressInformation";
import TransportInformation from "./section/TransportInformation";
import FormActions from "./section/FormActions";
import type { Consignee } from "../../types/consignee";


interface Props {
  defaultValues?: Partial<Consignee>;

  loading?: boolean;

  isEditing?: boolean;

  onSubmit: (
    values: CreateConsigneeInput
  ) => void;
}

export default function ConsigneeForm({
  defaultValues,
  loading = false,
  isEditing = false,
  onSubmit,
}: Props) {

  const navigate = useNavigate();

  const form = useForm<CreateConsigneeInput>({
    resolver: zodResolver(
      createConsigneeSchema
    ),

    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      transporter: "",
      placeOfLoading: "",
      transitRoute: "",
      portOfDischarge: "",
      transportMode: "SEA",

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name:
          defaultValues.name ?? "",

        contactPerson:
          defaultValues.contactPerson ?? "",

        phone:
          defaultValues.phone ?? "",

        email:
          defaultValues.email ?? "",

        address:
          defaultValues.address ?? "",

        transporter:
          defaultValues.transporter ?? "",

        placeOfLoading:
          defaultValues.placeOfLoading ?? "",

        transitRoute:
          defaultValues.transitRoute ?? "",

        portOfDischarge:
          defaultValues.portOfDischarge ?? "",

        transportMode:
          defaultValues.transportMode ??
          "SEA",
      });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>

      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >

        <BasicInformation
          form={form}
        />

        <ContactInformation
          form={form}
        />

        <AddressInformation
          form={form}
        />

        <TransportInformation
          form={form}
        />

        <FormActions
          isLoading={loading}
          isEdit={isEditing}
          onCancel={() =>
            navigate("/consignees")
          }
        />

      </form>

    </Form>
  );
}