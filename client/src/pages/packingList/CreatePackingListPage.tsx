import { useNavigate } from "react-router-dom";

import PackingListForm from "../../components/packing-list/PackingListForm";
import { useCreatePackingList } from "../../hooks/packingList/useCreatePackingList";
export default function CreatePackingListPage() {
  const navigate = useNavigate();

  const createPackingList =
    useCreatePackingList();

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Create Packing List
        </h1>

        <p className="text-muted-foreground">
          Create a packing list for an existing shipment.
        </p>

      </div>

      <PackingListForm
        loading={
          createPackingList.isPending
        }
        onSubmit={(values) =>
          createPackingList.mutate(
            values,
            {
              onSuccess() {
                navigate("/packing-lists");
              },
            }
          )
        }
      />

    </div>
  );
}