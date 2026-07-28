import { useCreateDocument, useDocument, useUpdateDocument } from "../../hooks/document/useDocuments";
import type { CreateDocumentInput } from "../../validations/document.validation";
import type { UpdateDocumentInput } from "../../validations/invoice.validation";
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
}

export default function DocumentDialog({
  open,
  onOpenChange,
  documentId,
}: Props) {
  const isEditing = Boolean(documentId);

  const { data: document } = useDocument(documentId ?? "");

  const createMutation = useCreateDocument();

  const updateMutation = useUpdateDocument();

  function handleSubmit(
    data:
      | CreateDocumentInput
      | UpdateDocumentInput
  ) {
    if (isEditing && documentId) {
      updateMutation.mutate(
        {
          id: documentId,
          data,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );

      return;
    }

    createMutation.mutate(
      data as CreateDocumentInput,
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
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
                    document.shipmentId,
                  type: document.type,
                  remarks:
                    document.remarks ?? "",
                  fileName:
                    document.fileName,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}