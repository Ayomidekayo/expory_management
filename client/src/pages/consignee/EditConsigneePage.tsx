import { Loader2 } from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ConsigneeForm from "../../components/consignee/ConsigneeForm";

import { useConsignee } from "../../hooks/consignee/useConsignee";
import { useUpdateConsignee } from "../../hooks/consignee/useUpdateConsignee";

export default function EditConsigneePage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const updateConsignee =
    useUpdateConsignee();

  const {
    data,
    isLoading,
  } = useConsignee(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">

        <Loader2 className="h-8 w-8 animate-spin" />

      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        Consignee not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Edit Consignee
        </h1>

        <p className="text-muted-foreground">
          Update consignee information.
        </p>

      </div>

      <ConsigneeForm
        defaultValues={data.data}
        isEditing
        loading={updateConsignee.isPending}
        onSubmit={(values) =>
          updateConsignee.mutate(
            {
              id: id!,
              payload: values,
            },
            {
              onSuccess: () => {
                navigate("/consignees");
              },
            }
          )
        }
      />

    </div>
  );
}