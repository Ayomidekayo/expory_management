import { useNavigate } from "react-router-dom";

import ConsigneeForm from "../../components/consignee/ConsigneeForm";

import { useCreateConsignee } from "../../hooks/consignee/useCreateConsignee";

export default function CreateConsigneePage() {
  const navigate = useNavigate();

  const createConsignee =
    useCreateConsignee();

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Create Consignee
        </h1>

        <p className="text-muted-foreground">
          Register a new consignee.
        </p>

      </div>

      <ConsigneeForm
        loading={createConsignee.isPending}
        onSubmit={(values) =>
          createConsignee.mutate(values, {
            onSuccess: () => {
              navigate("/consignees");
            },
          })
        }
      />

    </div>
  );
}