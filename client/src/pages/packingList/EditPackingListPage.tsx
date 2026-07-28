import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PackingListForm from "../../components/packing-list/PackingListForm";

import { usePackingList } from "../../hooks/packingList/usePackingList";
import { useUpdatePackingList } from "../../hooks/packingList/useUpdatePackingList";

export default function EditPackingListPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
  } = usePackingList(id);

  const updatePackingList =
    useUpdatePackingList();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">

        <Loader2 className="h-8 w-8 animate-spin" />

      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">

        Packing List not found.

      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Edit Packing List

        </h1>

        <p className="text-muted-foreground">

          Update packing list information.

        </p>

      </div>

      <PackingListForm

        isEditing

        loading={updatePackingList.isPending}

        defaultValues={{

          shipmentId: data.shipmentId,

          packingDate:
            data.packingDate.slice(0, 10),

          packageType:
            data.packageType ?? "",

          totalPackages:
            data.totalPackages ?? 0,

          grossWeight:
            Number(data.grossWeight),

          netWeight:
            Number(data.netWeight),

          marksAndNumbers:
            data.marksAndNumbers ?? "",

          remarks:
            data.remarks ?? "",

          items:
            data.items.map((item) => ({

              description:
                item.description,

              packageType:
                item.packageType ?? "",

              packages:
                item.packages ?? 0,

              grossWeight:
                Number(item.grossWeight),

              netWeight:
                Number(item.netWeight),

              remarks:
                item.remarks ?? "",

            })),

        }}

        onSubmit={(values) =>
          updatePackingList.mutate(
            {
              id: id!,
              payload: values,
            },
            {
              onSuccess: () =>
                navigate(
                  `/packing-lists/${id}`
                ),
            }
          )
        }

      />

    </div>
  );
}