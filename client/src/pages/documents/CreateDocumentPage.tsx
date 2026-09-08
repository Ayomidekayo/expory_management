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

  const exporterId =
    searchParams.get("exporterId");

  const clientId =
    searchParams.get("clientId");

  const consigneeId =
    searchParams.get("consigneeId");

  const createMutation =
    useCreateDocument();

  /*
  =====================================
  Determine Attachment Target
  =====================================

  URL attachment takes precedence.
  Only one target should be selected.
  */

  const attachTo =
    clientId
      ? "CLIENT"
      : exporterId
      ? "EXPORTER"
      : consigneeId
      ? "CONSIGNEE"
      : allocationId
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
      Final Attachment IDs
      =====================================

      URL parameter takes precedence over
      the value coming from the form.
      */

      const finalClientId =
        clientId ??
        values.clientId;

      const finalExporterId =
        exporterId ??
        values.exporterId;

      const finalConsigneeId =
        consigneeId ??
        values.consigneeId;

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

      const finalInvoiceId =
        invoiceId ??
        values.invoiceId;

      const finalTransitId =
        transitId ??
        values.transitId;

      /*
      =====================================
      Attach ONLY To Selected Target
      =====================================

      This is important.

      We do not want to send:

      clientId + shipmentId

      at the same time.

      The document must have exactly
      one owner.
      */

      switch (attachTo) {
        case "CLIENT":
          if (finalClientId) {
            formData.append(
              "clientId",
              finalClientId
            );
          }
          break;

        case "EXPORTER":
          if (finalExporterId) {
            formData.append(
              "exporterId",
              finalExporterId
            );
          }
          break;

        case "CONSIGNEE":
          if (finalConsigneeId) {
            formData.append(
              "consigneeId",
              finalConsigneeId
            );
          }
          break;

        case "ALLOCATION":
          if (finalAllocationId) {
            formData.append(
              "allocationId",
              finalAllocationId
            );
          }
          break;

        case "SHIPMENT":
          if (finalShipmentId) {
            formData.append(
              "shipmentId",
              finalShipmentId
            );
          }
          break;

        case "CONTAINER":
          if (finalContainerId) {
            formData.append(
              "containerId",
              finalContainerId
            );
          }
          break;

        case "PACKING_LIST":
          if (finalPackingListId) {
            formData.append(
              "packingListId",
              finalPackingListId
            );
          }
          break;

        case "INVOICE":
          if (finalInvoiceId) {
            formData.append(
              "invoiceId",
              finalInvoiceId
            );
          }
          break;

        case "TRANSIT":
          if (finalTransitId) {
            formData.append(
              "transitId",
              finalTransitId
            );
          }
          break;
      }

      /*
      =====================================
      Debug
      =====================================
      */

      console.log(
        "========== DOCUMENT FORM DATA =========="
      );

      for (const [
        key,
        value,
      ] of formData.entries()) {
        console.log(key, value);
      }

      console.log(
        "========================================"
      );

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

      if (clientId) {
        navigate(
          `/clients/${clientId}`
        );
        return;
      }

      if (exporterId) {
        navigate(
          `/exporters/${exporterId}`
        );
        return;
      }

      if (consigneeId) {
        navigate(
          `/consignees/${consigneeId}`
        );
        return;
      }

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

          clientId:
            clientId ?? "",

          exporterId:
            exporterId ?? "",

          consigneeId:
            consigneeId ?? "",

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