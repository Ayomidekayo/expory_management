import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
} from "lucide-react";

import { Button } from "../../components/ui/button";

import {
  useTransit,
} from "../../hooks/transit/useTransit";
import PricingInformationCard from "../../components/transit/details/PricingInformationCard";
import DocumentsCard from "../../components/transit/details/DocumentsCard";
import TransitInformationCard from "../../components/transit/details/TransitInformationCard";
import ShipmentInformationCard from "../../components/transit/details/ShipmentInformationCard";

export default function TransitDetailsPage() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    data,
    isLoading,
  } = useTransit(id);

  if (isLoading) {

    return <p>Loading...</p>;

  }

  if (!data) {

    return <p>Transit not found.</p>;

  }

  const transit =
    data.data;

  return (

    <div className="space-y-6">

      <Button

        variant="outline"

        onClick={() =>
          navigate(-1)
        }

      >

        <ArrowLeft className="mr-2 h-4 w-4" />

        Back

      </Button>

      <div>

        <h1 className="text-3xl font-bold">

          {transit.transitNumber}

        </h1>

        <p className="text-muted-foreground">

          Transit Details

        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <TransitInformationCard
          transit={transit}
        />

        <ShipmentInformationCard
          transit={transit}
        />

        <PricingInformationCard
          transit={transit}
        />

        <DocumentsCard
          documents={transit.documents}
        />

      </div>

    </div>

  );

}