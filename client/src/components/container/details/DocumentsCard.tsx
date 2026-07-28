import {
  FileText,
  Download,
} from "lucide-react";

import { Button } from "../../ui/button";

import type {
  Document,
} from "../../../types";

interface Props {
  documents: Document[];
}

export default function DocumentsCard({
  documents,
}: Props) {

  return (

    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <FileText className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">

            Documents

          </h2>

        </div>

      </div>

      <div className="p-5">

        {documents.length === 0 ? (

          <p className="text-sm text-muted-foreground">

            No documents attached.

          </p>

        ) : (

          <div className="space-y-3">

            {documents.map((document) => (

              <div
                key={document.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >

                <div>

                  <p className="font-medium">

                    {document.documentType}

                  </p>

                  <p className="text-sm text-muted-foreground">

                    {document.fileName}

                  </p>

                </div>

                <Button
                  size="icon"
                  variant="outline"
                  asChild
                >

                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >

                    <Download className="h-4 w-4" />

                  </a>

                </Button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}