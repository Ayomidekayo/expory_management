import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";

import DashboardLayout from "../components/layout/DashboardLayout";

import PackingListsPage from "../pages/packingList/PackingListsPage";
import DocumentsPage from "../pages/documents/DocumentsPage";
import AllocationDetailsPage from "../pages/allocation/AllocationDetailsPage";

import ExporterListPage from "../pages/exporter/ExporterListPage";
import ExporterDetailsPage from "../pages/exporter/ExporterDetailsPage";
import CreateExporterPage from "../pages/exporter/CreateExporterPage";
import EditExporterPage from "../pages/exporter/EditExporterPage";

import CreateConsigneePage from "../pages/consignee/CreateConsigneePage";
import ConsigneeListPage from "../pages/consignee/ConsigneeListPage";
import ConsigneeDetailsPage from "../pages/consignee/ConsigneeDetailsPage";
import EditConsigneePage from "../pages/consignee/EditConsigneePage";

import AllocationListPage from "../pages/allocation/AllocationListPage";
import CreateAllocationPage from "../pages/allocation/CreateAllocationPage";
import EditAllocationPage from "../pages/allocation/EditAllocationPage";

import ShipmentDetailsPage from "../pages/shipment/ShipmentDetailsPage";
import EditShipmentPage from "../pages/shipment/EditShipmentPage";
import CreateShipmentPage from "../pages/shipment/CreateShipmentPage";
import ShipmentListPage from "../pages/shipment/ShipmentsListPage";

import InvoiceListPage from "../pages/invoice/InvoiceListPage";
import CreateInvoicePage from "../pages/invoice/CreateInvoicePage";
import EditInvoicePage from "../pages/invoice/EditInvoicePage";
import InvoiceDetailsPage from "../pages/invoice/InvoiceDetailsPage";

import CreatePackingListPage from "../pages/packingList/CreatePackingListPage";
import PackingListDetailsPage from "../pages/packingList/PackingListDetailPage";
import EditPackingListPage from "../pages/packingList/EditPackingListPage";

import ContainersPage from "../pages/container/ContainersPage";
import ContainerDetailsPage from "../pages/container/ContainerDetailsPage";
import CreateContainerPage from "../pages/container/CreateContainerPage";
import EditContainerPage from "../pages/container/EditContainerPage";

import EditTransitPage from "../pages/transit/EditTransitPage";
import TransitsPage from "../pages/transit/TransitsPage";
import CreateTransitPage from "../pages/transit/CreateTransitPage";
import TransitDetailsPage from "../pages/transit/TransitDetailsPage";

import CreateDocumentPage from "../pages/documents/CreateDocumentPage";
import DocumentDetailsPage from "../pages/documents/DocumentDetailsPage";

import ClientListPage from "../pages/client/ClientListPage";
import ClientDetailsPage from "../pages/client/ClientDetailsPage";
import CreateClientPage from "../pages/client/CreateClientPage";
import EditClientPage from "../pages/client/EditClientPage";

import { DashboardPage } from "../pages/dashboard/Dashboard";
import ProfilePage from "../pages/settings/ProfilePage";
import UsersPage from "../pages/user/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // ================================
  // PUBLIC ROUTES
  // ================================

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  // ================================
  // PROTECTED ROUTES
  // ================================

  {
    element: <ProtectedRoute />,

    children: [
      {
        element: <DashboardLayout />,

        children: [
          // ================================
          // DASHBOARD
          // ================================

          {
            path: "/dashboard",
            element: (
              <PermissionRoute permission="VIEW_DASHBOARD">
                <DashboardPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // EXPORTERS
          // ================================

          {
            path: "/exporters",
            element: (
              <PermissionRoute permission="VIEW_EXPORTERS">
                <ExporterListPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/exporters/new",
            element: (
              <PermissionRoute permission="CREATE_EXPORTER">
                <CreateExporterPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/exporters/:id",
            element: (
              <PermissionRoute permission="VIEW_EXPORTERS">
                <ExporterDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/exporters/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_EXPORTER">
                <EditExporterPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // CLIENTS
          // ================================

          {
            path: "/clients",
            element: (
              <PermissionRoute permission="VIEW_CLIENTS">
                <ClientListPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/clients/new",
            element: (
              <PermissionRoute permission="CREATE_CLIENT">
                <CreateClientPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/clients/:id",
            element: (
              <PermissionRoute permission="VIEW_CLIENTS">
                <ClientDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/clients/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_CLIENT">
                <EditClientPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // CONSIGNEES
          // ================================

          {
            path: "/consignees",
            element: (
              <PermissionRoute permission="VIEW_CONSIGNEES">
                <ConsigneeListPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/consignees/new",
            element: (
              <PermissionRoute permission="CREATE_CONSIGNEE">
                <CreateConsigneePage />
              </PermissionRoute>
            ),
          },

          {
            path: "/consignees/:id",
            element: (
              <PermissionRoute permission="VIEW_CONSIGNEES">
                <ConsigneeDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/consignees/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_CONSIGNEE">
                <EditConsigneePage />
              </PermissionRoute>
            ),
          },

          // ================================
          // ALLOCATIONS
          // ================================

          {
            path: "/allocations",
            element: (
              <PermissionRoute permission="VIEW_ALLOCATIONS">
                <AllocationListPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/allocations/new",
            element: (
              <PermissionRoute permission="CREATE_ALLOCATION">
                <CreateAllocationPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/allocations/:id",
            element: (
              <PermissionRoute permission="VIEW_ALLOCATIONS">
                <AllocationDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/allocations/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_ALLOCATION">
                <EditAllocationPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // SHIPMENTS
          // ================================

          {
            path: "/shipments",
            element: (
              <PermissionRoute permission="VIEW_SHIPMENTS">
                <ShipmentListPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/shipments/new",
            element: (
              <PermissionRoute permission="CREATE_SHIPMENT">
                <CreateShipmentPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/shipments/:id",
            element: (
              <PermissionRoute permission="VIEW_SHIPMENTS">
                <ShipmentDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/shipments/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_SHIPMENT">
                <EditShipmentPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // INVOICES
          // ================================

          {
            path: "/invoices",
            element: (
              <PermissionRoute permission="VIEW_INVOICES">
                <InvoiceListPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/invoices/create",
            element: (
              <PermissionRoute permission="CREATE_INVOICE">
                <CreateInvoicePage />
              </PermissionRoute>
            ),
          },

          {
            path: "/invoices/:id",
            element: (
              <PermissionRoute permission="VIEW_INVOICES">
                <InvoiceDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/invoices/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_INVOICE">
                <EditInvoicePage />
              </PermissionRoute>
            ),
          },

          // ================================
          // PACKING LISTS
          // ================================

          {
            path: "/packing-lists",
            element: (
              <PermissionRoute permission="VIEW_PACKING_LISTS">
                <PackingListsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/packing-lists/create",
            element: (
              <PermissionRoute permission="CREATE_PACKING_LIST">
                <CreatePackingListPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/packing-lists/:id",
            element: (
              <PermissionRoute permission="VIEW_PACKING_LISTS">
                <PackingListDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/packing-lists/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_PACKING_LIST">
                <EditPackingListPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // CONTAINERS
          // ================================

          {
            path: "/containers",
            element: (
              <PermissionRoute permission="VIEW_CONTAINERS">
                <ContainersPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/containers/create",
            element: (
              <PermissionRoute permission="CREATE_CONTAINER">
                <CreateContainerPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/containers/:id",
            element: (
              <PermissionRoute permission="VIEW_CONTAINERS">
                <ContainerDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/containers/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_CONTAINER">
                <EditContainerPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // TRANSITS
          // ================================

          {
            path: "/transits",
            element: (
              <PermissionRoute permission="VIEW_TRANSITS">
                <TransitsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/transits/create",
            element: (
              <PermissionRoute permission="CREATE_TRANSIT">
                <CreateTransitPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/transits/:id",
            element: (
              <PermissionRoute permission="VIEW_TRANSITS">
                <TransitDetailsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/transits/:id/edit",
            element: (
              <PermissionRoute permission="EDIT_TRANSIT">
                <EditTransitPage />
              </PermissionRoute>
            ),
          },

          // ================================
          // DOCUMENTS
          // ================================

          {
            path: "/documents",
            element: (
              <PermissionRoute permission="VIEW_DOCUMENTS">
                <DocumentsPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/documents/create",
            element: (
              <PermissionRoute permission="UPLOAD_DOCUMENT">
                <CreateDocumentPage />
              </PermissionRoute>
            ),
          },

          {
            path: "/documents/:id",
            element: (
              <PermissionRoute permission="VIEW_DOCUMENTS">
                <DocumentDetailsPage />
              </PermissionRoute>
            ),
          },
          {
  path: "users",
  element: (
    <PermissionRoute permission="VIEW_USERS">
      <UsersPage />
    </PermissionRoute>
  ),
},

          // ================================
          // SETTINGS
          // ================================

          {
            path: "/settings",
            element: (
              <PermissionRoute permission="VIEW_DASHBOARD">
                <ProfilePage />
              </PermissionRoute>
            ),
          },
        ],
      },
    ],
  },

  // ================================
  // 404
  // ================================

  {
    path: "*",
    element: (
      <div className="flex h-screen items-center justify-center text-2xl font-bold">
        404 | Page Not Found
      </div>
    ),
  },
]);