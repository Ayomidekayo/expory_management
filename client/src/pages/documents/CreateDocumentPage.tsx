import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";

import { useCreateDocument } from "../../hooks/document/useCreateDocument";

import type {
  CreateDocumentInput,
} from "../../validations/document.validation";

import DocumentForm from "../../components/documents/DocumentForm";

export default function CreateDocumentPage() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const allocationId =
    searchParams.get("allocationId");

  const shipmentId =
    searchParams.get("shipmentId");

  const containerId =
    searchParams.get("containerId");

  const packingListId =
    searchParams.get("packingListId");

  const transitId =
    searchParams.get("transitId");

  const invoiceId =
    searchParams.get("invoiceId");

  const createMutation =
    useCreateDocument();

  async function onSubmit(
    values: CreateDocumentInput
  ) {
    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        values.file
      );

      formData.append(
        "type",
        values.type
      );

      if (values.remarks) {
        formData.append(
          "remarks",
          values.remarks
        );
      }

      if (
        allocationId ??
        values.allocationId
      ) {
        formData.append(
          "allocationId",
          allocationId ??
            values.allocationId!
        );
      }

      if (
        shipmentId ??
        values.shipmentId
      ) {
        formData.append(
          "shipmentId",
          shipmentId ??
            values.shipmentId!
        );
      }

      if (
        containerId ??
        values.containerId
      ) {
        formData.append(
          "containerId",
          containerId ??
            values.containerId!
        );
      }

      if (
        packingListId ??
        values.packingListId
      ) {
        formData.append(
          "packingListId",
          packingListId ??
            values.packingListId!
        );
      }

      if (
        transitId ??
        values.transitId
      ) {
        formData.append(
          "transitId",
          transitId ??
            values.transitId!
        );
      }

      if (
        invoiceId ??
        values.invoiceId
      ) {
        formData.append(
          "invoiceId",
          invoiceId ??
            values.invoiceId!
        );
      }

      await createMutation.mutateAsync(
        formData
      );

      toast.success(
        "Document uploaded successfully."
      );

      if (allocationId) {
        navigate(
          `/allocations/${allocationId}`
        );
        return;
      }

      if (shipmentId) {
        navigate(
          `/shipments/${shipmentId}`
        );
        return;
      }

      if (containerId) {
        navigate(
          `/containers/${containerId}`
        );
        return;
      }

      if (packingListId) {
        navigate(
          `/packing-lists/${packingListId}`
        );
        return;
      }

      if (invoiceId) {
        navigate(
          `/invoices/${invoiceId}`
        );
        return;
      }

      if (transitId) {
        navigate(
          `/transits/${transitId}`
        );
        return;
      }

      navigate("/documents");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to upload document."
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Upload Document
        </h1>

        <p className="text-muted-foreground">
          Upload a supporting export
          document.
        </p>
      </div>

      <DocumentForm
        defaultValues={{
          attachTo: allocationId
            ? "ALLOCATION"
            : shipmentId
            ? "SHIPMENT"
            : containerId
            ? "CONTAINER"
            : packingListId
            ? "PACKING_LIST"
            : invoiceId
            ? "INVOICE"
            : transitId
            ? "TRANSIT"
            : "SHIPMENT",

          allocationId:
            allocationId ?? "",

          shipmentId:
            shipmentId ?? "",

          containerId:
            containerId ?? "",

          packingListId:
            packingListId ?? "",

          invoiceId:
            invoiceId ?? "",

          transitId:
            transitId ?? "",
        }}
        onSubmit={onSubmit}
        loading={
          createMutation.isPending
        }
      />
    </div>
  );
}