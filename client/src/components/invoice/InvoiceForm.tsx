import { useEffect } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
} from "../ui/form";

import InvoiceInformation from "./section/InvoiceInformation";
import ShipmentInformation from "./section/ShipmentInformation";
import InvoiceItems from "./section/InvoiceItems";
import Totals from "./section/Totals";
import Remarks from "./section/Remarks";
import FormActions from "./FormActions";
import { createInvoiceSchema, type CreateInvoiceInput } from "../../validations/invoice.validation";

interface Props {
  defaultValues?: Partial<CreateInvoiceInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreateInvoiceInput
  ) => void;
}

export default function InvoiceForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
  const form =
    useForm<CreateInvoiceInput>({
      resolver: zodResolver(
        createInvoiceSchema
      ),

      defaultValues: {
        shipmentId: "",

        invoiceDate: "",

        currency: "NGN",

        exchangeRate: 1,

        paymentTerms: undefined,

        status: "DRAFT",

        incoterm: "",

        commercialReference: "",

        transportUnits: undefined,

        freight: 0,

        remarks: "",

        items: [
          {
            description: "",

            hsCode: "",

            packageType: "",

            packages: undefined,

            grossWeight: undefined,

            netWeight: undefined,

            quantity: 1,

            unit: "",

            unitPrice: 0,

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

  const freight =
    Number(
      useWatch({
        control: form.control,
        name: "freight",
      })
    ) || 0;

  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.unitPrice || 0),
      0
    );

  const total =
    subtotal + freight;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-8"
      >
        <InvoiceInformation
          form={form}
        />

        <ShipmentInformation
          form={form}
        />

        <InvoiceItems
          form={form}
        />

        <Totals
          subtotal={subtotal}
          freight={freight}
          total={total}
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