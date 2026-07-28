import {
  Request,
  Response,
  NextFunction,
} from "express";

import dashboardService from "../services/dashboard.service";

class DashboardController {
  async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dashboard =
        await dashboardService.getDashboard();

      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();