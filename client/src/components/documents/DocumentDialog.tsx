import { useCreateDocument } from "../../hooks/document/useCreateDocument";
import { useDocument } from "../../hooks/document/useDocument";
import { useUpdateDocument } from "../../hooks/document/useUpdateDocuments";

import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "../../validations/document.validation";

import DocumentForm from "../form/DocumentForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
    data: CreateDocumentInput | UpdateDocumentInput
  ) {
    if (isEditing && documentId) {
      updateMutation.mutate(
        {
          id: documentId,
          payload: data as UpdateDocumentInput,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );

      return;
    }

    const createData =
      data as CreateDocumentInput;

    const formData = new FormData();

    formData.append("type", createData.type);

    formData.append(
      "attachTo",
      "SHIPMENT"
    );

    formData.append(
      "shipmentId",
      shipmentId
    );

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
                    document.shipmentId ??
                    "",
                  attachTo:
                    "SHIPMENT",
                  type:
                    document.type,
                  remarks:
                    document.remarks ??
                    "",
                }
              : {
                  shipmentId,
                  attachTo:
                    "SHIPMENT",
                }
          }
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}