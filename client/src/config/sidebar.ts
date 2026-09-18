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
  Settings,
  Building2,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  path: string;
  icon: any;
  permission: string;
  section?: string;
}

export const sidebarItems: SidebarItem[] = [
  // =========================
  // OVERVIEW
  // =========================
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    permission: "VIEW_DASHBOARD",
    section: "Overview",
  },

  // =========================
  // MASTER DATA
  // =========================
  {
    title: "Clients",
    path: "/clients",
    icon: Building2,
    permission: "VIEW_CLIENTS",
    section: "Master Data",
  },

  {
    title: "Exporters",
    path: "/exporters",
    icon: Users,
    permission: "VIEW_EXPORTERS",
    section: "Master Data",
  },

  {
    title: "Consignees",
    path: "/consignees",
    icon: UserSquare2,
    permission: "VIEW_CONSIGNEES",
    section: "Master Data",
  },

  // =========================
  // OPERATIONS
  // =========================
  {
    title: "Allocations",
    path: "/allocations",
    icon: BriefcaseBusiness,
    permission: "VIEW_ALLOCATIONS",
    section: "Operations",
  },

  {
    title: "Shipments",
    path: "/shipments",
    icon: Truck,
    permission: "VIEW_SHIPMENTS",
    section: "Operations",
  },

  {
    title: "Containers",
    path: "/containers",
    icon: Container,
    permission: "VIEW_CONTAINERS",
    section: "Operations",
  },

  {
    title: "Transits",
    path: "/transits",
    icon: Route,
    permission: "VIEW_TRANSITS",
    section: "Operations",
  },

  // =========================
  // DOCUMENTATION
  // =========================
  {
    title: "Invoices",
    path: "/invoices",
    icon: FileText,
    permission: "VIEW_INVOICES",
    section: "Documentation",
  },

  {
    title: "Packing Lists",
    path: "/packing-lists",
    icon: ClipboardList,
    permission: "VIEW_PACKING_LISTS",
    section: "Documentation",
  },

  {
    title: "Documents",
    path: "/documents",
    icon: FolderOpen,
    permission: "VIEW_DOCUMENTS",
    section: "Documentation",
  },

  // =========================
  // ADMINISTRATION
  // =========================
  {
    title: "User Management",
    path: "/users",
    icon: Users,
    permission: "VIEW_USERS",
    section: "Administration",
  },

  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    permission: "VIEW_DASHBOARD",
    section: "Administration",
  },
];