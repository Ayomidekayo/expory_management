"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_repository_1 = __importDefault(require("../Repository/dashboard.repository"));
class DashboardService {
    async getDashboard() {
        const [statistics, shipmentStatus, allocationStatus, transportModes, upcomingShipments, recentActivities, revenue, shipmentTrend, topClients,] = await Promise.all([
            dashboard_repository_1.default.getStatistics(),
            dashboard_repository_1.default.getShipmentStatus(),
            dashboard_repository_1.default.getAllocationStatus(),
            dashboard_repository_1.default.getTransportModes(),
            dashboard_repository_1.default.getUpcomingShipments(),
            dashboard_repository_1.default.getRecentActivities(),
            dashboard_repository_1.default.getRevenueTrend(),
            dashboard_repository_1.default.getShipmentTrend(),
            dashboard_repository_1.default.getTopClients(),
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
exports.default = new DashboardService();
