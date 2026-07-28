export interface DashboardStatistics {
  allocations: number;
  shipments: number;
  invoices: number;
  clients: number;
  containers: number;
  documents: number;
}

export interface ChartItem {
  name: string;
  value: number;
}

export interface DashboardData {
  statistics: DashboardStatistics;

  shipmentStatus: ChartItem[];

  allocationStatus: ChartItem[];

  transportModes: ChartItem[];

  revenue: any[];

  shipmentTrend: any[];

  topClients: any[];

  upcomingShipments: any[];

  recentActivities: any;
}