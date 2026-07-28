import { useState } from "react";
import { Upload } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";

import DocumentList from "../../components/documents/DocumentList";
import DocumentDialog from "../../components/documents/DocumentDialog";
import type { Shipment } from "../../types/shipment";

interface Props {
  shipment: Shipment;
}

export default function DocumentsCard({ shipment }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Shipment Documents</CardTitle>

            <p className="text-sm text-muted-foreground mt-1">
              {shipment.documents?.length ?? 0} document
              {(shipment.documents?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardHeader>

        <CardContent>
          <DocumentList shipmentId={shipment.id} />
        </CardContent>
      </Card>

      <DocumentDialog
        open={open}
        onOpenChange={setOpen}
        shipmentId={shipment.id}
      />
    </>
  );
}
