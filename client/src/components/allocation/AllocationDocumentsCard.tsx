import {
  Upload,
  FileText,
  Download,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Allocation } from "../../types/allocation.types";

import { Button } from "../ui/button";

interface Props {
  allocation: Allocation;
}

export default function AllocationDocumentsCard({
  allocation,
}: Props) {
  const documents = allocation.documents ?? [];

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Documents
          </h2>

          <p className="text-sm text-muted-foreground">
            Upload and manage documents related to this allocation.
          </p>

        </div>

        <Button asChild>

          <Link
            to={`/documents/create?allocationId=${allocation.id}`}
          >

            <Upload className="mr-2 h-4 w-4" />

            Upload Document

          </Link>

        </Button>

      </div>

      {documents.length === 0 ? (

        <div className="rounded-xl border border-dashed py-14 text-center">

          <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />

          <h3 className="font-semibold">
            No Documents Uploaded
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload supporting documents such as quotations,
            purchase orders, approvals, invoices or other
            allocation-related files.
          </p>

          <Button
            asChild
            className="mt-6"
          >

            <Link
              to={`/documents/create?allocationId=${allocation.id}`}
            >

              <Upload className="mr-2 h-4 w-4" />

              Upload First Document

            </Link>

          </Button>

        </div>

      ) : (

        <div className="space-y-4">

          {documents.map((doc) => (

            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/30"
            >

              <div>

                <h4 className="font-medium">

                  {doc.originalName || doc.fileName}

                </h4>

                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">

                  <span>{doc.type}</span>

                  {doc.createdAt && (
                    <>
                      <span>•</span>

                      <span>
                        {new Date(
                          doc.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </>
                  )}

                </div>

              </div>

              <div className="flex items-center gap-2">

                <Button
                  size="icon"
                  variant="ghost"
                  disabled
                  title="Download coming soon"
                >

                  <Download className="h-4 w-4" />

                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  disabled
                  title="Delete coming soon"
                >

                  <Trash2 className="h-4 w-4 text-red-600" />

                </Button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}