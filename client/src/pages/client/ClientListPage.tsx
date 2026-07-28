import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useClients } from "../../hooks/client/useClients";
import ClientFilters from "../../components/client/ClientFilters";
import ClientTable from "../../components/client/ClientTable";
import ClientSummaryCards from "../../components/client/ClientSummaryCards";

export default function ClientListPage() {

  const {
    data,
    isLoading,
  } = useClients();

  const clients = data?.data ?? [];

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Clients
          </h1>

          <p className="text-muted-foreground">
            Manage registered export clients.
          </p>

        </div>

        <Button asChild>

          <Link to="/clients/new">

            <Plus className="mr-2 h-4 w-4" />

            New Client

          </Link>

        </Button>

      </div>

       {!isLoading && (
        <ClientSummaryCards
          clients={clients}
        />
      )}

      <ClientFilters />

      <ClientTable />

    </div>
  );
}