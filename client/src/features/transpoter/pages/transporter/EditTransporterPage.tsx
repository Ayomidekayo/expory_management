import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, Truck } from "lucide-react";
import { toast } from "sonner";

import TransporterForm from "../../components/transporter/TransporterForm";
import { useTransporter, useUpdateTransporter } from "../../hooks/transporter/useTransporters";
import type { UpdateTransporterPayload } from "../../types/transporter";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : "Unable to update transporter record.";
}

export default function EditTransporterPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useTransporter(id);
  const mutation = useUpdateTransporter(id);

  useEffect(() => {
    if (query.data?.isLocked) {
      toast.error("This transporter record is locked and cannot be edited.");
      navigate(`/transporters/${id}`, { replace: true });
    }
  }, [id, navigate, query.data?.isLocked]);

  async function handleSubmit(payload: UpdateTransporterPayload) {
    try {
      await mutation.mutateAsync(payload);
      toast.success("Transporter record updated successfully.");
      navigate(`/transporters/${id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (query.isLoading) {
    return <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" /> Loading transporter record...</div>;
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Truck className="mx-auto h-10 w-10 text-slate-300" />
        <h2 className="mt-3 text-lg font-semibold text-slate-900">Transporter not found</h2>
        <p className="mt-1 text-sm text-slate-500">The record could not be loaded.</p>
        <button onClick={() => navigate("/transporters")} className="mt-5 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800">Back to transporters</button>
      </div>
    );
  }

  if (query.data.isLocked) {
    return <div className="flex min-h-72 items-center justify-center gap-2 text-sm text-amber-700"><Lock className="h-5 w-5" /> This transporter record is locked.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5 px-3 py-5 sm:px-6 sm:py-6">
      <button type="button" onClick={() => navigate(`/transporters/${id}`)} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to details</button>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-800"><Truck className="h-6 w-6" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Transporter management</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Edit transporter</h1>
          <p className="mt-1 text-sm text-slate-500">Update {query.data.transportNumber}. Item details and statuses are managed from the record page.</p>
        </div>
      </div>
      <TransporterForm mode="edit" initialData={query.data} onSubmit={(payload) => void handleSubmit(payload as UpdateTransporterPayload)} isSubmitting={mutation.isPending} submitLabel="Save transporter changes" />
    </div>
  );
}
