import { useEffect } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import TransitForm from "./TransitForm";
import { useTransit } from "../../hooks/transit/useTransit";
import { useCreateTransit } from "../../hooks/transit/useCreateTransit";
import { useUpdateTransit } from "../../hooks/transit/useUpdateTransit";
import type { CreateTransitDto } from "../../types/transit.type";
import type { CreateTransitOutput } from "../../validations/transit.validation";


interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  shipmentId: string;

  transitId?: string;
}

export default function TransitDialog({
  open,
  onOpenChange,
  shipmentId,
  transitId,
}: Props) {
  const isEditing = !!transitId;

  const { data: transit } = useTransit(transitId ?? "");

  const createMutation = useCreateTransit();

  const updateMutation = useUpdateTransit();

  function handleSubmit(
  data: CreateTransitOutput

) {
 if (isEditing) {
  updateMutation.mutate(
    {
      id: transitId!,
      payload: data,
    },
    {
      onSuccess() {
        onOpenChange(false);
      },
    }
  );

  return;
}

createMutation.mutate(data, {
  onSuccess() {
    onOpenChange(false);
  },
});
  createMutation.mutate(
    data as CreateTransitDto,
    {
      onSuccess() {
        onOpenChange(false);
      },
    },
  );
}

  useEffect(() => {
    if (!open) return;
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Transit" : "Add Transit"}
          </DialogTitle>
        </DialogHeader>

      <TransitForm
  isEditing={isEditing}
  loading={
    createMutation.isPending ||
    updateMutation.isPending
  }
  defaultValues={
    transit
      ? {
          shipmentId: transit.shipmentId,
          containerId: transit.containerId,
          origin: transit.origin,
          destination: transit.destination,
          transportMode: transit.transportMode,
          transporter: transit.transporter,
          transitInvoice: transit.transitInvoice,
          agentNumber: transit.agentNumber,
          exporterNumber: transit.exporterNumber,
          wibNumber: transit.wibNumber,
          quantity: transit.quantity,
          unitPrice: transit.unitPrice,
          totalPrice: transit.totalPrice,
          description: transit.description,
        }
      : {
          shipmentId,
        }
  }
  onSubmit={handleSubmit}
/>
      </DialogContent>
    </Dialog>
  );
}
