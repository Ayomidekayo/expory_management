import { useNavigate } from "react-router-dom";

import TransitForm from "../../components/transit/TransitForm";

import {
  useCreateTransit,
} from "../../hooks/transit/useCreateTransit";

export default function CreateTransitPage() {

  const navigate =
    useNavigate();

  const mutation =
    useCreateTransit();

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Create Transit

        </h1>

        <p className="text-muted-foreground">

          Record a new shipment transit.

        </p>

      </div>

      <TransitForm

        loading={mutation.isPending}

        onSubmit={async (values) => {

          await mutation.mutateAsync(
            values
          );

          navigate("/transits");

        }}

      />

    </div>

  );

}