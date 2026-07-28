import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

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





console.log("ROUTER LOADED");
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Public Routes
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Protected Routes
  {
    element: <ProtectedRoute />,

    children: [
      {
        element: <DashboardLayout />,

        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },

              {
            path: "/exporters/:id/edit",
            element: <EditExporterPage/>,
            // element: <ExportersPage />,
          },
           {
            path: "/exporters/new",
            element: <CreateExporterPage/>,
            // element: <ExportersPage />,
          },

           {
            path: "/exporters/:id",
            element: <ExporterDetailsPage/>,
            // element: <ExportersPage />,
          },

          {
            path: "/exporters",
            element: <ExporterListPage/>,
            // element: <ExportersPage />,
          },
          {
            path: "/clients",
            element: <ClientListPage />,
          },{
                   path: "/clients/:id",
            element: <ClientDetailsPage />,
          },

          {
                   path: "/clients/new",
            element: <CreateClientPage />,
          },
           {
                   path: "/clients/:id/edit",
            element: <EditClientPage />
          },

        {
  path: "/consignees",
  element: <ConsigneeListPage />,
},
{
  path: "/consignees/new",
  element: <CreateConsigneePage />,
},
{
  path: "/consignees/:id",
  element: <ConsigneeDetailsPage />,
},
{
  path: "/consignees/:id/edit",
  element: <EditConsigneePage />,
},
          {
            path: "/allocations",
            element:<AllocationListPage/>,
          },
          {
            path: "/allocations/new",
            element:<CreateAllocationPage/>,
          },

          {
            path: "/allocations/:id/edit",
            element:<EditAllocationPage/>,
          },
          {
            path: "/allocations/:id",
            element:<AllocationDetailsPage/>,
          },
          {
            path:"/shipments/new",
  element:<CreateShipmentPage />,
          },
          {
          path:"/shipments/:id",
          element:<ShipmentDetailsPage />,
          },
          {
            path:"/shipments",
           element:<ShipmentListPage />,
          },
           {
            path:"/shipments/:id/edit",
           element:<EditShipmentPage />,
          },

          {
            path: "/invoices",
            element: <InvoiceListPage />,
          },
           {
            path: "/invoices/create",
            element: <CreateInvoicePage/>,
          },
  {
            path:"/invoices/:id/edit",
           element:<EditInvoicePage />,
          },
           {
            path: "/invoices/:id",
            element: <InvoiceDetailsPage />,
         },

          {
            path: "/packing-lists",
            element: <PackingListsPage />,
          },

          {
            path:"/packing-lists/create",
            element:<CreatePackingListPage />
          },{
         
  path:"/packing-lists/:id",
  element:<PackingListDetailsPage />
          },

          {
            path:"/packing-lists/:id/edit",
           element:< EditPackingListPage/>,
          },
          {
            path: "/containers/:id",
            element: <ContainerDetailsPage />,
         },

           {
            path: "/containers/:id/edit",
            element: <EditContainerPage />,
         },
           {
            path:"/containers",
           element:< ContainersPage/>,
          },
          {
            path:"/containers/create",
           element:< CreateContainerPage/>,
          },

           {
            path: "/transits/:id/edit",
            element: <EditTransitPage />,
         },
           {
            path:"/transits",
           element:< TransitsPage/>,
          },
          {
            path:"/transits/create",
           element:< CreateTransitPage/>,
          },
          {
            path:"/transits/:id",
           element:<TransitDetailsPage />,
          },
          {
            path:"/documents/create",
           element:< CreateDocumentPage/>,
          },
          {
            path:"/documents/:id",
           element:<DocumentDetailsPage />,
          },

          {
            path: "/documents",
            element: <DocumentsPage />,
          },

          {
            path: "/settings",
            element: <div>Settings</div>,
          },
        ],
      },
    ],
  },


  {
    path: "*",
    element: (
      <div className="flex h-screen items-center justify-center text-2xl font-bold">
        404 | Page Not Found
      </div>
    ),
  },
]);
