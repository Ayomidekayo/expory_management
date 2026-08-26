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
  type CreateAllocationOutput,
} from "../../validations/allocation.schema";

import type { Allocation } from "../../types/allocation.types";



interface Props {
  defaultValues?: Partial<Allocation>;
  loading?: boolean;
  isEditing?: boolean;
  onSubmit: (values: CreateAllocationOutput) => void;
}

export default function AllocationForm({
  defaultValues,
  loading = false,
  isEditing = false,
  onSubmit,
}: Props) {
  const navigate = useNavigate();

  const form = useForm<
    CreateAllocationInput,
    undefined,
    CreateAllocationOutput
  >({
    resolver: zodResolver(createAllocationSchema),

    defaultValues: {
      clientId: "",
      exporterId: undefined,
      consigneeId: undefined,

      serviceType: "EXPORT_DOCUMENTATION",
      priority: "MEDIUM",

      cargoDescription: "",

      destinationCountry: "",

      insuranceRequired: false,

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      clientId: defaultValues.clientId ?? "",

      exporterId: defaultValues.exporterId || undefined,
      consigneeId: defaultValues.consigneeId || undefined,

      serviceType:
        defaultValues.serviceType ?? "EXPORT_DOCUMENTATION",

      priority:
        defaultValues.priority ?? "MEDIUM",

      cargoDescription:
        defaultValues.cargoDescription ?? "",

      cargoType:
        defaultValues.cargoType ?? "",

      commodityCode:
        defaultValues.commodityCode ?? "",

      commodityName:
        defaultValues.commodityName ?? "",

      quantity: defaultValues.quantity,

      packageType:
        defaultValues.packageType ?? "",

      numberOfPackages:
        defaultValues.numberOfPackages,

      grossWeight:
        defaultValues.grossWeight,

      netWeight:
        defaultValues.netWeight,

      volume:
        defaultValues.volume,

      originCountry:
        defaultValues.originCountry ?? "",

      originCity:
        defaultValues.originCity ?? "",

      pickupAddress:
        defaultValues.pickupAddress ?? "",

      pickupDate:
        defaultValues.pickupDate ?? "",

      destinationCountry:
        defaultValues.destinationCountry ?? "",

      destinationCity:
        defaultValues.destinationCity ?? "",

      portOfLoading:
        defaultValues.portOfLoading ?? "",

      portOfDischarge:
        defaultValues.portOfDischarge ?? "",

      transportMode:
        defaultValues.transportMode ?? undefined,

      shippingLine:
        defaultValues.shippingLine ?? "",

      incoterm:
        defaultValues.incoterm ?? "",

      deliveryAddress:
        defaultValues.deliveryAddress ?? "",

      expectedShipmentDate:
        defaultValues.expectedShipmentDate ?? "",

      destinationPort:
        defaultValues.destinationPort ?? "",

      estimatedValue:
        defaultValues.estimatedValue,

      currency:
        defaultValues.currency ?? "",

      paymentTerms:
        defaultValues.paymentTerms ?? "",

      freightType:
        defaultValues.freightType ?? "",

      insuranceRequired:
        defaultValues.insuranceRequired ?? false,

      specialInstruction:
        defaultValues.specialInstruction ?? "",

      internalRemark:
        defaultValues.internalRemark ?? "",

      assignedToId:
        defaultValues.assignedToId || undefined,
    });
  }, [defaultValues, form]);

  return (
    <Form {...form}>
     <form
  onSubmit={form.handleSubmit(
    (values) => {
      console.log("✅ Submitted");
      console.log(values);
      onSubmit(values);
    },
    (errors) => {
      console.log("❌ Validation Errors");
      console.log(errors);
    }
  )}
className="space-y-8">
        <ClientInformation form={form} />

        <ServiceInformation form={form} />

        <CargoInformation form={form} />

        <ShippingInformation form={form} />

        <FinancialInformation form={form} />

        <RemarksSection form={form} />
        <WorkflowInformation form={form} />

        <FormActions
          isLoading={loading}
          isEdit={isEditing}
          onCancel={() => navigate("/allocations")}
        />
      </form>
    </Form>
  );
}