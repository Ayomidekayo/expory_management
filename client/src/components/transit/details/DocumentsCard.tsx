import {
  FileText,
} from "lucide-react";
import type { Document } from "../../../types/document";



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

          <p className="text-muted-foreground">

            No documents attached.

          </p>

        ) : (

          <div className="space-y-3">

            {documents.map(
              (doc) => (

                <div
                  key={doc.id}
                  className="rounded-lg border p-4"
                >

                  <p className="font-medium">

                    {doc.fileName}

                  </p>

                  <p className="text-sm text-muted-foreground">

                    {doc.type}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}