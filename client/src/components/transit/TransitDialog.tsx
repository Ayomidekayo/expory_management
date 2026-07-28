import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import TransitForm from "./TransitForm";
import type {
  CreateTransitDto,
  UpdateTransitDto,
} from "../../types/transit";
import { useCreateTransit, useTransit, useUpdateTransit } from "../../hooks/transit/useTransits";

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

  const { data: transit } = useTransit(
    transitId ?? ""
  );

  const createMutation =
    useCreateTransit();

  const updateMutation =
    useUpdateTransit();

  function handleSubmit(
    data:
      | CreateTransitDto
      | UpdateTransitDto
  ) {
    if (isEditing) {
      updateMutation.mutate(
        {
          id: transitId!,
          data,
        },
        {
          onSuccess() {
            onOpenChange(false);
          },
        }
      );

      return;
    }

    createMutation.mutate(
      data as CreateTransitDto,
      {
        onSuccess() {
          onOpenChange(false);
        },
      }
    );
  }

  useEffect(() => {
    if (!open) return;
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-4xl">

        <DialogHeader>

          <DialogTitle>

            {isEditing
              ? "Edit Transit"
              : "Add Transit"}

          </DialogTitle>

        </DialogHeader>

        <TransitForm
          shipmentId={shipmentId}
          isEditing={isEditing}
          loading={
            createMutation.isPending ||
            updateMutation.isPending
          }
          defaultValues={
            transit
              ? {
                  shipmentId:
                    transit.shipmentId,

                  origin:
                    transit.origin,

                  destination:
                    transit.destination,

                  transportMode:
                    transit.transportMode,

                  transporter:
                    transit.transporter,

                  transitInvoice:
                    transit.transitInvoice,

                  agentNumber:
                    transit.agentNumber,

                  exporterNumber:
                    transit.exporterNumber,

                  wibNumber:
                    transit.wibNumber,

                  quantity:
                    transit.quantity,

                  unitPrice:
                    transit.unitPrice,

                  description:
                    transit.description,
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />

      </DialogContent>
    </Dialog>
  );
}