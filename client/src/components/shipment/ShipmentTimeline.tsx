import {
  CheckCircle2,
  Circle,
  FileText,
  Package,
  Route,
  FolderOpen,
  Truck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Shipment } from "../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

interface TimelineStep {
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
}

export default function ShipmentTimeline({ shipment }: Props) {
  const steps: TimelineStep[] = [
    {
      title: "Shipment Created",
      description: "Shipment record has been created.",
      completed: true,
      icon: <Truck className="h-5 w-5" />,
    },

    {
      title: "Invoice",
      description: shipment.invoice
        ? "Invoice has been generated."
        : "Invoice pending.",
      completed: !!shipment.invoice,
      icon: <FileText className="h-5 w-5" />,
    },

    {
      title: "Packing List",
      description: shipment.packingList
        ? "Packing list has been created."
        : "Packing list pending.",
      completed: !!shipment.packingList,
      icon: <Package className="h-5 w-5" />,
    },

    {
      title: "Transit",
      description:
        shipment.transits.length > 0
          ? `${shipment.transits.length} transit record(s).`
          : "No transit records.",
      completed: shipment.transits.length > 0,
      icon: <Route className="h-5 w-5" />,
    },

    {
      title: "Documents",
      description:
        shipment.documents.length > 0
          ? `${shipment.documents.length} uploaded document(s).`
          : "No documents uploaded.",
      completed: shipment.documents.length > 0,
      icon: <FolderOpen className="h-5 w-5" />,
    },

    {
      title: "Shipment Completed",
      description:
        shipment.status === "COMPLETED"
          ? "Shipment completed."
          : "Awaiting completion.",
      completed: shipment.status === "COMPLETED",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Progress</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                {step.completed ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    {step.icon}
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted text-muted-foreground">
                    <Circle className="h-5 w-5" />
                  </div>
                )}

                {index !== steps.length - 1 && (
                  <div className="mt-1 h-10 w-px bg-border" />
                )}
              </div>

              <div className="pb-4">
                <h4 className="font-medium">{step.title}</h4>

                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
