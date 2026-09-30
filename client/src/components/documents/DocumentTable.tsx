import {
  Download,
  FileText,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";

import type { Document } from "../../types/document";
import DeleteDocumentDialog from "./DeleteDocumentDialog";

interface Props {
  data: Document[];
  loading?: boolean;
  currentPage?: number;
  pageLimit?: number;
}

export default function DocumentTable({
  data,
  loading = false,
  currentPage = 1,
  pageLimit = 10,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center">
        Loading documents...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16">
        <div className="flex flex-col items-center gap-4">
          <FileText className="h-16 w-16 text-muted-foreground" />

          <div>
            <h3 className="text-lg font-semibold">
              No Documents Found
            </h3>

            <p className="text-muted-foreground">
              Upload your first document.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">
              S/N
            </TableHead>

            <TableHead>
              Document
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead>
              Shipment
            </TableHead>

            <TableHead>
              File Size
            </TableHead>

            <TableHead>
              Uploaded
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((document, index) => {
            const serialNumber =
              (currentPage - 1) * pageLimit + index + 1;

            return (
              <TableRow key={document.id}>
                {/* S/N */}
                <TableCell className="font-medium text-muted-foreground">
                  {serialNumber}
                </TableCell>

                {/* Document */}
                <TableCell className="font-medium">
                  {document.fileName}
                </TableCell>

                {/* Type */}
                <TableCell>
                  {document.type}
                </TableCell>

                {/* Shipment */}
                <TableCell>
                  {document.shipment?.shipmentNumber ?? "-"}
                </TableCell>

                {/* File Size */}
                <TableCell>
                  {document.fileSize
                    ? `${(
                        document.fileSize /
                        1024 /
                        1024
                      ).toFixed(2)} MB`
                    : "-"}
                </TableCell>

                {/* Uploaded */}
                <TableCell>
                  {new Date(
                    document.uploadedAt
                  ).toLocaleDateString()}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          document.fileUrl,
                          "_blank"
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <DeleteDocumentDialog
                      id={document.id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}