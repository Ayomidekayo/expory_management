import {
  FileText,
  Download,
  Eye,
  FileArchive,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import { Button } from "../../ui/button";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

interface AllocationDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
}

export default function DocumentsCard({
  allocation,
}: Props) {
  // Replace this with allocation.documents
  // once backend integration is complete.
  const documents: AllocationDocument[] =
    (allocation as any).documents ?? [];

  return (
    <Card>

      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle className="flex items-center gap-2">

          <FileArchive className="h-5 w-5 text-blue-600" />

          Supporting Documents

        </CardTitle>

      </CardHeader>

      <CardContent>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">

            <FileText className="mb-4 h-12 w-12 text-slate-400" />

            <h3 className="text-lg font-semibold">

              No Documents Uploaded

            </h3>

            <p className="mt-2 text-sm text-muted-foreground">

              Supporting documents will appear here after upload.

            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {documents.map((document) => (

              <div
                key={document.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >

                <div className="flex items-center gap-4">

                  <FileText className="h-10 w-10 text-blue-600" />

                  <div>

                    <h4 className="font-medium">

                      {document.name}

                    </h4>

                    <p className="text-sm text-muted-foreground">

                      {document.type}

                    </p>

                    <p className="text-xs text-muted-foreground">

                      {document.size} • Uploaded{" "}
                      {new Date(
                        document.uploadedAt
                      ).toLocaleDateString()}

                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />

                    Preview

                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                  >
                    <Download className="mr-2 h-4 w-4" />

                    Download

                  </Button>

                </div>

              </div>

            ))}

          </div>
        )}

      </CardContent>

    </Card>
  );
}