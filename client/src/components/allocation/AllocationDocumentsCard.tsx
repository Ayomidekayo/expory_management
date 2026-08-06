import {
  FileText,
  Download,
  Eye,
} from "lucide-react";

import type { Allocation } from "../../types/allocation.types";

import { Button } from "../ui/button";

interface Props {
  allocation: Allocation;
}

export default function AllocationDocumentsCard({
  allocation,
}: Props) {
  const documents = [
    ...(allocation.documents ?? []).map((doc) => ({
      ...doc,
      source: "Allocation" as const,
    })),

    ...(allocation.shipment?.documents ?? []).map((doc) => ({
      ...doc,
      source: "Shipment" as const,
    })),
  ];

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Related Documents
        </h2>

        <p className="text-sm text-muted-foreground">
          Documents uploaded directly to this allocation and its shipment.
        </p>

      </div>

      {documents.length === 0 ? (

        <div className="rounded-xl border border-dashed py-14 text-center">

          <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />

          <h3 className="font-semibold">
            No Documents Available
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            No documents have been uploaded for this allocation.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {documents.map((doc) => (

            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-slate-50"
            >

              <div className="flex items-start gap-4">

                <div className="rounded-lg bg-blue-100 p-3">

                  <FileText className="h-6 w-6 text-blue-600" />

                </div>

                <div>

                  <h4 className="font-semibold text-slate-900">
                    { doc.fileName}
                  </h4>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">

                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                      {doc.source}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {doc.type}
                    </span>

                    <span className="text-muted-foreground">
                      •
                    </span>

                    <span className="text-muted-foreground">
                      {new Date(
                        doc.uploadedAt
                      ).toLocaleDateString()}
                    </span>

                    {doc.fileSize && (
                      <>
                        <span className="text-muted-foreground">
                          •
                        </span>

                        <span className="text-muted-foreground">
                          {(doc.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </>
                    )}

                  </div>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </a>
                </Button>

                <Button
                  asChild
                  size="sm"
                >
                  <a
                    href={doc.fileUrl}
                    download={doc.fileName}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}