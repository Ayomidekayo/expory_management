import { useNavigate } from "react-router-dom";

import ContainerForm from "../../components/container/ContainerForm";

import { useCreateContainer } from "../../hooks/container/useCreateContainer";

export default function CreateContainerPage() {
  const navigate = useNavigate();

  const createContainer =
    useCreateContainer();

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Create Container
        </h1>

        <p className="text-muted-foreground">
          Register a new shipping container.
        </p>

      </div>

      <ContainerForm
        loading={createContainer.isPending}
        onSubmit={(values) =>
          createContainer.mutate(values, {
            onSuccess: () => {
              navigate("/containers");
            },
          })
        }
      />

    </div>
  );
}