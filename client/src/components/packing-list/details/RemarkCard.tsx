import {
  MessageSquare,
} from "lucide-react";
import type { PackingList } from "../../../types/packing-list";


interface Props {
  packingList: PackingList;
}

export default function RemarksCard({
  packingList,
}: Props) {

  const remarks =
    packingList.remarks?.trim();

  return (

    <div className="rounded-xl border bg-white">

      {/* Header */}

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <MessageSquare className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Remarks
          </h2>

        </div>

      </div>

      {/* Body */}

      <div className="p-5">

        {remarks ? (

          <p className="leading-7 whitespace-pre-wrap text-muted-foreground">

            {remarks}

          </p>

        ) : (

          <div className="rounded-lg border border-dashed p-8 text-center">

            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

            <p className="font-medium">
              No Remarks
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              No remarks were provided for this packing list.
            </p>

          </div>

        )}

      </div>

    </div>

  );
}