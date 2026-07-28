import { Link, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

import ContainerForm from "../../components/container/ContainerForm";

import { useContainer } from "../../hooks/container/useContainer";

import { useUpdateContainer } from "../../hooks/container/useUpdateContainer";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Container } from "lucide-react";

export default function EditContainerPage() {

  const { id } = useParams();

  const {
    data,
    isLoading,
  } = useContainer(id);

  const updateContainer =
    useUpdateContainer();

  if (isLoading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <Navigate to="/containers" />
    );
  }

  return (

    <div className="space-y-6">

      <div>
<div className="flex items-center gap-4">

  <Link to="/containers">
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
    <Container className="h-7 w-7 text-emerald-700" />
  </div>

  <div>
    <h1 className="text-3xl font-bold text-slate-900">
      Edit Container
    </h1>

    <p className="mt-1 text-slate-500">
      Update container information
    </p>
  </div>

</div>
       

      </div>

      <ContainerForm
        isEditing
        loading={updateContainer.isPending}
        defaultValues={data.data}
        onSubmit={(values) =>
          updateContainer.mutate({
            id: id!,
            payload: values,
          })
        }
      />

    </div>

  );
}