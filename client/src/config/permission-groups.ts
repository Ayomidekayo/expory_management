import { PERMISSIONS, type Permission } from "./permissions";

export interface PermissionDefinition {
  key: Permission;
  label: string;
}

export interface PermissionGroup {
  title: string;
  permissions: PermissionDefinition[];
}

export const permissionGroups: PermissionGroup[] = [
  {
    title: "Overview",
    permissions: [
      {
        key: PERMISSIONS.VIEW_DASHBOARD,
        label: "View Dashboard",
      },
    ],
  },

  {
    title: "Clients",
    permissions: [
      {
        key: PERMISSIONS.VIEW_CLIENTS,
        label: "View Clients",
      },
      {
        key: PERMISSIONS.CREATE_CLIENT,
        label: "Create Clients",
      },
      {
        key: PERMISSIONS.EDIT_CLIENT,
        label: "Edit Clients",
      },
      {
        key: PERMISSIONS.DELETE_CLIENT,
        label: "Delete Clients",
      },
    ],
  },

  {
    title: "Exporters",
    permissions: [
      {
        key: PERMISSIONS.VIEW_EXPORTERS,
        label: "View Exporters",
      },
      {
        key: PERMISSIONS.CREATE_EXPORTER,
        label: "Create Exporters",
      },
      {
        key: PERMISSIONS.EDIT_EXPORTER,
        label: "Edit Exporters",
      },
      {
        key: PERMISSIONS.DELETE_EXPORTER,
        label: "Delete Exporters",
      },
    ],
  },

  {
    title: "Consignees",
    permissions: [
      {
        key: PERMISSIONS.VIEW_CONSIGNEES,
        label: "View Consignees",
      },
      {
        key: PERMISSIONS.CREATE_CONSIGNEE,
        label: "Create Consignees",
      },
      {
        key: PERMISSIONS.EDIT_CONSIGNEE,
        label: "Edit Consignees",
      },
      {
        key: PERMISSIONS.DELETE_CONSIGNEE,
        label: "Delete Consignees",
      },
    ],
  },

  {
    title: "Allocations",
    permissions: [
      {
        key: PERMISSIONS.VIEW_ALLOCATIONS,
        label: "View Allocations",
      },
      {
        key: PERMISSIONS.CREATE_ALLOCATION,
        label: "Create Allocations",
      },
      {
        key: PERMISSIONS.EDIT_ALLOCATION,
        label: "Edit Allocations",
      },
      {
        key: PERMISSIONS.DELETE_ALLOCATION,
        label: "Delete Allocations",
      },
    ],
  },

  {
    title: "Shipments",
    permissions: [
      {
        key: PERMISSIONS.VIEW_SHIPMENTS,
        label: "View Shipments",
      },
      {
        key: PERMISSIONS.CREATE_SHIPMENT,
        label: "Create Shipments",
      },
      {
        key: PERMISSIONS.EDIT_SHIPMENT,
        label: "Edit Shipments",
      },
      {
        key: PERMISSIONS.DELETE_SHIPMENT,
        label: "Delete Shipments",
      },
    ],
  },

  {
    title: "Containers",
    permissions: [
      {
        key: PERMISSIONS.VIEW_CONTAINERS,
        label: "View Containers",
      },
      {
        key: PERMISSIONS.CREATE_CONTAINER,
        label: "Create Containers",
      },
      {
        key: PERMISSIONS.EDIT_CONTAINER,
        label: "Edit Containers",
      },
      {
        key: PERMISSIONS.DELETE_CONTAINER,
        label: "Delete Containers",
      },
    ],
  },

  {
    title: "Transits",
    permissions: [
      {
        key: PERMISSIONS.VIEW_TRANSITS,
        label: "View Transits",
      },
      {
        key: PERMISSIONS.CREATE_TRANSIT,
        label: "Create Transits",
      },
      {
        key: PERMISSIONS.EDIT_TRANSIT,
        label: "Edit Transits",
      },
      {
        key: PERMISSIONS.DELETE_TRANSIT,
        label: "Delete Transits",
      },
    ],
  },

  {
    title: "Invoices",
    permissions: [
      {
        key: PERMISSIONS.VIEW_INVOICES,
        label: "View Invoices",
      },
      {
        key: PERMISSIONS.CREATE_INVOICE,
        label: "Create Invoices",
      },
      {
        key: PERMISSIONS.EDIT_INVOICE,
        label: "Edit Invoices",
      },
      {
        key: PERMISSIONS.DELETE_INVOICE,
        label: "Delete Invoices",
      },
    ],
  },

  {
    title: "Packing Lists",
    permissions: [
      {
        key: PERMISSIONS.VIEW_PACKING_LISTS,
        label: "View Packing Lists",
      },
      {
        key: PERMISSIONS.CREATE_PACKING_LIST,
        label: "Create Packing Lists",
      },
      {
        key: PERMISSIONS.EDIT_PACKING_LIST,
        label: "Edit Packing Lists",
      },
      {
        key: PERMISSIONS.DELETE_PACKING_LIST,
        label: "Delete Packing Lists",
      },
    ],
  },

  {
    title: "Documents",
    permissions: [
      {
        key: PERMISSIONS.VIEW_DOCUMENTS,
        label: "View Documents",
      },
      {
        key: PERMISSIONS.UPLOAD_DOCUMENT,
        label: "Upload Documents",
      },
      {
        key: PERMISSIONS.EDIT_DOCUMENT,
        label: "Edit Documents",
      },
      {
        key: PERMISSIONS.DELETE_DOCUMENT,
        label: "Delete Documents",
      },
    ],
  },
];