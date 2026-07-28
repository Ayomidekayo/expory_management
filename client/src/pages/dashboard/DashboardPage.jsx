import { Loader2 } from "lucide-react";
import UpcomingShipmentsCard from "../../components/dashboard/UpcomingShipmentsCard"
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import ShipmentTrendChart from "../../components/dashboard/ShipmentTrendChart"
import DashboardStatistics from "../../components/dashboard/DashboardStatistics";
import  ShipmentStatusChart  from "../../components/dashboard/ShipmentStatusChart"
import AllocationStatusChart  from "../../components/dashboard/AllocationStatusChart"
import RecentActivitiesCard  from "../../components/dashboard/RecentActivitiesCard"
import RevenueChart    from "../../components/dashboard/RevenueChart"
import TopClientsCard  from "../../components/dashboard/TopClientsCard"
import QuickActions  from "../../components/dashboard/QuickActions"
export function DashboardPage() {

  const {
    data,
    isLoading,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">

        <Loader2 className="h-8 w-8 animate-spin" />

      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">

        Dashboard unavailable.

      </div>
    );
  }

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Dashboard

        </h1>

        <p className="text-muted-foreground">

          Welcome to the Export Management Dashboard

        </p>

      </div>

    <div className="space-y-6">

  <DashboardStatistics
    statistics={data.statistics}
  />

  <div className="grid gap-6 lg:grid-cols-2">

    <ShipmentStatusChart
      data={data.shipmentStatus}
    />

    <AllocationStatusChart
      data={data.allocationStatus}
    />

  </div>

  <div className="grid gap-6 lg:grid-cols-2">

    <RevenueChart
      data={data.revenue}
    />

    <ShipmentTrendChart
      data={data.shipmentTrend}
    />

  </div>

  <div className="grid gap-6 lg:grid-cols-2">

    <UpcomingShipmentsCard
      shipments={data.upcomingShipments}
    />

    <TopClientsCard
      clients={data.topClients}
    />

  </div>

  <div className="grid gap-6 lg:grid-cols-2">

    <RecentActivitiesCard
      activities={data.recentActivities}
    />

    <QuickActions />

  </div>

</div>

    </div>

  );
}