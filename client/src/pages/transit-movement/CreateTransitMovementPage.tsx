import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useCreateTransitMovement } from "../../hooks/transit-movement/useTransitMovements";
import type { CreateTransitMovementPayload } from "../../types/transit-movement";
import type { TransitMovementFormValues } from "../../validations/transit-movement-form.schema";
import { TransitMovementForm } from "../../components/transit-movement/TransitMovementForm";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function CreateTransitMovementPage() {
  const navigate = useNavigate();
  const createMutation = useCreateTransitMovement();

  const handleSubmit = async (values: TransitMovementFormValues) => {
    try {
      const payload: CreateTransitMovementPayload = {
        transitDate: values.transitDate,
        direction: values.direction,

        // Client name belongs to the parent TransitMovement record.
        // This was missing from the previous payload mapping.
        clientName: values.clientName.trim(),

        shipmentId: values.shipmentId || null,
        remarks: values.remarks?.trim() || undefined,

        // Item payloads contain truck/container details only.
        items: values.items.map((item) => ({
          itemDate: item.itemDate,
          itemType: item.itemType,
          name: item.name,
          frontPlateNumber: item.frontPlateNumber?.trim() || undefined,
          backPlateNumber: item.backPlateNumber?.trim() || undefined,
          containerName: item.containerName?.trim() || undefined,
          containerNumber: item.containerNumber?.trim() || undefined,
          chargeAmount: Number(item.chargeAmount),
          chargeCurrency: item.chargeCurrency,
          remarks: item.remarks?.trim() || undefined,
        })),
      };

      const result = await createMutation.mutateAsync(payload);

      toast.success("Transit movement created successfully.");
      navigate(`/transit-movements/${result.id}`);
    } catch (error: unknown) {
      const message = (error as ApiError)?.response?.data?.message;
      toast.error(message || "Failed to create transit movement.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/transit-movements")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-700"
            >
              <ArrowLeft size={16} />
              Back to Transit Movements
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Transit Movement
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Record a new inbound or outbound transit movement and its items.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <TransitMovementForm
            mode="create"
            isSubmitting={createMutation.isPending}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
