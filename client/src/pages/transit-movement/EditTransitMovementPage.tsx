
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { TransitMovementForm } from "../../components/transit-movement/TransitMovementForm";

import {
  useTransitMovement,
  useUpdateTransitMovement,
} from "../../hooks/transit-movement/useTransitMovements";

import type { TransitMovement } from "../../types/transit-movement";
import type { UpdateTransitMovementPayload } from "../../types/transit-movement";

import type {
  TransitMovementFormValues,
} from "../../validations/transit-movement-form.schema";

function mapMovementToForm(
  movement: TransitMovement
): TransitMovementFormValues {
  return {
    transitDate: movement.transitDate.slice(0, 10),

    direction: movement.direction,

    shipmentId: movement.shipmentId ?? null,

    remarks: movement.remarks ?? "",

    items: movement.items.map((item) => ({
      id: item.id,
      itemDate: item.itemDate.slice(0, 10),
      itemType: item.itemType,
      name: item.name ?? "",
      clientName: item.clientName,
      frontPlateNumber: item.frontPlateNumber ?? "",
      backPlateNumber: item.backPlateNumber ?? "",
      containerName: item.containerName ?? "",
      containerNumber: item.containerNumber ?? "",
      chargeAmount: Number(item.chargeAmount),
      chargeCurrency: item.chargeCurrency,
      remarks: item.remarks ?? "",
    })),
  };
}

export default function EditTransitMovementPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Validate the route parameter before using it.
  const movementId = id ?? "";

  const {
    data: movement,
    isLoading,
    isError,
  } = useTransitMovement(movementId);

  const updateMutation = useUpdateTransitMovement();

  if (!movementId) {
    return (
      <div className="p-6 text-center">
        Invalid transit movement ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading transit movement...
        </span>
      </div>
    );
  }

  if (isError || !movement) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-12 text-center">
        <h2 className="text-lg font-semibold">
          Unable to load transit movement
        </h2>

        <p className="text-sm text-muted-foreground">
          The record may not exist or you may not have permission to view it.
        </p>

        <Button
          variant="outline"
          onClick={() => navigate("/transit-movements")}
        >
          Back to Transit Movements
        </Button>
      </div>
    );
  }

  async function handleUpdate(
    values: TransitMovementFormValues
  ) {
    try {
      const payload: UpdateTransitMovementPayload = {
        transitDate: values.transitDate,
        shipmentId: values.shipmentId || null,
        remarks: values.remarks,

        items: values.items.map((item) => ({
          ...item,
          chargeAmount: Number(item.chargeAmount),
        })),
      };

      await updateMutation.mutateAsync({
        id: movementId,
        payload,
      });

      toast.success("Transit movement updated successfully");

      navigate(`/transit-movements/${movementId}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update transit movement"
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            navigate(`/transit-movements/${movementId}`)
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0">
          <h1 className="text-xl font-semibold sm:text-2xl">
            Edit Transit Movement
          </h1>

          <p className="text-sm text-muted-foreground">
            {movement.transitNumber}
          </p>
        </div>
      </div>

      {movement.isLocked && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          This transit movement is locked. You can view its details,
          but editing is disabled.
        </div>
      )}

      <TransitMovementForm
        key={movement.id}
        mode="edit"
        initialValues={mapMovementToForm(movement)}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
        isLocked={movement.isLocked}
      />
    </div>
  );
}
