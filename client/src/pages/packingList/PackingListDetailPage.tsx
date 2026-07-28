import { useParams } from "react-router-dom";

import { Loader2 } from "lucide-react";

import { usePackingList } from "../../hooks/packingList/usePackingList";

import PackingHeader from "../../components/packing-list/details/PackingHeader";

import PackingInformationCard from "../../components/packing-list/details/PackingInformationCard";

import ShipmentInformationCard from "../../components/packing-list/details/ShipmentInformationCard";

import PackingItemsTable from "../../components/packing-list/details/PackingItemsTable";

import SummaryCard from "../../components/packing-list/details/SummaryCard";
import RemarksCard from "../../components/packing-list/details/RemarkCard";
import DocumentsCard from "../../components/packing-list/details/DocumentsCard";



export default function PackingListDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
  } = usePackingList(id);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">

        <Loader2 className="h-8 w-8 animate-spin" />

      </div>
    );
  }

  const packingList = data;

  if (!packingList) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">

        Packing List not found.

      </div>
    );
  }

  return (
    <div className="space-y-6">

      <PackingHeader
        packingList={packingList}
      />

      <div className="grid gap-6 lg:grid-cols-2">

        <PackingInformationCard
          packingList={packingList}
        />

        <ShipmentInformationCard
          packingList={packingList}
        />

      </div>

      <PackingItemsTable
        packingList={packingList}
      />

      <div className="grid gap-6 lg:grid-cols-2">

        <SummaryCard
          packingList={packingList}
        />

        <RemarksCard
          packingList={packingList}
        />

      </div>

      <DocumentsCard
        packingList={packingList}
      />

    </div>
  );
}