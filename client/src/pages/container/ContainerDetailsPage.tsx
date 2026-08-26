import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useContainer } from "../../hooks/container/useContainer";

import ContainerHeader from "../../components/container/details/ContainerHeader";
import ShipmentInformationCard from "../../components/container/details/ShipmentInformationCard";
import ContainerInformationCard from "../../components/container/details/ContainerInformationCard";
import PackingListInformationCard from "../../components/container/details/PackingListInformationCard";
import WeightInformationCard from "../../components/container/details/WeightInformationCard";
import { Button } from "../../components/ui/button";
import TerminalChargeInformationCard from "../../components/container/details/TerminalChargeInformationCard";
import ContainerDocumentsCard from "../../components/container/details/ContainerDocumentCard";

export default function ContainerDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useContainer(id);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">

        <div className="flex items-center gap-3 text-muted-foreground">

          <Loader2 className="h-6 w-6 animate-spin" />

          <span>Loading container...</span>

        </div>

      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">

        <h2 className="text-xl font-semibold">
          Container Not Found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The requested container could not be found.
        </p>

      </div>
    );
  }

  const container = data.data;

  return (
    <div className="space-y-6">
<div className="flex items-center">
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
      Back to Containers
    </Button>
  </Link>
</div>
      {/* Header */}

      <ContainerHeader
        container={container}
      />

      {/* Information */}

      <div className="grid gap-6 xl:grid-cols-2">

        <ShipmentInformationCard
          shipment={container.shipment}
        />

        <ContainerInformationCard
          container={container}
        />

        <PackingListInformationCard
          packingList={container.packingList}
        />

        <WeightInformationCard
          container={container}
        />

         <TerminalChargeInformationCard
    container={container}
  />

      </div>

      {/* Documents */}

      <ContainerDocumentsCard
        container={container}
      />

    </div>
  );
}