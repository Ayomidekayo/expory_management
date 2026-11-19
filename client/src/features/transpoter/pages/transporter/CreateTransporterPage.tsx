import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { toast } from "sonner";

import TransporterForm from "../../components/transporter/TransporterForm";
import { useCreateTransporter } from "../../hooks/transporter/useTransporters";
import type { CreateTransporterPayload } from "../../types/transporter";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : "Unable to create transporter record.";
}

export default function CreateTransporterPage() {
  const navigate = useNavigate();
  const mutation = useCreateTransporter();

  async function handleSubmit(payload: CreateTransporterPayload) {
    try {
      const created = await mutation.mutateAsync(payload);
      toast.success("Transporter record created successfully.");
      navigate(`/transporters/${created.id}`, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5 px-3 py-5 sm:px-6 sm:py-6">
      <button type="button" onClick={() => navigate("/transporters")} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to transporters
      </button>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800"><Truck className="h-6 w-6" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Transporter management</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Create transporter</h1>
          <p className="mt-1 text-sm text-slate-500">Register a transporter and add its truck or container movements.</p>
        </div>
      </div>
      <TransporterForm mode="create" onSubmit={(payload) => void handleSubmit(payload as CreateTransporterPayload)} isSubmitting={mutation.isPending} submitLabel="Create transporter record" />
    </div>
  );
}
