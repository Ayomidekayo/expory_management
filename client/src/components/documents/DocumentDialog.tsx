import { useCreateDocument } from "../../hooks/document/useCreateDocument";
import { useDocument } from "../../hooks/document/useDocument";
import { useUpdateDocument } from "../../hooks/document/useUpdateDocuments";
import type { UpdateDocumentDto } from "../../types/document";

import type {
  CreateDocumentInput,
} from "../../validations/document.validation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import DocumentForm from "./DocumentForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId?: string;
  shipmentId: string;
}

export default function DocumentDialog({
  open,
  onOpenChange,
  documentId,
  shipmentId,
}: Props) {
  const isEditing = Boolean(documentId);

  const { data: document } = useDocument(documentId ?? "");

  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();

  function handleSubmit(
    data: CreateDocumentInput 
  ) {
    if (isEditing && documentId) {
      updateMutation.mutate(
        {
          id: documentId,
          payload: data as UpdateDocumentDto,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );

      return;
    }

    const createData = data as CreateDocumentInput;

    const formData = new FormData();

    // Document type
    formData.append("type", createData.type);

    // This dialog is specifically for shipment documents
    formData.append("attachTo", "SHIPMENT");

    // Required parent
    formData.append("shipmentId", shipmentId);

    // Optional relationships
    if (createData.allocationId) {
      formData.append(
        "allocationId",
        createData.allocationId
      );
    }

    if (createData.containerId) {
      formData.append(
        "containerId",
        createData.containerId
      );
    }

    if (createData.packingListId) {
      formData.append(
        "packingListId",
        createData.packingListId
      );
    }

    if (createData.invoiceId) {
      formData.append(
        "invoiceId",
        createData.invoiceId
      );
    }

    if (createData.transitId) {
      formData.append(
        "transitId",
        createData.transitId
      );
    }

    if (createData.remarks) {
      formData.append(
        "remarks",
        createData.remarks
      );
    }

    // File
    formData.append(
      "file",
      createData.file
    );

    createMutation.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit Document"
              : "Upload Document"}
          </DialogTitle>
        </DialogHeader>

        <DocumentForm
          isEditing={isEditing}
          loading={
            createMutation.isPending ||
            updateMutation.isPending
          }
          defaultValues={
            document
              ? {
                  shipmentId:
                    document.shipmentId ?? "",
                  attachTo: "SHIPMENT",
                  type: document.type,
                  remarks:
                    document.remarks ?? "",
                }
              : {
                  shipmentId,
                  attachTo: "SHIPMENT",
                }
          }
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}