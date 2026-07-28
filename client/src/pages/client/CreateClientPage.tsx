import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import ClientForm from "../../components/client/ClientForm";
import { Button } from "../../components/ui/button";

import { useCreateClient } from "../../hooks/client/useCreateClient";

export default function CreateClientPage() {
  const createClient = useCreateClient();

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
            Create Client
          </h1>

          <p className="text-sm text-slate-500">
            Register a new client into the Export Management System.
          </p>
        </div>

      </div>

      <ClientForm
        loading={createClient.isPending}
        onSubmit={(data) =>
          createClient.mutate(data)
        }
      />

    </div>
  );
}