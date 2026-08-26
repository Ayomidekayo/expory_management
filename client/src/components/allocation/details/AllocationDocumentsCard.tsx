import {
  FileText,
  Download,
  Eye,
  Upload,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import type { Allocation } from "../../../types/allocation.types";
import { Button } from "../../ui/button";
import DeleteDocumentDialog from "../../documents/DeleteDocumentDialog";



interface Props {
  allocation: Allocation;
}

export default function AllocationDocumentsCard({
  allocation,
}: Props) {
  const location = useLocation();

  /*
  =====================================
  Allocation Documents
  =====================================
  */

  const allocationDocuments =
    allocation.attachedDocuments ?? [];

  /*
  =====================================
  Shipment Documents
  =====================================
  */

  const shipmentDocuments =
    allocation.shipment?.documents ?? [];

  /*
  =====================================
  Combine Documents
  =====================================
  */

  const documents = [
    ...allocationDocuments.map((doc) => ({
      ...doc,
      source: "Allocation" as const,
    })),

    ...shipmentDocuments.map((doc) => ({
      ...doc,
      source: "Shipment" as const,
    })),
  ];

  console.log(
    "Allocation Documents:",
    allocationDocuments
  );

  console.log(
    "Shipment Documents:",
    shipmentDocuments
  );

  console.log(
    "All Related Documents:",
    documents
  );

  /*
  =====================================
  Upload URL
  =====================================
  */

  const uploadUrl =
    `/documents/create?allocationId=${allocation.id}` +
    `&returnTo=${encodeURIComponent(
      location.pathname
    )}`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="border-b border-slate-200 bg-slate-50/60 px-6 py-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Related Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Documents uploaded directly to this allocation and its shipment.
              </p>
            </div>

          </div>

          {/* Upload */}

          <Button
            asChild
            className="
              w-full
              rounded-lg
              bg-emerald-600
              text-white
              shadow-sm
              hover:bg-emerald-700
              sm:w-auto
            "
          >
            <Link to={uploadUrl}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Link>
          </Button>

        </div>

      </div>

      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="p-6">

        {documents.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-slate-50/50
              px-6
              py-14
              text-center
            "
          >

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <FileText className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No Documents Available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No documents have been uploaded for this allocation.
              Upload supporting documents to keep the allocation records complete.
            </p>

            <Button
              asChild
              variant="outline"
              className="
                mt-6
                rounded-lg
                border-emerald-200
                bg-white
                text-emerald-700
                hover:bg-emerald-50
                hover:text-emerald-800
              "
            >
              <Link to={uploadUrl}>
                <Upload className="mr-2 h-4 w-4" />
                Upload First Document
              </Link>
            </Button>

          </div>

        ) : (

          <div className="space-y-4">

            {documents.map((doc) => (

              <div
                key={`${doc.source}-${doc.id}`}
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  transition
                  hover:bg-slate-50
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                {/* =====================================
                    DOCUMENT INFORMATION
                ===================================== */}

                <div className="flex min-w-0 items-start gap-4">

                  <div className="shrink-0 rounded-lg bg-blue-100 p-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>

                  <div className="min-w-0">

                    <h4 className="truncate font-semibold text-slate-900">
                      {doc.fileName}
                    </h4>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">

                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                        {doc.source}
                      </span>

                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {doc.type}
                      </span>

                      <span className="text-slate-300">
                        •
                      </span>

                      <span className="text-slate-500">
                        {new Date(
                          doc.uploadedAt
                        ).toLocaleDateString()}
                      </span>

                      {doc.fileSize && (
                        <>
                          <span className="text-slate-300">
                            •
                          </span>

                          <span className="text-slate-500">
                            {(doc.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </>
                      )}

                    </div>

                  </div>

                </div>

                {/* =====================================
                    ACTIONS
                ===================================== */}

                <div className="flex shrink-0 items-center gap-2">

                  {/* VIEW */}

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

                  {/* DOWNLOAD */}

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

                  {/* DELETE */}

                  <DeleteDocumentDialog
                    id={doc.id}
                  />

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}