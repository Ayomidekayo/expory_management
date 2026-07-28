import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { Form } from "../ui/form";

import ClientInformation from "./sections/ClientInformation";
import ServiceInformation from "./sections/ServiceInformation";
import CargoInformation from "./sections/CargoInformation";
import ShippingInformation from "./sections/ShippingInformation";
import FinancialInformation from "./sections/FinancialInformation";
import RemarksSection from "./sections/RemarksSection";
import WorkflowInformation from "./sections/WorkflowInformation";
import FormActions from "./sections/FormActions";

import {
  createAllocationSchema,
  type CreateAllocationInput,
} from "../../validations/allocation.schema";

import type {
  Allocation,
} from "../../types/allocation.types";

interface Props {
  defaultValues?: Partial<Allocation>;

  loading?: boolean;

  isEditing?: boolean;

  onSubmit: (
    values: CreateAllocationInput
  ) => void;
}

export default function AllocationForm({
  defaultValues,
  loading = false,
  isEditing = false,
  onSubmit,
}: Props) {
  const navigate = useNavigate();

  const form =
    useForm<CreateAllocationInput>({
      resolver: zodResolver(
        createAllocationSchema
      ),

      defaultValues: {
        clientId: "",

        exporterId: "",

        consigneeId: "",

        serviceType:
          "EXPORT_DOCUMENTATION",

        priority: "MEDIUM",

        cargoDescription: "",

        destinationCountry: "",

        insuranceRequired: false,

        ...defaultValues,
      },
    });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
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
        <ClientInformation
          form={form}
        />

        <ServiceInformation
          form={form}
        />

        <CargoInformation
          form={form}
        />

        <ShippingInformation
          form={form}
        />

        <FinancialInformation
          form={form}
        />

        <RemarksSection
          form={form}
        />

        <WorkflowInformation
          form={form}
        />

        <FormActions
          isLoading={loading}
          isEdit={isEditing}
          onCancel={() =>
            navigate("/allocations")
          }
        />
      </form>
    </Form>
  );
}