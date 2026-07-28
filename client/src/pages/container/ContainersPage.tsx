import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "../../components/ui/button";

import ContainerStatisticsCards from "../../components/container/ContainerStatisticsCards";

import ContainerTable from "../../components/container/ContainerTable";

import { useContainers } from "../../hooks/container/useContainers";

export default function ContainersPage() {

  const {
    data,
    isLoading,
  } = useContainers();
console.log("Containers Response:", data);
  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Containers

          </h1>

          <p className="text-muted-foreground">

            Manage shipping containers.

          </p>

        </div>

        <Link
          to="/containers/create"
        >

          <Button>

            <Plus className="mr-2 h-4 w-4" />

            Create Container

          </Button>

        </Link>

      </div>

      <ContainerStatisticsCards
        data={data?.data ?? []}
      />

      {/* Filters will go here */}

      <ContainerTable
        data={data?.data ?? []}
        loading={isLoading}
      />

    </div>

  );
}