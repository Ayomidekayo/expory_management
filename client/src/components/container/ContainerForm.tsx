import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../ui/form";

import {
  createContainerSchema,
  type CreateContainerInput,
  type CreateContainerOutput,
} from "../../validations/container.validation";

import ContainerInformation from "./section/ContainerInformation";
import ShipmentInformation from "./section/ShipmentInformation";
import PhysicalInformation from "./section/PhysicalInformation";
import LogisticsInformation from "./section/LogisticsInformation";
import Summary from "./section/Summary";
import FormActions from "./section/FormActions";

interface Props {
  defaultValues?: Partial<CreateContainerInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreateContainerOutput
  ) => void;
}

export default function ContainerForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
  const form = useForm<
    CreateContainerInput,
    undefined,
    CreateContainerOutput
  >({
    resolver: zodResolver(createContainerSchema),

    defaultValues: {
      shipmentId: "",

      packingListId: "",

      containerNumber: "",

      sealNumber: "",

      containerType: "DRY",

      containerSize: "FT20",

      grossWeight: 0,

      netWeight: 0,

      tareWeight: 0,

      volume: 0,

      loadingLocation: "",

      destination: "",

      shippingLine: "",

      bookingReference: "",

      containerCondition: "",

      status: "EMPTY",

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset(defaultValues);
  }, [defaultValues, form]);

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => {
            console.log("✅ VALID", values);
            onSubmit(values);
          },
          (errors) => {
            console.log("❌ VALIDATION ERRORS", errors);
          }
        )}
      >
        <ContainerInformation form={form} />

        <ShipmentInformation form={form} />

        <PhysicalInformation form={form} />

        <LogisticsInformation form={form} />

        <Summary form={form} />

        <FormActions
          loading={loading}
          isEditing={isEditing}
        />
      </form>
    </Form>
  );
}