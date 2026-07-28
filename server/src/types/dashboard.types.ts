export interface DashboardStatistics {
  totalExporters: number;
  totalConsignees: number;
  totalShipments: number;
  totalInvoices: number;

  draftShipments: number;
  pendingShipments: number;
  completedShipments: number;
  cancelledShipments: number;

  totalRevenue: number;
}

export interface DashboardResponse {
  statistics: DashboardStatistics;
  recentShipments: unknown[];
  recentInvoices: unknown[];
}