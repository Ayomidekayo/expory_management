import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "../../components/ui/button";
import ClientForm from "../../components/client/ClientForm";

import { useClient } from "../../hooks/client/useClient";
import { useUpdateClient } from "../../hooks/client/useUpdateClient";

export default function EditClientPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const updateClient = useUpdateClient();

  const {
    data,
    isLoading,
  } = useClient(id);

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
        Client not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">

        <Link to="/clients">
          <Button
            variant="outline"
            size="icon"
            className="
              h-11
              w-11
              rounded-xl
              border-slate-300
              transition-all
              hover:border-emerald-500
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="h-8 w-px bg-slate-300" />

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Client
          </h1>

          <p className="text-sm text-slate-500">
            Update client information.
          </p>
        </div>

      </div>

      <ClientForm
        defaultValues={data.data}
        isEditing
        loading={updateClient.isPending}
        onSubmit={(values) =>
          updateClient.mutate(
            {
              id: id!,
              payload: values,
            },
            {
              onSuccess: () => {
                navigate("/clients");
              },
            }
          )
        }
      />

    </div>
  );
}