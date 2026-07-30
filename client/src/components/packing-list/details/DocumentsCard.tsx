import {
  FileText,
  Eye,
  Download,
} from "lucide-react";

import { Button } from "../../ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import type { PackingList } from "../../../types/packing-list";



interface Props {
  packingList: PackingList;
}

export default function DocumentsCard({
  packingList,
}: Props) {
  const documents =
    packingList.documents ?? [];

  return (
    <div className="rounded-xl border bg-white">

      {/* Header */}

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <FileText className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Documents
          </h2>

        </div>

      </div>

      {/* Empty State */}

      {documents.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-16">

          <FileText className="mb-4 h-14 w-14 text-muted-foreground" />

          <h3 className="text-lg font-semibold">

            No Documents

          </h3>

          <p className="mt-2 text-sm text-muted-foreground">

            No supporting documents have been attached.

          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Document
                </TableHead>

                <TableHead>
                  Type
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

              {documents.map(
                (document) => (

                  <TableRow
                    key={document.id}
                  >

                    <TableCell className="font-medium">

                      {document.fileName}

                    </TableCell>

                    <TableCell>

                      {document.type}

                    </TableCell>

                    <TableCell>

                      {new Date(
                        document.updatedAt 
                      ).toLocaleDateString()}

                    </TableCell>

                    <TableCell>

                      <div className="flex justify-end gap-2">

                        <Button
                          size="icon"
                          variant="outline"
                          asChild
                        >

                          <a
                            href={document.id}
                            target="_blank"
                            rel="noreferrer"
                          >

                            <Eye className="h-4 w-4" />

                          </a>

                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          asChild
                        >

                          <a
                            href={document.fileUrl}
                            download
                          >

                            <Download className="h-4 w-4" />

                          </a>

                        </Button>

                      </div>

                    </TableCell>

                  </TableRow>

                )
              )}

            </TableBody>

          </Table>

        </div>

      )}

    </div>
  );
}