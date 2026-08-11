import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import ShipmentHeader from "../../components/shipment/details/ShipmentHeader";
import ShipmentInformationCard from "../../components/shipment/details/ShipmentInformationCard";
import PartiesCard from "../../components/shipment/details/PartiesCard";
import ExportDocumentsCard from "../../components/shipment/details/ExportDocumentsCard";
import BookingInformationCard from "../../components/shipment/details/BookingInformationCard";
import ShippingScheduleCard from "../../components/shipment/details/ShippingScheduleCard";
import RemarksCard from "../../components/shipment/details/RemarksCard";
import RelatedModulesCard from "../../components/shipment/details/RelatedModulesCard";
import { useShipment } from "../../hooks/shipments/useShipment";
import { useDeleteShipment } from "../../hooks/shipments/useDeleteShipment";
import ShipmentDocumentsCard from "../../components/shipment/details/ShipmentDocumentsCard";
import ShipmentInvoicesCard from "../../components/shipment/details/ShipmentInvoicesCard";



export default function ShipmentDetailsPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
  } = useShipment(id);

  const deleteShipment =
    useDeleteShipment();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">

        <Loader2 className="h-8 w-8 animate-spin" />

      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">

        <h2 className="text-2xl font-semibold">

          Shipment Not Found

        </h2>

        <p className="mt-2 text-muted-foreground">

          The shipment you are looking for no longer exists.

        </p>

      </div>
    );
  }

  const shipment =
    data.data;

  function handleDelete() {

    deleteShipment.mutate(
      shipment.id,
      {
        onSuccess() {

          toast.success(
            "Shipment deleted successfully."
          );

          navigate("/shipments");

        },
      }
    );

  }

  return (

    <div className="space-y-6">

      <ShipmentHeader
        shipment={shipment}
        onDelete={handleDelete}
      />

      <div className="grid gap-6 lg:grid-cols-2">

        <ShipmentInformationCard
          shipment={shipment}
        />

        <ExportDocumentsCard
          shipment={shipment}
        />

        <PartiesCard
          shipment={shipment}
        />

        <BookingInformationCard
          shipment={shipment}
        />
<ShipmentDocumentsCard
  shipment={shipment}
/>
        <ShippingScheduleCard
          shipment={shipment}
        />

        <RemarksCard
          shipment={shipment}
        />
<ShipmentInvoicesCard
  shipment={shipment}
/>
      </div>

      <RelatedModulesCard
        shipment={shipment}
      />

    </div>

  );

}