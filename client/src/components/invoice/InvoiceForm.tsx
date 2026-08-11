import { useEffect } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../ui/form";

import InvoiceInformation from "./section/InvoiceInformation";
import ShipmentInformation from "./section/ShipmentInformation";
import InvoiceItems from "./section/InvoiceItems";
import Totals from "./section/Totals";
import Remarks from "./section/Remarks";
import FormActions from "./FormActions";

import {
  createInvoiceSchema,
  type CreateInvoiceInput,
  type CreateInvoiceOutput,
} from "../../validations/invoice.validation";

interface Props {
  defaultValues?: Partial<CreateInvoiceInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreateInvoiceOutput
  ) => void;
}

export default function InvoiceForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
  const form = useForm<
    CreateInvoiceInput,
    undefined,
    CreateInvoiceOutput
  >({
    resolver:
      zodResolver(
        createInvoiceSchema
      ),

    defaultValues: {
      shipmentId: "",

      invoiceDate: "",

      currency: "NGN",

      exchangeRate: 1,

      /*
       * Client/vendor supplied
       * invoice number.
       */
      externalInvoiceNumber: "",

      paymentTerms:
        undefined,

      /*
       * IMPORTANT:
       * New invoices are UNPAID
       * by default.
       */
      status: "UNPAID",

      incoterm: "",

      commercialReference:
        "",

      transportUnits:
        undefined,

      freight: 0,

      remarks: "",

      items: [
        {
          description: "",

          hsCode: "",

          packageType: "",

          packages:
            undefined,

          grossWeight:
            undefined,

          netWeight:
            undefined,

          quantity: 1,

          unit: "",

          unitPrice: 0,

          remarks: "",
        },
      ],

      /*
       * Editing an existing invoice:
       * override the defaults with
       * values received from backend.
       */
      ...defaultValues,
    },
  });

  /*
   * Reset the form when invoice
   * details arrive from the API.
   */
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,

        /*
         * Make sure an invoice without
         * a status falls back to UNPAID.
         */
        status:
          defaultValues.status ??
          "UNPAID",

        /*
         * Make sure external invoice
         * number is always a safe string
         * for the input.
         */
        externalInvoiceNumber:
          defaultValues
            .externalInvoiceNumber ??
          "",
      });
    }
  }, [
    defaultValues,
    form,
  ]);

  /*
   * Watch invoice items
   */
  const items =
    useWatch({
      control:
        form.control,
      name: "items",
    }) ?? [];

  /*
   * Watch freight
   */
  const freight =
    Number(
      useWatch({
        control:
          form.control,
        name: "freight",
      })
    ) || 0;

  /*
   * Calculate subtotal
   */
  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 0
        ) *
        Number(
          item.unitPrice || 0
        ),
      0
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-8"
      >

        {/* =================================
            INVOICE INFORMATION
        ================================= */}

        <InvoiceInformation
          form={form}
        />

        {/* =================================
            SHIPMENT INFORMATION
        ================================= */}

        <ShipmentInformation
          form={form}
        />

        {/* =================================
            INVOICE ITEMS
        ================================= */}

        <InvoiceItems
          form={form}
        />

        {/* =================================
            TOTALS
        ================================= */}

        <Totals
          subtotal={subtotal}
          freight={freight}
          total={
            subtotal + freight
          }
        />

        {/* =================================
            REMARKS
        ================================= */}

        <Remarks
          form={form}
        />

        {/* =================================
            ACTIONS
        ================================= */}

        <FormActions
          isEditing={isEditing}
          loading={loading}
        />

      </form>
    </Form>
  );
}