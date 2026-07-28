import {
  FileText,
  Download,
  Eye,
  FileWarning,
} from "lucide-react";

import { Button } from "../../ui/button";
import type { Invoice } from "../../../types";

interface Props {
  invoice: Invoice;

  onPreview?: (id: string) => void;

  onDownload?: (id: string) => void;
}

export default function DocumentsCard({
  invoice,
  onPreview,
  onDownload,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      {/* Header */}

      <div className="flex items-center justify-between border-b p-5">

        <div>

          <h2 className="text-lg font-semibold">
            Attached Documents
          </h2>

          <p className="text-sm text-muted-foreground">
            Documents related to this invoice.
          </p>

        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">

          {invoice.documents.length}

        </span>

      </div>

      {/* Empty */}

      {invoice.documents.length === 0 && (

        <div className="flex flex-col items-center justify-center py-12 text-center">

          <FileWarning className="mb-4 h-12 w-12 text-muted-foreground" />

          <h3 className="text-lg font-semibold">
            No Documents
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            No documents have been uploaded for this invoice.
          </p>

        </div>

      )}

      {/* List */}

      {invoice.documents.length > 0 && (

        <div className="divide-y">

          {invoice.documents.map((document) => (

            <div
              key={document.id}
              className="flex items-center justify-between p-5"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-lg bg-primary/10 p-3">

                  <FileText className="h-5 w-5 text-primary" />

                </div>

                <div>

                  <h4 className="font-medium">

                    {document.fileName}

                  </h4>

                  <p className="text-sm text-muted-foreground">

                    {document.documentType}

                  </p>

                </div>

              </div>

              <div className="flex gap-2">

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onPreview?.(document.id)
                  }
                >

                  <Eye className="mr-2 h-4 w-4" />

                  Preview

                </Button>

                <Button
                  size="sm"
                  onClick={() =>
                    onDownload?.(document.id)
                  }
                >

                  <Download className="mr-2 h-4 w-4" />

                  Download

                </Button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}