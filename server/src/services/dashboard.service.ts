import dashboardRepository from "../Repository/dashboard.repository";

class DashboardService {
  async getDashboard() {

    const [

      statistics,

      shipmentStatus,

      allocationStatus,

      transportModes,

      upcomingShipments,

      recentActivities,

      revenue,

      shipmentTrend,

      topClients,

    ] = await Promise.all([

      dashboardRepository.getStatistics(),

      dashboardRepository.getShipmentStatus(),

      dashboardRepository.getAllocationStatus(),

      dashboardRepository.getTransportModes(),

      dashboardRepository.getUpcomingShipments(),

      dashboardRepository.getRecentActivities(),

      dashboardRepository.getRevenueTrend(),

      dashboardRepository.getShipmentTrend(),

      dashboardRepository.getTopClients(),

    ]);

    return {

      statistics,

      shipmentStatus,

      allocationStatus,

      transportModes,

      upcomingShipments,

      recentActivities,

      revenue,

      shipmentTrend,

      topClients,

    };
  }
}

export default new DashboardService();