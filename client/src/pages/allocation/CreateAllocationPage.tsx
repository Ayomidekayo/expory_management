import { useNavigate } from "react-router-dom";

import AllocationForm from "../../components/allocation/AllocationForm";

import { useCreateAllocation } from "../../hooks/allocation/useCreateAllocation";

export default function CreateAllocationPage() {
  const navigate = useNavigate();

  const createAllocation =
    useCreateAllocation();

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Create Allocation
        </h1>

        <p className="text-muted-foreground">
          Register a new export allocation.
        </p>

      </div>

      <AllocationForm
        loading={createAllocation.isPending}
        onSubmit={(values) =>
          createAllocation.mutate(values, {
            onSuccess: () => {
              navigate("/allocations");
            },
          })
        }
      />

    </div>
  );
}