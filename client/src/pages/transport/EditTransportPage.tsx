
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "../../components/ui/button";

import type { UpdateTransportPayload } from "../../types/transport";

import TransportForm from "../../components/transport/TransportForm";
import { useTransport } from "../../hooks/transport/useTransport";
import { useUpdateTransport } from "../../hooks/transport/useUpdateTransport";

export default function EditTransportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useTransport(id ?? "");

  const updateTransport = useUpdateTransport();

  const transport = data;

  function handleSubmit(
    payload: import("../../types/transport").CreateTransportPayload | UpdateTransportPayload
  ) {
    if (!id) return;

    updateTransport.mutate(
      {
        id,
        data: payload as UpdateTransportPayload,
      },
      {
        onSuccess: () => {
          navigate(`/transports/${id}`);
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading transport record...
      </div>
    );
  }

  if (isError || !transport?.id) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h2 className="text-lg font-semibold">
          Transport record not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This transport record may have been deleted or you may not have permission to access it.
        </p>

        <Button asChild className="mt-5">
          <Link to="/transports">
            Back to Transports
          </Link>
        </Button>
      </div>
    );
  }

  if (transport.isLocked) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h2 className="text-lg font-semibold">
          Transport record is locked
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This transport record cannot be edited while it is locked.
        </p>

        <Button asChild className="mt-5">
          <Link to={`/transports/${id}`}>
            Back to Details
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/transports/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">
            Edit Transport
          </h1>

          <p className="text-muted-foreground">
            Update {transport.transportNumber}.
          </p>
        </div>
      </div>

      <TransportForm
        initialData={transport}
        onSubmit={handleSubmit}
        isSubmitting={updateTransport.isPending}
        submitLabel="Update Transport"
      />
    </div>
  );
}
