import { useEffect } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import {
  createPackingListSchema,
  type CreatePackingListInput,
} from "../../validations/packing-list.validation";
import PackingInformation from "./section/PackingInformation";
import PackingItems from "./section/PackingItems";
import Summary from "./section/Summary";
import Remarks from "./section/Remarks";
import FormActions from "./section/FormActions";
import ShipmentInformation from "./section/ShipmentInformation";

interface Props {
  defaultValues?: Partial<CreatePackingListInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreatePackingListInput
  ) => void;
}

export default function PackingListForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
  const form =
    useForm<CreatePackingListInput>({
      resolver: zodResolver(
        createPackingListSchema
      ),

      defaultValues: {
        shipmentId: "",

        packingDate: "",

        packageType: "",

        totalPackages: 0,

        grossWeight: 0,

        netWeight: 0,

        marksAndNumbers: "",

        remarks: "",

        items: [
          {
            description: "",

            packageType: "",

            packages: 0,

            grossWeight: 0,

            netWeight: 0,

            remarks: "",
          },
        ],

        ...defaultValues,
      },
    });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset(defaultValues);
  }, [defaultValues, form]);

  const items =
    useWatch({
      control: form.control,
      name: "items",
    }) ?? [];

  const grossWeight =
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.grossWeight || 0),
      0
    );

  const netWeight =
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.netWeight || 0),
      0
    );

  const totalPackages =
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.packages || 0),
      0
    );

  useEffect(() => {
    form.setValue(
      "grossWeight",
      grossWeight
    );

    form.setValue(
      "netWeight",
      netWeight
    );

    form.setValue(
      "totalPackages",
      totalPackages
    );
  }, [
    grossWeight,
    netWeight,
    totalPackages,
    form,
  ]);

  return (
    <Form {...form}>

      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-8"
      >

        <PackingInformation
          form={form}
        />

        <ShipmentInformation
          form={form}
        />

        <PackingItems
          form={form}
        />

        <Summary
          form={form}
        />

        <Remarks
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