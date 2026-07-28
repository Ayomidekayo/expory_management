import {
  ArrowLeft,
  Loader2,
  Pencil,
  BriefcaseBusiness,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { Button } from "../../components/ui/button";

import { useAllocation } from "../../hooks/allocation/useAllocation";

import ClientInformationCard from "../../components/allocation/details/ClientInformationCard";
import ServiceInformationCard from "../../components/allocation/details/ServiceInformationCard";
import CargoInformationCard from "../../components/allocation/details/CargoInformationCard";
import ShippingInformationCard from "../../components/allocation/details/ShippingInformationCard";
import RemarksCard from "../../components/allocation/details/RemarksCard";
import FinancialInformationCard from "../../components/allocation/details/FinancialInformationCard";
import AllocationDocumentsCard from "../../components/allocation/AllocationDocumentsCard";
import AllocationTimeline from "../../components/allocation/details/AllocationTimeline";
import CreateShipmentCard from "../../components/allocation/details/CreateShipmentCard";
import WorkflowCard from "../../components/allocation/details/WokflowCard";
import AllocationDetailsStatistics from "../../components/allocation/details/AllocationDetailsStatistics";

export default function AllocationDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
  } = useAllocation(id);

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
        Allocation not found.
      </div>
    );
  }

  const allocation = data.data;

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-4">

          <Link to="/allocations">
            <Button
              variant="outline"
              className="
                h-11
                rounded-xl
                border-slate-300
                bg-white
                px-4
                shadow-sm
                transition-all
                hover:border-emerald-500
                hover:bg-emerald-50
                hover:text-emerald-700
                hover:shadow-md
              "
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
          </Link>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <BriefcaseBusiness className="h-7 w-7 text-emerald-700" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              {allocation.allocationNumber}
            </h1>

            <p className="mt-1 text-slate-500">
              Allocation Details
            </p>

          </div>

        </div>

        <Button asChild>
          <Link
            to={`/allocations/${allocation.id}/edit`}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Allocation
          </Link>
        </Button>

      </div>

      {/* Statistics */}

      <AllocationDetailsStatistics
        allocation={allocation}
      />

      {/* Information */}

      <ClientInformationCard
        allocation={allocation}
      />

      <ServiceInformationCard
        allocation={allocation}
      />

      <CargoInformationCard
        allocation={allocation}
      />

      <ShippingInformationCard
        allocation={allocation}
      />

      <FinancialInformationCard
        allocation={allocation}
      />

      <RemarksCard
        allocation={allocation}
      />

      <WorkflowCard
        allocation={allocation}
      />

      <AllocationDocumentsCard
        allocation={allocation}
      />

      <AllocationTimeline
        allocation={allocation}
      />

      <CreateShipmentCard
        allocation={allocation}
      />

    </div>
  );
}