
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "../../components/ui/button";

import { useCreateTransport } from "../../hooks/transport/useCreateTransport";

import type { CreateTransportPayload } from "../../types/transport";
import TransportForm from "../../components/transport/TransportForm";

export default function CreateTransportPage() {
  const navigate = useNavigate();
  const createTransport = useCreateTransport();

  function handleSubmit(
    payload: CreateTransportPayload | import("../../types/transport").UpdateTransportPayload
  ) {
    createTransport.mutate(
      payload as CreateTransportPayload,
      {
        onSuccess: (response) => {
          const transportId =
            response?.data?.id ??
            response?.id;

          if (transportId) {
            navigate(`/transports/${transportId}`);
          } else {
            navigate("/transports");
          }
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button variant="outline" size="icon" asChild>
          <Link to="/transports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">
            Create Transport
          </h1>

          <p className="text-muted-foreground">
            Register a new transport record and its trucks or containers.
          </p>
        </div>
      </div>

      <TransportForm
        onSubmit={handleSubmit}
        isSubmitting={createTransport.isPending}
        submitLabel="Create Transport"
      />
    </div>
  );
}
