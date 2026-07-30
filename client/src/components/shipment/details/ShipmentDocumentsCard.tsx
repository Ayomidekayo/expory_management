
import {
  Upload,
  FileText,
  Eye,
  Download,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "../../ui/button";

import type { Shipment } from "../../../types/shipment.types";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteDocument } from "../../../hooks/document/useDeleteDocument";
import { downloadDocument, viewDocument } from "../../../api/document.api";
import DeleteDocumentDialog from "../../documents/DeleteDocumentDialog";

interface Props {
  shipment: Shipment;
}

export default function ShipmentDocumentsCard({

  shipment,
}: Props) {
  const documents = shipment.documents ?? [];
console.log("Shipment:", shipment);
console.log("Documents:", shipment.documents);

  useDeleteDocument();

  return (
    <div className="rounded-xl border bg-white">

      <div className="flex items-center justify-between border-b p-6">

        <div>
          <h2 className="text-xl font-semibold">
            Documents
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage every document uploaded for this shipment.
          </p>
        </div>

        <Button asChild>
          <Link
            to={`/documents/create?shipmentId=${shipment.id}`}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>

      </div>

      <div className="p-6">

        {documents.length === 0 ? (

          <div className="rounded-lg border border-dashed py-12 text-center">

            <FileText className="mx-auto mb-4 h-10 w-10 text-slate-400" />

            <h3 className="font-medium">
              No documents uploaded
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Upload the first supporting document for this shipment.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {documents.map((document) => (

              <div
                key={document.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >

                <div>

                  <h4 className="font-medium">
        
                      {document.fileName}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {document.type}
                  </p>

                </div>

                <div className="flex gap-2">

                  <Button
  size="icon"
  variant="outline"
  onClick={() =>
    viewDocument(document.fileUrl)
  }
>
  <Eye className="h-4 w-4" />
</Button>

                 <Button
  size="icon"
  variant="outline"
  onClick={() =>
    downloadDocument(
      document.fileUrl,
        document.fileName
    )
  }
>
  <Download className="h-4 w-4" />
</Button>

               <DeleteDocumentDialog id={document.id} />

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}