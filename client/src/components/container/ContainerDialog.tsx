import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import type {
  Container,
  CreateContainerDto,
} from "../../types/container.type";
import type {
  CreateContainerOutput,
} from "../../validations/container.validation";

import { useCreateContainer } from "../../hooks/container/useCreateContainer";
import { useUpdateContainer } from "../../hooks/container/useUpdateContainer";
import ContainerForm from "./ContainerForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container?: Container;
}

export default function ContainerDialog({
  open,
  onOpenChange,
  container,
}: Props) {
  const createMutation = useCreateContainer();
  const updateMutation = useUpdateContainer();

  const editing = !!container;

 const defaultValues = container
  ? {
      shipmentId: container.shipmentId,

      packingListId:
        container.packingListId ?? undefined,

      containerNumber:
        container.containerNumber,

      sealNumber:
        container.sealNumber ?? undefined,

      containerType:
        container.containerType,

      containerSize:
        container.containerSize,

      grossWeight:
        container.grossWeight,

      netWeight:
        container.netWeight,

      tareWeight:
        container.tareWeight,

      volume:
        container.volume,

      loadingLocation:
        container.loadingLocation ?? undefined,

      destination:
        container.destination ?? undefined,

      shippingLine:
        container.shippingLine ?? undefined,

      bookingReference:
        container.bookingReference ?? undefined,

      containerCondition:
        container.containerCondition ?? undefined,

      status:
        container.status,
    }
  : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Container" : "New Container"}
          </DialogTitle>
        </DialogHeader>

        <ContainerForm
          defaultValues={defaultValues}
          loading={
            createMutation.isPending ||
            updateMutation.isPending
          }
          onSubmit={(values: CreateContainerOutput) => {
            const payload: CreateContainerDto = {
              ...values,
            };

            if (editing) {
            updateMutation.mutate(
  {
    id: container.id,
    payload,
  },
  {
    onSuccess() {
      toast.success(
        "Container updated successfully."
      );
      onOpenChange(false);
    },
    onError(error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Unable to update container."
      );
    },
  }
);
              
              return;
            }

            createMutation.mutate(payload, {
              onSuccess() {
                toast.success(
                  "Container created successfully."
                );
                onOpenChange(false);
              },
              onError(error: any) {
                toast.error(
                  error?.response?.data?.message ??
                    "Unable to create container."
                );
              },
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}