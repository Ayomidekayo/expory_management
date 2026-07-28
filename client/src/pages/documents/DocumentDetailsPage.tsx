import { Download, FileText, Pencil } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

import { useDocument } from "../../hooks/document/useDocument";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

export default function DocumentDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
  } = useDocument(id ?? "");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        Document not found.
      </div>
    );
  }

  const document = data.data;

  const attachedRecord =
    document.shipment
      ? {
          label: "Shipment",
          value:
            document.shipment
              .shipmentNumber,
        }
      : document.allocation
      ? {
          label: "Allocation",
          value:
            document.allocation
              .allocationNumber,
        }
      : document.container
      ? {
          label: "Container",
          value:
            document.container
              .containerNumber,
        }
      : document.packingList
      ? {
          label: "Packing List",
          value:
            document.packingList
              .packingListNumber,
        }
      : document.invoice
      ? {
          label: "Invoice",
          value:
            document.invoice
              .invoiceNumber,
        }
      : document.transit
      ? {
          label: "Transit",
          value:
            document.transit
              .transitNumber,
        }
      : null;

  const isImage =
    document.mimeType?.startsWith(
      "image"
    ) ?? false;

  const isPdf =
    document.mimeType ===
    "application/pdf";

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Document Details
          </h1>

          <p className="text-muted-foreground">
            {document.fileName}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            asChild
          >
            <Link to="/documents">
              Back
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/documents/${document.id}/edit`
              )
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            onClick={() =>
              window.open(
                document.fileUrl,
                "_blank"
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Information */}

      <Card>
        <CardHeader>
          <CardTitle>
            Document Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Attached To
              </p>

              <p className="font-medium">
                {attachedRecord
                  ? `${attachedRecord.label}: ${attachedRecord.value}`
                  : "Not linked"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Document Type
              </p>

              <Badge>
                {document.type
                  ?.replaceAll(
                    "_",
                    " "
                  ) ?? "Unknown"}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                File Name
              </p>

              <p>
                {document.fileName}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                File Size
              </p>

              <p>
                {document.fileSize
                  ? `${(
                      document.fileSize /
                      1024
                    ).toFixed(2)} KB`
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Uploaded
              </p>

              <p>
                {document.uploadedAt
                  ? format(
                      new Date(
                        document.uploadedAt
                      ),
                      "dd MMM yyyy"
                    )
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                MIME Type
              </p>

              <p>
                {document.mimeType ??
                  "-"}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Remarks
            </p>

            <p>
              {document.remarks ||
                "No remarks."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}

      <Card>
        <CardHeader>
          <CardTitle>
            Preview
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isImage && (
            <img
              src={document.fileUrl}
              alt={
                document.fileName
              }
              className="max-h-[600px] rounded-lg border"
            />
          )}

          {isPdf && (
            <iframe
              src={document.fileUrl}
              title={
                document.fileName
              }
              className="h-[700px] w-full rounded-lg border"
            />
          )}

          {!isImage &&
            !isPdf && (
              <div className="py-16 text-center">
                <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />

                <p>
                  Preview not
                  available for
                  this file type.
                </p>

                <Button
                  className="mt-4"
                  onClick={() =>
                    window.open(
                      document.fileUrl,
                      "_blank"
                    )
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}