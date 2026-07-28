import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BriefcaseBusiness,
  Truck,
  Container,
  FileText,
  ClipboardList,
  Route,
  FolderOpen,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  path: string;
  icon: any;
  roles: string[];
  section?: string;
}

export const sidebarItems: SidebarItem[] = [
  /*
   * Dashboard
   */
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "STAFF", "OFFICER", "VIEWER"],
    section: "Overview",
  },

  /*
   * Master Data
   */

  {
    title: "Clients",
    path: "/clients",
    icon: Building2,
    roles: ["ADMIN", "STAFF"],
    section: "Master Data",
  },

  {
    title: "Exporters",
    path: "/exporters",
    icon: Users,
    roles: ["ADMIN", "STAFF"],
    section: "Master Data",
  },

  {
    title: "Consignees",
    path: "/consignees",
    icon: UserSquare2,
    roles: ["ADMIN", "STAFF"],
    section: "Master Data",
  },

  /*
   * Operations
   */

  {
    title: "Allocations",
    path: "/allocations",
    icon: BriefcaseBusiness,
    roles: ["ADMIN", "STAFF", "OFFICER"],
    section: "Operations",
  },

  {
    title: "Shipments",
    path: "/shipments",
    icon: Truck,
    roles: ["ADMIN", "STAFF", "OFFICER"],
    section: "Operations",
  },

  {
    title: "Containers",
    path: "/containers",
    icon: Container,
    roles: ["ADMIN", "STAFF", "OFFICER"],
    section: "Operations",
  },

  {
    title: "Transits",
    path: "/transits",
    icon: Route,
    roles: ["ADMIN", "STAFF", "OFFICER"],
    section: "Operations",
  },

  /*
   * Documentation
   */

  {
    title: "Invoices",
    path: "/invoices",
    icon: FileText,
    roles: ["ADMIN", "STAFF", "OFFICER"],
    section: "Documentation",
  },

  {
    title: "Packing Lists",
    path: "/packing-lists",
    icon: ClipboardList,
    roles: ["ADMIN", "STAFF"],
    section: "Documentation",
  },

  {
    title: "Documents",
    path: "/documents",
    icon: FolderOpen,
    roles: ["ADMIN", "STAFF"],
    section: "Documentation",
  },

  /*
   * Analytics
   *

  /*
   * Administration
   */

  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["ADMIN","STAFF"],
    section: "Administration",
  },
];