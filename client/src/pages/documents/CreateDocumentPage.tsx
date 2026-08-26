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

  const [searchParams] = useSearchParams();

  /*
  =====================================
  URL Attachment IDs
  =====================================
  */

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

  /*
  =====================================
  Determine Attachment Target
  =====================================
  */

  const attachTo =
    allocationId
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
      : "SHIPMENT";

  /*
  =====================================
  Submit
  =====================================
  */

  async function onSubmit(
    values: CreateDocumentInput
  ) {
    try {
      const formData =
        new FormData();

      /*
      =====================================
      Required Fields
      =====================================
      */

      formData.append(
        "file",
        values.file
      );

      formData.append(
        "type",
        values.type
      );

      /*
      =====================================
      Remarks
      =====================================
      */

      if (values.remarks?.trim()) {
        formData.append(
          "remarks",
          values.remarks.trim()
        );
      }

      /*
      =====================================
      Attachment IDs
      =====================================

      URL parameter takes precedence.

      This is useful when the user clicks:

      Add Document

      from a specific allocation,
      shipment, invoice, etc.
      */

      const finalAllocationId =
        allocationId ??
        values.allocationId;

      const finalShipmentId =
        shipmentId ??
        values.shipmentId;

      const finalContainerId =
        containerId ??
        values.containerId;

      const finalPackingListId =
        packingListId ??
        values.packingListId;

      const finalTransitId =
        transitId ??
        values.transitId;

      const finalInvoiceId =
        invoiceId ??
        values.invoiceId;

      /*
      =====================================
      Append IDs
      =====================================
      */

      if (finalAllocationId) {
        formData.append(
          "allocationId",
          finalAllocationId
        );
      }

      if (finalShipmentId) {
        formData.append(
          "shipmentId",
          finalShipmentId
        );
      }

      if (finalContainerId) {
        formData.append(
          "containerId",
          finalContainerId
        );
      }

      if (finalPackingListId) {
        formData.append(
          "packingListId",
          finalPackingListId
        );
      }

      if (finalTransitId) {
        formData.append(
          "transitId",
          finalTransitId
        );
      }

      if (finalInvoiceId) {
        formData.append(
          "invoiceId",
          finalInvoiceId
        );
      }

      /*
      =====================================
      Debug
      =====================================
      */

      for (const [
        key,
        value,
      ] of formData.entries()) {
        console.log(
          key,
          value
        );
      }

      /*
      =====================================
      Create Document
      =====================================
      */

      await createMutation.mutateAsync(
        formData
      );

      toast.success(
        "Document uploaded successfully."
      );

      /*
      =====================================
      Return To Parent
      =====================================
      */

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
      console.error(
        "Document upload error:",
        error
      );

      toast.error(
        error?.response?.data?.message ??
          "Failed to upload document."
      );
    }
  }

  /*
  =====================================
  Render
  =====================================
  */

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
          attachTo,

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