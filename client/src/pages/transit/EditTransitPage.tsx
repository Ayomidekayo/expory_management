import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Route,
} from "lucide-react";

import { Button } from "../../components/ui/button";

import TransitForm from "../../components/transit/TransitForm";

import {
  useTransit,
} from "../../hooks/transit/useTransit";

import {
  useUpdateTransit,
} from "../../hooks/transit/useUpdateTransit";

export default function EditTransitPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
  } = useTransit(id);

  const mutation =
    useUpdateTransit();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center gap-4">

        <Link to="/transits">
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
          <Route className="h-7 w-7 text-emerald-700" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Transit
          </h1>

          <p className="mt-1 text-slate-500">
            Update transit information.
          </p>
        </div>

      </div>

      <TransitForm
        isEditing
        loading={mutation.isPending}
        defaultValues={data?.data}
        onSubmit={async (values) => {
          await mutation.mutateAsync({
            id: id!,
            payload: values,
          });

          navigate("/transits");
        }}
      />

    </div>
  );
}