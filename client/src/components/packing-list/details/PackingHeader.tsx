import {
  ArrowLeft,
  CalendarDays,
  Package,
  Printer,
  Pencil,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

import { useDeletePackingList } from "../../../hooks/packingList/useDeletePackingList";
import DeletePackingListDialog from "../../../pages/packingList/DeletePackingListDialog";
import { printPackingList } from "../../../utils/packing-list-pdf";
import type { PackingList } from "../../../types/packing-list";

interface Props {
  packingList: PackingList;
}

export default function PackingHeader({

    
  packingList,
}: Props) {

    const navigate = useNavigate();

const deletePackingList =
  useDeletePackingList();

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <div className="mb-3 flex items-center gap-3">

            <Link to="/packing-lists">

              <Button
                variant="outline"
                size="icon"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

            </Link>

            <div>

              <h1 className="text-3xl font-bold">

                {packingList.packingListNumber}

              </h1>

              <p className="text-muted-foreground">

                Packing List Details

              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <Badge
              variant="secondary"
              className="gap-2"
            >

              <Package className="h-4 w-4" />

              {packingList.shipment.shipmentNumber}

            </Badge>

            <Badge
              variant="outline"
              className="gap-2"
            >

              <CalendarDays className="h-4 w-4" />

              {new Date(
                packingList.createdAt
              ).toLocaleDateString()}

            </Badge>

          </div>

        </div>

        {/* Right */}

        <div className="flex gap-3">

         <div className="flex gap-3">

  <Button
  variant="outline"
  onClick={() =>
    printPackingList(packingList)
  }
>
  <Printer className="mr-2 h-4 w-4" />
  Print
</Button>
  <Link
    to={`/packing-lists/${packingList.id}/edit`}
  >

    <Button>

      <Pencil className="mr-2 h-4 w-4" />

      Edit

    </Button>

  </Link>

  <DeletePackingListDialog

    loading={
      deletePackingList.isPending
    }

    onDelete={() =>

      deletePackingList.mutate(
        packingList.id,
        {
          onSuccess() {

            navigate(
              "/packing-lists"
            );

          },
        }
      )

    }

  />

</div>
        </div>

      </div>

    </div>
  );
}