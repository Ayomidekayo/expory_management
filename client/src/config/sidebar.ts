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
  DoorOpen,
  PlusCircle,
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
    title: "Quotation",
    path: "/quotations/rate-cards",
    icon: Truck,
    permission: "MANAGE_RATE_CARDS",
    section: "Operations",
  },
   {
    title: "Quotation Review",
    path: "/quotations/review",
    icon: Truck,
    permission: "REVIEW_QUOTE",
    section: "Operations",
  },
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
    title: "Gates",
    path: "/gates",
    icon: DoorOpen,
    permission: "VIEW_GATES",
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

export const exporterSidebarItems: SidebarItem[] = [
  {
    title: "My Dashboard",
    path: "/exporter/quotations",
    icon: LayoutDashboard,
    permission: "",
    section: "Overview",
  },
  {
    title: "My Quotations",
    path: "/exporter/quotations",
    icon: FileText,
    permission: "",
    section: "Quotations",
  },
  {
    title: "Get a Quote",
    path: "/get-a-quote",
    icon: PlusCircle,
    permission: "",
    section: "Quotations",
  },
];