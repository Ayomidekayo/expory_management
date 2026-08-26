import {
  Loader2,
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "../../components/ui/button";
import AllocationForm from "../../components/allocation/AllocationForm";
import { useAllocation } from "../../hooks/allocation/useAllocation";
import { useUpdateAllocation } from "../../hooks/allocation/useUpdateAllocation";
import AllocationDocumentsCard from "../../components/allocation/details/AllocationDocumentsCard";


export default function EditAllocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const updateAllocation = useUpdateAllocation();
  const { data, isLoading } = useAllocation(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        Allocation not found.
      </div>
    );
  }

  const allocation = data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/allocations">
          <Button
            variant="outline"
            className="
              h-11
              rounded-xl
              border-slate-300
              bg-white
              px-4
              shadow-sm
              transition-all
              hover:border-emerald-500
              hover:bg-emerald-50
              hover:text-emerald-700
              hover:shadow-md
            "
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </Link>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
          <BriefcaseBusiness className="h-7 w-7 text-emerald-700" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Allocation
          </h1>
          <p className="mt-1 text-slate-500">
            Update allocation information.
          </p>
        </div>
      </div>

      {/* Form */}
      <AllocationForm
        defaultValues={allocation}
        isEditing
        loading={updateAllocation.isPending}
        onSubmit={(values) =>
          updateAllocation.mutate(
            {
              id: id!,
              payload: values,
            },
            {
              onSuccess: () => navigate("/allocations"),
            }
          )
        }
      />

      <AllocationDocumentsCard allocation={allocation} />
    </div>
  );
}
