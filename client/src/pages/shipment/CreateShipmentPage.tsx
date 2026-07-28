import { useNavigate } from "react-router-dom";

import ShipmentForm from "../../components/shipment/ShipmentForm";
import { useCreateShipment } from "../../hooks/shipments/useCreateShipment";

export default function CreateShipmentPage() {
  const navigate = useNavigate();

  const createShipment =
    useCreateShipment();

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          New Shipment
        </h1>

        <p className="text-muted-foreground">
          Create a new shipment.
        </p>

      </div>

      <ShipmentForm
        loading={
          createShipment.isPending
        }
        onSubmit={(values) =>
          createShipment.mutate(values, {
            onSuccess: () => {
              navigate("/shipments");
            },
          })
        }
      />

    </div>
  );
}