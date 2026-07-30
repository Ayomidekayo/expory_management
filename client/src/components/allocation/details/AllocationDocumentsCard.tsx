import { Upload } from "lucide-react";

import { Button } from "../../ui/button";

export default function AllocationDocumentsCard() {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Documents
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage allocation documents.
          </p>
        </div>

        <Button disabled>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="rounded-lg border border-dashed py-12 text-center">
        <p className="font-medium">
          No documents uploaded.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Document upload will be implemented next.
        </p>
      </div>
    </div>
  );
}