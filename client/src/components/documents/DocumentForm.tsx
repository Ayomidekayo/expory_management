import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../ui/form";

import {
  createDocumentSchema,
  type CreateDocumentInput,
} from "../../validations/document.validation";

import DocumentInformation from "./sections/DocumentInformation";
import RelatedRecordInformation from "./sections/RelatedRecordInformation";
import FileUploadSection from "./sections/FileUploadSection";
import RemarksSection from "./sections/RemarksSection";
import FormActions from "./sections/FormActions";

interface Props {
  defaultValues?: Partial<CreateDocumentInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreateDocumentInput
  ) => void;
}

export default function DocumentForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
  const form =
    useForm<CreateDocumentInput>({
      resolver: zodResolver(
        createDocumentSchema
      ),

      mode: "onChange",

      defaultValues: {
        type: "OTHER",

        attachTo: "SHIPMENT",

        allocationId: "",

        shipmentId: "",

        containerId: "",

        packingListId: "",

        transitId: "",

        invoiceId: "",

        remarks: "",

        ...defaultValues,
      },
    });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      type:
        defaultValues.type ??
        "OTHER",

      attachTo:
        defaultValues.attachTo ??
        "SHIPMENT",

      allocationId:
        defaultValues.allocationId ??
        "",

      shipmentId:
        defaultValues.shipmentId ??
        "",

      containerId:
        defaultValues.containerId ??
        "",

      packingListId:
        defaultValues.packingListId ??
        "",

      transitId:
        defaultValues.transitId ??
        "",

      invoiceId:
        defaultValues.invoiceId ??
        "",

      remarks:
        defaultValues.remarks ??
        "",
    });
  }, [defaultValues, form]);

  const allocationId =
    form.watch("allocationId");

  const shipmentId =
    form.watch("shipmentId");

  const containerId =
    form.watch("containerId");

  const packingListId =
    form.watch("packingListId");

  const invoiceId =
    form.watch("invoiceId");

  const transitId =
    form.watch("transitId");

  const openedFromDetails =
    !!allocationId ||
    !!shipmentId ||
    !!containerId ||
    !!packingListId ||
    !!invoiceId ||
    !!transitId;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-8"
      >
        <DocumentInformation
          form={form}
        />

        {!openedFromDetails && (
          <RelatedRecordInformation
            form={form}
          />
        )}

        <FileUploadSection
          form={form}
        />

        <RemarksSection
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