import { Eye, Download, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import { useDeleteDocument } from "../../hooks/document/useDeleteDocument";


interface Props {
  shipmentId: string;
}

export default function DocumentList({
  shipmentId,
}: Props) {
  const {
    data: documents = [],
    isLoading,
  } = useShipmentDocuments(shipmentId);

  const deleteMutation =
    useDeleteDocument();

  if (isLoading) {
    return (
      <p>Loading documents...</p>
    );
  }

  if (!documents.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {documents.map((doc: any) => (
        <div
          key={doc.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >

          <div>

            <h4 className="font-medium">
              {doc.fileName}
            </h4>

            <p className="text-sm text-muted-foreground">
              {doc.type}
            </p>

          </div>

          <div className="flex gap-2">

            <Button
              size="icon"
              variant="outline"
              asChild
            >
              <a
                href={`http://localhost:5000${doc.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="w-4 h-4" />
              </a>
            </Button>

            <Button
              size="icon"
              variant="outline"
              asChild
            >
              <a
                href={`http://localhost:5000${doc.fileUrl}`}
                download
              >
                <Download className="w-4 h-4" />
              </a>
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={() =>
                deleteMutation.mutate(doc.id)
              }
            >
              <Trash2 className="w-4 h-4" />
            </Button>

          </div>

        </div>
      ))}

    </div>
  );
}