import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCreateGateMovement } from "../../hooks/gates/useGateMovements";
import GateMovementForm from "../../components/gates/GateMovementForm";
import { useContainers } from "../../hooks/container/useContainers";


export default function CreateGateMovementPage() {
  const navigate = useNavigate();

  const createGateMovement = useCreateGateMovement();

  const {
    data: containersResponse,
    isLoading: loadingContainers,
  } = useContainers();

  const containers = containersResponse?.data ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/gates")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Gates
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Record Gate Movement
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Record a container movement through the Terminal or ECOWAS Gate.
          </p>
        </div>
      </div>

      <GateMovementForm
        containers={containers}
        loadingContainers={loadingContainers}
        loading={createGateMovement.isPending}
        onCancel={() => navigate("/gates")}
        onSubmit={(values) => {
          createGateMovement.mutate(values, {
            onSuccess: () => navigate("/gates"),
          });
        }}
      />
    </div>
  );
}